import { promises as fs } from "fs"; // File system module to work with files
import path from "path"; // Path module to handle file paths
import { connectToDB } from "../../db"; // Replace with your actual DB connection utility
import { NextRequest } from "next/server";

// Define the type for the product data
interface ProductData {
  name: string;
  imageUrl: string;
  shortDescription: string;
  price: string;
}

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      // Extract product data from the request body
      const { name, shortDescription, price, imageUrl }: ProductData =
        await req.json();

      // Validate required fields
      if (!name || !shortDescription || !price || !imageUrl) {
        // return res.status(400).json({ error: 'All fields are required.' });
        return new Response(JSON.stringify({ message: "Cart not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // Convert the base64 image string into binary format
      const imageBuffer = Buffer.from(imageUrl.split(",")[1], "base64");

      // Generate a unique filename for the image
      const imageName = `${Date.now()}-${name.replace(/\s+/g, "-")}.jpg`;

      // Define the path to save the image in the public/productsImage folder
      const imagePath = path.join(
        process.cwd(),
        "public",
        "productsImage",
        imageName
      );

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
        imageUrl: `/${imageName}`, // Relative URL for the saved image
        createdAt: new Date(),
      };

      // Insert the product into the database
      const result = await productsCollection.insertOne(productData);

      // Respond with success and the inserted product
      // res.status(200).json({ success: true, product: result });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error adding product:", error);
      // res.status(500).json({ error: 'Failed to add product.' });
      return new Response(JSON.stringify({ error: "Failed to add product." }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } else {
    // Handle invalid HTTP methods
    // res.setHeader('Allow', ['POST']);

    // res.status(405).end(`Method ${req.method} Not Allowed`);
    return new Response(
      JSON.stringify({ error: `Method ${req.method} Not Allowed` }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
