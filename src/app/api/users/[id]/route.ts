import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    const { db } = await connectToDB();
    const { id } = params;

    // Validate the ID as a MongoDB ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if the user exists
    const user = await db.collection("users").findOne({
      _id: objectId,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user
    await db.collection("users").deleteOne({
      _id: objectId,
    });

    // Return success response
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}