import { NextResponse } from "next/server";
import { connectToDB } from "../db";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "../../../../auth";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to add products" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const productName = formData.get("productName") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);

    // Validate inputs
    if (
      !image ||
      !productName ||
      !shortDescription ||
      isNaN(price) ||
      isNaN(quantity)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary with optimization
    const imageBuffer = await image.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${image.type};base64,${imageBase64}`,
      {
        folder: "products",
        transformation: [
          { width: 800, height: 800, crop: "limit" }, // Resize if needed
          { quality: "auto:good" }, // Automatic quality optimization
          { fetch_format: "auto" }, // Automatic format optimization
        ],
        eager: [
          // Generate thumbnails in parallel
          { width: 400, height: 400, crop: "fill" },
          { width: 200, height: 200, crop: "fill" },
        ],
        eager_async: true, // Process thumbnails asynchronously
      }
    );

    const { db } = await connectToDB();

    // Create product with optimized image URL
    await db.collection("products").insertOne({
      name: productName,
      shortDescription,
      price,
      quantity,
      imageUrl: uploadResponse.secure_url,
      cloudinaryPublicId: uploadResponse.public_id, // Add this line
      thumbnails:
        uploadResponse.eager?.map(
          (t: { secure_url: string }) => t.secure_url
        ) || [],
      userId: session.user.id,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDB();
    const products = await db.collection("products").find().toArray();
    console.log("All Products From: ", products);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
