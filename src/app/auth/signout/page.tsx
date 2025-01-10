"use client";
import { singOut } from "@/app/actions";

export default function SignOut() {
  return (
    <form action={singOut}>
      <button type='submit'>Sign Out</button>
    </form>
  );
}
