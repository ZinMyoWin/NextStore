import { NextRequest } from "next/server";

import { connectToDB } from "@/app/api/db";

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
    .find({ id: { $in: cartIds } })
    .toArray();

  // console.log("Product In Cart: ", productsInCart);
  return new Response(JSON.stringify(productsInCart), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  const userId = id;

  // have the userId
  // if we dont have the userId in the carts object, create a new key with the userId and assign an empty array to it
  // have the productId
  // add the productId to the user's cart
  // return the updated cart

  type Body = {
    productId: string;
  };

  const body: Body = await request.json();

  const productId = body.productId;

  // if the user does not have a cart, create one and add the product
  const updatedCart = await db
    .collection("carts")
    .findOneAndUpdate(
      { userId },
      { $push: { cartIds: productId } },
      { upsert: true, returnDocument: "after" }
    );

  const productsInCart = await db
    .collection("products")
    .find({ id: { $in: updatedCart.cartIds } })
    .toArray();

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
    .find({ id: { $in: afterDeletedCart.cartIds } })
    .toArray();

  return new Response(JSON.stringify(remainingProductsInCart), {
    status: 202,
    headers: {
      "Content-Type": "applicatoin/json",
    },
  });
}
