import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Account, User, Session } from "next-auth";
import Google from "next-auth/providers/google";
import client, { connectToDB } from "@/app/api/db";
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";


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
      user: User;
      account: Account | null;
    }) {
      const { db } = await connectToDB();

      // Check if the user already exists in the database
      const existingUser = await db
        .collection("users")
        .findOne({ email: user.email });

      if (!existingUser) {
        // If no existing user, create a new one
        const role =
          user.email === "mgzinmyowin12@gmail.com" ? "admin" : "user"; // Assign "admin" role to specific email
          const result = await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            provider: account?.provider,
            providerId: account?.providerAccountId,
            image: user.image,
            role: role, // Assign role based on email
          });
        user.id = result.insertedId.toString(); // Attach the MongoDB _id to the user object
        user.role = role;
      } else {
        // If the user exists but doesn't have a role, assign a default role
        if (!existingUser.role) {
          const role =
            user.email === "mgzinmyowin12@gmail.com" ? "admin" : "user"; // Assign "admin" role to specific email
          await db.collection("users").updateOne(
            { _id: existingUser._id },
            { $set: { role: role } } // Assign role based on email
          );
          user.role = role; // Update the user object
        } else {
          console.log("Existing User Role: ", existingUser.role);
          user.role = existingUser.role; // Use the existing role
          console.log("Updated User Role: ", existingUser.role);
        }

        user.id = existingUser._id.toString(); // Use the existing user's _id
      }

      console.log("User during sign-in:", user); // Debugging
      console.log("Account during sign-in:", account); // Debugging

      // Force re-login for users who didn't have a role previously
      if (!existingUser?.role) {
        return false; // Prevent sign-in and force re-login
      }

      return true; // Allow sign-in
    },
    async jwt({ token, user }) {
      const { db } = await connectToDB();

      console.log("JWT callback triggered. Initial token:", token);

      if (user) {
        console.log("User passed to JWT callback:", user);

        try {
          const currentUser = await db.collection("users").findOne({
            email: user.email,
          });

          if (!currentUser) {
            console.warn("No user found in the database for ID:", user.id);
          } else {
            console.log("Current User found in the database:", currentUser);
            token.id = currentUser._id.toString(); // Attach user ID
            token.role = currentUser.role ?? "user"; // Attach role
          }
        } catch (error) {
          console.error("Error querying the database in JWT callback:", error);
        }
      }

      console.log("Token during JWT callback after processing:", token);
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (token?.id) {
        session.user.id = token.id as string; // Safely attach user ID to the session
        session.user.role = token.role ?? "user"; // Attach role to the session
      }
      console.log("Session during session callback:", session); // Debugging
      return session;
    },
  },
});
