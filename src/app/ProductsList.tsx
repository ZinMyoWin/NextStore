"use client";
import { Product } from "./product-data";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
export default function ProductsList({
  products,
  initialCart = [],
}: {
  products: Product[];
  initialCart: Product[];
}) {
  const [cart, setCart] = useState(initialCart);

  async function addToCart(productId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart",
      {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const updatedCart = await response.json();
    setCart(updatedCart);
  }

  function prooductIsInCart(productId: string) {
    return cart.some((cartItem) => cartItem.id === productId);
  }

  async function removeFromCart(productId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart",
      {
        method: "DELETE",
        body: JSON.stringify({ productId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const updatedCart = await response.json();
    setCart(updatedCart);
  }

  return (
    <div className='flex flex-row flex-wrap justify-center space-x-4 space-y-4'>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/` + product.id}
          className='w-fit flex flex-row md:flex-row space-x-4 p-4 border border-gray-200 rounded-md shadow-md hover:shadow-lg cursor-pointer'
          passHref
        >
          <div className=''>
            <Image
              src={"/" + product.imageUrl}
              alt='product-image'
              width={300}
              height={300}
            ></Image>
          </div>
          <div className=''>
            <h3 className='text-2xl font-bold '>{product.name}</h3>
            <div className='text-blue-600 text-xl'>${product.price}</div>
            {prooductIsInCart(product.id) ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromCart(product.id);
                }}
              >
                Remove from cart
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product.id);
                }}
              >
                Add to cart
              </button>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
