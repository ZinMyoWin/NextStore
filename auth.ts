import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { type User } from "next-auth";
import Google from "next-auth/providers/google";
import client, { connectToDB } from "@/app/api/db";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface CustomUser extends User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CustomSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: MongoDBAdapter(client) as Adapter,
  callbacks: {
    async signIn({ user, account }) {
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
        });
        user.id = result.insertedId.toString(); // Attach the MongoDB _id to the user object
      } else {
        user.id = existingUser._id.toString(); // Use the existing user's _id
      }

      console.log("User during sign-in:", user); // Debugging
      console.log("Account during sign-in:", account); // Debugging

      return true; // Allow sign-in
    },
    async jwt({ token, user }: { token: JWT; user?: CustomUser }) {
      if (user) {
        token.id = user.id; // Attach user ID to the token
      }
      console.log("Token during JWT callback:", token); // Debugging
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      if (token?.id) {
        session.user.id = token.id as string; // Safely attach user ID to the session
      }
      console.log("Session during session callback:", session); // Debugging
      return session;
    },
  },
});