// lib/auth.ts
import bcrypt from "bcrypt";
import { connectToDB } from "@/app/api/db";

export async function registerUser(email: string, password: string, name?: string) {
  const { db } = await connectToDB();
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds
  const role = email === "mgzinmyowin12@gmail.com" ? "admin" : "user";
  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    name,
    role,
    provider: "credentials",
  });

  return { id: result.insertedId.toString(), email, role };
}