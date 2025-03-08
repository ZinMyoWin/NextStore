// app/api/auth/session/route.ts
import { auth } from "../../../../../auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  console.log("Session: ", session);
  return NextResponse.json(session);
}
