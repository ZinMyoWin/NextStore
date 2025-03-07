import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../db";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("productName") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Convert the file to buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "product-images",
          },
          (error, result) => {
            if (error) reject(error);
            if (!result) reject(new Error("Upload failed"));
            resolve(result as UploadApiResponse);
          }
        );

        uploadStream.write(buffer);
        uploadStream.end();
      }
    );

    const { db } = await connectToDB();

    // Save product with Cloudinary URL
    const result = await db.collection("products").insertOne({
      name,
      shortDescription,
      price: parseFloat(price),
      imageUrl: uploadResponse.secure_url,
      cloudinaryPublicId: uploadResponse.public_id,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Product created successfully", productId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDB();
    const products = await db.collection("products").find().toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
