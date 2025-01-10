"use client";

import { signInWithGoogle } from "@/app/actions";

export default function SignIn() {
  return (
    <form action={signInWithGoogle}>
      <button type='submit'>Login </button>
    </form>
  );
}
