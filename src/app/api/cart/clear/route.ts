/**
 * Cart Clear API Route
 *
 * This API endpoint handles clearing all items from a user's shopping cart.
 * It requires authentication and removes all cart entries for the authenticated user.
 *
 * Endpoint: POST /api/cart/clear
 * Authentication: Required
 *
 * Responses:
 * - 200: Cart cleared successfully
 * - 401: Unauthorized (no valid session)
 * - 500: Server error
 */

import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { connectToDB } from "@/app/api/db";

export async function POST() {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    const { db } = await connectToDB();

    // Clear the user's cart by removing all entries
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
