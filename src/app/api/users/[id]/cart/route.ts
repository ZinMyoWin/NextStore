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
  { params }: { params: Params }
) {
  const { id } = await params;
  const userId = id;

  type Body = {
    productId: string;
  };

  const body: Body = await request.json();
  const productId = body.productId;

  const updatedCart = await db
    .collection("carts")
    .findOneAndUpdate(
      { userId },
      { $push: { cartIds: productId } },
      { upsert: true, returnDocument: "after" }
    );

  if (!updatedCart || !updatedCart.cartIds) {
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

  const cartIds = Array.isArray(updatedCart.cartIds) ? updatedCart.cartIds : [];

  const productsInCart = await db
    .collection("products")
    .find({
      _id: { $in: cartIds.map((id: string) => new ObjectId(id)) },
    })
    .toArray();

  return new Response(JSON.stringify(productsInCart), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request: Request, { params }: { params: Params }) {
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
      "Content-Type": "application/json",
    },
  });
}
