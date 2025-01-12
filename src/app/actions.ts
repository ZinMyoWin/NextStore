"use server";
import { signIn } from "../../auth";
import { signOut } from "../../auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/products" });
}
export async function singOut() {
  await signOut({ redirectTo: "/cart" });
}
