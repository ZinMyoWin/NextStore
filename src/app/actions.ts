"use server";
import { signIn, signOut } from "../../auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/products" });
}

export async function signOutAction() {
  try {
    await signOut({
      redirect: false,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}
