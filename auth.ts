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
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        const { db } = await connectToDB();
        const existingUser = await db.collection("users").findOne({ email: user.email });
    
        if (!existingUser) {
          const role = user.email === "mgzinmyowin12@gmail.com" ? "admin" : "user";
          const result = await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            provider: account?.provider,
            providerId: account?.providerAccountId,
            image: user.image,
            role: role,
          });
          user.id = result.insertedId.toString();
          user.role = role;
        } else {
          if (!existingUser.role) {
            const role = user.email === "mgzinmyowin12@gmail.com" ? "admin" : "user";
            await db.collection("users").updateOne(
              { _id: existingUser._id },
              { $set: { role: role } }
            );
            user.role = role;
          } else {
            user.role = existingUser.role;
          }
          user.id = existingUser._id.toString();
        }
    
        console.log("User during sign-in:", user);
        console.log("Account during sign-in:", account);
    
        if (existingUser && !existingUser.role) {
          return false;
        }
    
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign-in on error
      }
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
