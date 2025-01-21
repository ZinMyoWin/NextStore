import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";
import { promises as fs } from "fs";
import path from "path";

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
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Get the database connection
    const { db } = await connectToDB();
    const { id } = params;

    // 1. Find the product to get the image filename
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // 2. Delete the product from the database
    const deleteResult = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Failed to delete product" },
        { status: 404 }
      );
    }

    // 3. Delete the associated image file
    const imagePath = path.join(
      process.cwd(),
      "public",
      "productsImage",
      product.imageUrl // e.g., "12345-product-name.jpg"
    );

    try {
      await fs.unlink(imagePath); // Delete the file
      console.log("Image deleted successfully:", imagePath);
    } catch (fileError) {
      console.error("Error deleting image:", fileError);
      // Optionally: You can decide to handle this error (e.g., log it but still return success)
    }

    return NextResponse.json(
      { success: true, message: "Product and image deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Params }
// ) {
//   try {
//     // get the database connection
//     const { db } = await connectToDB();
//     const {name, shortDescription, price, imageUrl} = await request.json()

//     const { id } = await params;

//     const remainingProducts = db
//       .collection("products")
//       .findOneAndUpdate({ _id: new ObjectId(id) } , {});

//     if (!remainingProducts) {
//       return new Response(
//         JSON.stringify({ message: "No Products To Delete. " }),
//         {
//           status: 404,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     return new Response(JSON.stringify(remainingProducts), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);

//     // Return a 500 response for any server errors
//     return new Response("Internal Server Error", {
//       status: 500,
//     });
//   }
// }
