import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Account, User, Session } from "next-auth";
import Google from "next-auth/providers/google";
import client, { connectToDB } from "@/app/api/db";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

interface CustomUser extends User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface CustomSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

interface CustomJwt extends JWT {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
  role?: string | null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: MongoDBAdapter(client) as Adapter,
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: CustomUser;
      account: Account | null;
    }) {
      const { db } = await connectToDB();

      // Check if the user already exists in the database
      const existingUser = await db
        .collection("users")
        .findOne({ email: user.email });

      if (!existingUser) {
        // If no existing user, create a new one
        const result = await db.collection("users").insertOne({
          name: user.name,
          email: user.email,
          provider: account?.provider,
          providerId: account?.providerAccountId,
          image: user.image,
          role: "user",
        });
        user.id = result.insertedId.toString(); // Attach the MongoDB _id to the user object
        user.role = "user";
      } else {
        if (existingUser.role === "admin") {
          user.id = existingUser._id.toString(); // Use the existing user's _id
        } else {
          user.id = existingUser._id.toString(); // Use the existing user's _id
          user.role = existingUser.role ?? "user";
        }
      }

      console.log("User during sign-in:", user); // Debugging
      console.log("Account during sign-in:", account); // Debugging

      return true; // Allow sign-in
    },
    async jwt({ token, user }: { token: CustomJwt; user?: CustomUser }) {
      console.log("JWT callback triggered"); // Should log
      if (user) {
        token.id = user.id; // Attach user ID to the token
        if (user.role === "admin") {
          token.role = user.role ?? "admin";
        } else {
          token.role = user.role ?? "user";
        }
      }
      console.log("Token during JWT callback:", token); // Debugging
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: CustomJwt;
    }) {
      if (token?.id) {
        session.user.id = token.id as string; // Safely attach user ID to the session
        if (token.role === "admin") {
          session.user.role = token.role ?? "admin";
        } else {
          session.user.role = token.role ?? "user";
        }
      }
      console.log("Session during session callback:", session); // Debugging
      return session;
    },
  },
});
