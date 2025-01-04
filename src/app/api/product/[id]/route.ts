import { NextRequest } from "next/server";
import { connectToDB } from "../../db";

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Connect to the database
    const { db } = await connectToDB();

    // Extract the `id` from the request parameters like params.id
    const { id } = await params;

    // Query the database to find the product by `id`
    const product = await db.collection("products").findOne({ id: id });

    // If no product is found, return a 404 response
    if (!product) {
      return new Response("Product not found", {
        status: 404,
      });
    }

    // Return the found product as JSON
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    // Return a 500 response for any server errors
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
