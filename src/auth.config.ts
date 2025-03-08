import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "@/app/models/User";
import { connectToDB } from "@/app/api/db";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  interface Session {
    user: {
      role?: string;
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      const { db } = await connectToDB();

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
        session.user.role = token.role as string;
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
} satisfies NextAuthConfig;
