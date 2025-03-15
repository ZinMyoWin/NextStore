import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Account, User, Session } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import client, { connectToDB } from "@/app/api/db";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>, request: Request) {
        const email = typeof credentials.email === "string" ? credentials.email : undefined;
        const password = typeof credentials.password === "string" ? credentials.password : undefined;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const { db } = await connectToDB();
        const user = await db.collection("users").findOne({ email });
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(password, user.password as string);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  adapter: MongoDBAdapter(client instanceof Promise ? await client : client) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === "development", // Only debug in dev
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        const { db } = await connectToDB();
        const existingUser = await db.collection("users").findOne({ email: user.email });

        if (!existingUser) {
          const role = user.email === "mgzinmyowin12@gmail.com" ? "admin" : "user";
          const result = await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            provider: account?.provider || "credentials",
            providerId: account?.providerAccountId || null,
            image: user.image,
            role,
          });
          user.id = result.insertedId.toString();
          user.role = role;
        } else {
          user.id = existingUser._id.toString();
          user.role = existingUser.role || (user.email === "mgzinmyowin12@gmail.com" ? "admin" : "user");
          if (!existingUser.role) {
            await db.collection("users").updateOne(
              { _id: existingUser._id },
              { $set: { role: user.role } }
            );
          }
        }
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const { db } = await connectToDB();
        const dbUser = await db.collection("users").findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role || "user";
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});