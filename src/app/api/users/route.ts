// src/app/api/users/route.tsx

import { connectToDB } from "../../api/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { User } from "next-auth";


// Define a generic interface for the API response structure
interface ApiResponse<T> {
  success: boolean; // Boolean flag indicating if the request was successful
  data: T; // Generic data field to hold the response payload (e.g., list of users)
  message?: string; // Optional field for error messages or additional information
}

// Export the GET handler function for the /api/users route, handling HTTP GET requests
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Attempt to get the current user session by calling the auth function
    const session = await auth();

    // Check if the session exists and contains a user object to verify if the user is logged in
    if (!session?.user) {
      // If no user is authenticated, return a 401 Unauthorized response with an error message
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in" }, // Response body with failure status
        { status: 401 } // HTTP status code for Unauthorized
      );
    }

    // Verify if the authenticated user has the "admin" role for authorization
    if (session.user.role !== "admin") {
      // If the user is not an admin, return a 403 Forbidden response with an error message
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" }, // Response body with failure status
        { status: 403 } // HTTP status code for Forbidden
      );
    }

    // Connect to the MongoDB database using the connectToDB utility and retrieve the db instance
    const { db } = await connectToDB();


    // Query the 'users' collection in the database with the constructed query and convert results to an array
    const users= await db.collection("users").find().toArray();

    

    // Return the response as JSON with a 200 OK status code
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    // Catch any errors that occur during the execution of the try block
    // Log the error to the console for debugging purposes
    console.error("Error fetching users:", error);

    // Determine the error message based on whether the error is an instance of Error
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    // Return a 500 Internal Server Error response with the error message
    return NextResponse.json(
      { success: false, message: errorMessage }, // Response body with failure status and error message
      { status: 500 } // HTTP status code for Internal Server Error
    );
  }
}
