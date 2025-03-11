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

    // Create a URL object from the request URL to parse query parameters
    const url = new URL(request.url);

    // Get the search parameters (query string) from the URL
    const searchParams = url.searchParams;

    // Extract the 'role' query parameter (e.g., ?role=admin), default to undefined if not provided
    const role = searchParams.get("role") || undefined;

    // Initialize an empty object to build the MongoDB query
    const query: Record<string, any> = {};

    // If a role filter is specified, add it to the query object for filtering users
    if (role) query.role = role;

    // Query the 'users' collection in the database with the constructed query and convert results to an array
    const users = await db.collection("users").find(query).toArray();

    // Transform the raw MongoDB documents into an array of User objects with specified fields
    const formattedUsers: User[] = users.map((user) => ({
      name: user.name, // Extract the user's name from the document
      email: user.email, // Extract the user's email from the document
      provider: user.provider, // Extract the authentication provider (e.g., Google, GitHub)
      providerId: user.providerId, // Extract the provider-specific ID for the user
      image: user.image, // Extract the URL of the user's profile image
      role: user.role, // Extract the user's role (e.g., admin, user)
    }));

    // Construct the successful API response object with the formatted user data
    const response: ApiResponse<User[]> = {
      success: true, // Indicate the request was successful
      data: formattedUsers, // Include the list of formatted users as the response data
    };

    // Return the response as JSON with a 200 OK status code
    return NextResponse.json(response, { status: 200 });
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