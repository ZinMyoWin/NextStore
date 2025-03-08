import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import client, { connectToDB } from "@/app/api/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/User";
import { authConfig } from "./auth.config";

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface CustomSession {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        await connectToDB();
        const user = await User.findOne({
          email: parsedCredentials.data.email,
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          parsedCredentials.data.password,
          user.password
        );

        if (!passwordsMatch) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      const { db } = await connectToDB();

      // Only handle role assignment for Google OAuth
      if (account?.provider === "google") {
        const existingUser = await db
          .collection("users")
          .findOne({ email: user.email });

        if (!existingUser) {
          const role = [
            "mgzinmyowin12@gmail.com",
            "kaunghtikes726@gmail.com",
          ].includes(user.email!)
            ? "admin"
            : "user";
          const result = await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            provider: account.provider,
            providerId: account.providerAccountId,
            image: user.image,
            role: role,
          });
          user.id = result.insertedId.toString();
          user.role = role;
        } else {
          if (!existingUser.role) {
            const role = [
              "mgzinmyowin12@gmail.com",
              "kaunghtikes726@gmail.com",
            ].includes(user.email!)
              ? "admin"
              : "user";
            await db
              .collection("users")
              .updateOne({ _id: existingUser._id }, { $set: { role: role } });
            user.role = role;
          } else {
            user.role = existingUser.role;
          }
          user.id = existingUser._id.toString();
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string | undefined;
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
  },
});
