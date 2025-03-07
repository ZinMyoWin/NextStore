import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDB } from "@/app/api/db";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDB();

    // Clear the user's cart
    await db.collection("carts").deleteMany({
      userId: session.user.id,
    });

    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
