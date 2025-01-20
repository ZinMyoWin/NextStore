import { NextRequest } from "next/server";

import { connectToDB } from "@/app/api/db";
import { ObjectId } from "mongodb";

type Params = {
  id: string;
};

const { db } = await connectToDB();

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const userId = id;

  const shoppingCart = await db.collection("carts").findOne({ userId });

  // console.log("Shopping Cart", shoppingCart);

  if (!shoppingCart) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const cartIds = shoppingCart.cartIds;
  // console.log("Card Ids: ", cartIds)
  const productsInCart = await db
    .collection("products")
    .find({ _id: { $in: cartIds.map((id: string) => new ObjectId(id)) } })
    .toArray();

  // console.log("Product In Cart: ", productsInCart);
  return new Response(JSON.stringify(productsInCart), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * POST request handler to add a product to a user's cart.
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @param {Object} params - The route parameters, containing the user ID.
 * @returns {Promise<Response>} - A response containing the updated list of products in the cart.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract the user ID from the route parameters
  const { id } = params;
  const userId = id;

  // Define the expected structure of the request body
  type Body = {
    productId: string; // The ID of the product to add to the cart
  };

  // Parse the request body to get the product ID
  const body: Body = await request.json();
  const productId = body.productId;

  // Log the product ID for debugging purposes
  console.log("Product ID: ", productId);

  /**
   * Update the user's cart in the database:
   * - If the cart for the user doesn't exist, create a new one (upsert: true).
   * - Add the product ID to the `cartIds` array in the cart document.
   * - Return the updated cart document after the update (returnDocument: 'after').
   */
  const updatedCart = await db.collection("carts").findOneAndUpdate(
    { userId }, // Query to find the cart by user ID
    { $push: { cartIds: productId } }, // Update operation: add productId to cartIds array
    { upsert: true, returnDocument: "after" } // Options: create if not exists, return updated document
  );

  // Check if the cart was successfully updated
  if (!updatedCart || !updatedCart.cartIds) {
    console.error("Updated cart is null or does not contain cartIds");
    return new Response(
      JSON.stringify({ error: "Cart not found or could not be updated" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Ensure `cartIds` is always an array, even if it's empty
  const cartIds = Array.isArray(updatedCart.cartIds) ? updatedCart.cartIds : [];
  console.log("Cart IDs: ", cartIds);

  /**
   * Fetch the products from the `products` collection that match the IDs in the cart:
   * - Convert each string ID in `cartIds` to a MongoDB ObjectId.
   * - Use the `$in` operator to find all products with matching `_id`.
   */
  const productsInCart = await db
    .collection("products")
    .find({
      _id: { $in: cartIds.map((id: string) => new ObjectId(id)) },
    })
    .toArray();

  // Log the products in the cart for debugging purposes
  console.log("Products In Cart: ", productsInCart);

  /**
   * Return the list of products in the cart as a JSON response:
   * - Status code 201 indicates successful creation/update.
   * - Set the `Content-Type` header to `application/json`.
   */
  return new Response(JSON.stringify(productsInCart), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  // get the userId
  // get the productId which we want to remove
  //check if the user has a cart
  // if the user does not have a cart, return a 404 status code with a message

  // remove the productId from the user's cart
  // return the updated cart

  const { id } = await params;
  const userId = id;

  type Body = {
    productId: string;
  };

  const body: Body = await request.json();

  const productId = body.productId;

  const afterDeletedCart = await db
    .collection("carts")
    .findOneAndUpdate(
      { userId },
      { $pull: { cartIds: productId } },
      { returnDocument: "after" }
    );

  if (!afterDeletedCart) {
    return new Response(JSON.stringify({ message: "Cart not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const remainingProductsInCart = await db
    .collection("products")
    .find({
      _id: {
        $in: afterDeletedCart.cartIds.map((id: string) => new ObjectId(id)),
      },
    })
    .toArray();

  return new Response(JSON.stringify(remainingProductsInCart), {
    status: 202,
    headers: {
      "Content-Type": "applicatoin/json",
    },
  });
}
