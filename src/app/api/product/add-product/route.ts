import { promises as fs } from "fs";
import path from "path";
import { connectToDB } from "../../db"; // Replace with your actual DB connection utility
import { NextResponse } from "next/server";

// Define the type for the product data
interface ProductData {
  name: string;
  imageUrl: string;
  shortDescription: string;
  price: string;
}

export async function POST(req: Request) {
  try {
    // Extract product data from the request body
    const { name, shortDescription, price, imageUrl }: ProductData =
      await req.json();
      // console.log(name)
      // console.log(shortDescription)
      // console.log(price)
      // console.log(imageUrl)

    // Validate required fields
    if (!name || !shortDescription || !price || !imageUrl) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

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
    const imageName = `${Date.now()}-${name.replace(/\s+/g, "-")}.jpg`;

    // Define the path to save the image in the public/productsImage folder
    const imageDir = path.join(process.cwd(), "public", "productsImage");
    const imagePath = path.join(imageDir, imageName);

    // Ensure the directory exists
    await fs.mkdir(imageDir, { recursive: true });

    // Write the image to the file system
    await fs.writeFile(imagePath, imageBuffer);

    // Connect to the database
    const { db } = await connectToDB();
    const productsCollection = db.collection("products");

    // Create a product object
    const productData = {
      name,
      shortDescription,
      price: parseFloat(price),
      imageUrl: `${imageName}`, // Relative URL for the saved image
      createdAt: new Date(),
    };

    // Insert the product into the database
    const result = await productsCollection.insertOne(productData);

    // Respond with success and the inserted product
    return NextResponse.json(
      { success: true, product: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product." },
      { status: 500 }
    );
  }
}