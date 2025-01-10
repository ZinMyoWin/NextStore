"use server";
import { signIn } from "../../auth";
import { signOut } from "../../auth";

export async function signInWithGoogle() {
  await signIn("google");
}
export async function singOut() {
  await signOut();
}

