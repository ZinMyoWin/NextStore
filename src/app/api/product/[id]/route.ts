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

// Define the type for the product data
interface ProductData {
  name?: string;
  imageUrl?: string;
  shortDescription?: string;
  price?: string;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract product data from the request body
    const { name, shortDescription, price, imageUrl }: ProductData =
      await req.json();

    // Get the product ID from the URL params
    const { id } = params;

    // Connect to the database
    const { db } = await connectToDB();
    const productsCollection = db.collection("products");

    // Find the existing product
    const existingProduct = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Handle image update
    let updatedImageUrl = existingProduct.imageUrl; // Use the existing image URL by default

    if (imageUrl && imageUrl.startsWith("data:")) {
      // Convert the base64 image string into binary format
      const base64Data = imageUrl.split(",")[1]; // Remove the data URL prefix
      if (!base64Data) {
        return NextResponse.json(
          { error: "Invalid image format." },
          { status: 400 }
        );
      }

      const imageBuffer = Buffer.from(base64Data, "base64");

      // Generate a unique filename for the image
      const imageName = `${Date.now()}-${
        name || existingProduct.name.replace(/\s+/g, "-")
      }.webp`;

      // Define the path to save the image in the public/productsImage folder
      // const imageDir = path.join(process.cwd(), "public", "productsImage");
      const imageDir = "/tmp";
      const imagePath = path.join(imageDir, imageName);

      // Ensure the directory exists
      await fs.mkdir(imageDir, { recursive: true });

      // Write the new image to the file system
      await fs.writeFile(imagePath, imageBuffer);

      // Update the image URL
      updatedImageUrl = imageName;

      // Delete the old image file
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        "productsImage",
        existingProduct.imageUrl
      );

      // Check if the old image file exists before deleting
      try {
        await fs.access(oldImagePath); // Check if the file exists
        await fs.unlink(oldImagePath); // Delete the file
        console.log("Old image deleted successfully:", oldImagePath);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }

    // Create an object with updated fields
    const updatedFields = {
      name: name || existingProduct.name,
      shortDescription: shortDescription || existingProduct.shortDescription,
      price: price ? parseFloat(price) : existingProduct.price,
      imageUrl: updatedImageUrl,
      updatedAt: new Date(),
    };

    // Update the product in the database
    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedFields },
      { returnDocument: "after" } // Return the updated document
    );

    // Respond with success and the updated product
    return NextResponse.json(
      { success: true, product: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}
