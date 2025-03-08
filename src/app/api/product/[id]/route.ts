import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";
import { promises as fs } from "fs";
import path from "path";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDB();
    const { id } = params;

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDB();
    const { id } = params;

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(product.cloudinaryPublicId);
    }

    await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

interface ProductData {
  name?: string;
  imageUrl?: string;
  shortDescription?: string;
  price?: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, shortDescription, price, imageUrl }: ProductData = await req.json();
    const { id } = params;

    const { db } = await connectToDB();
    const productsCollection = db.collection("products");

    const existingProduct = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let updatedImageUrl = existingProduct.imageUrl;

    if (imageUrl && imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1];
      if (!base64Data) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
      }

      const imageBuffer = Buffer.from(base64Data, "base64");
      const imageName = `${Date.now()}-${(name || existingProduct.name).replace(/\s+/g, "-")}.webp`;
      const imageDir = path.join(process.cwd(), "public", "productsImage");
      const imagePath = path.join(imageDir, imageName);

      await fs.mkdir(imageDir, { recursive: true });
      await fs.writeFile(imagePath, imageBuffer);

      updatedImageUrl = imageName;

      const oldImagePath = path.join(process.cwd(), "public", "productsImage", existingProduct.imageUrl);
      try {
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath);
        console.log("Old image deleted successfully:", oldImagePath);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }

    const updatedFields = {
      name: name || existingProduct.name,
      shortDescription: shortDescription || existingProduct.shortDescription,
      price: price ? parseFloat(price) : existingProduct.price,
      imageUrl: updatedImageUrl,
      updatedAt: new Date(),
    };

    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, product: result });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}