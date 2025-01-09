"use client";
import { useState } from "react";
import { Product } from "../product-data";
import Link from "next/link";
import Image from "next/image";

export default function ShoppingCart({
  initalCartProducts,
}: {
  initalCartProducts: Product[];
}) {
  const [cartProducts, setCartProducts] = useState(initalCartProducts);

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
    setCartProducts(updatedCart);
  }
  return (
    <div className={`${cartProducts.length > 0 ? "w-fit" : "w-9/12"} mt-4 `}>
      <h1 className='w-full text-start text-xl font-semibold'>
        Carts
      </h1>
      <div className='grid grid-cols-3 w-full justify-center ml-auto mr-auto gap-12 justify-items-center'>
        {cartProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/` + product.id}
            className='grid auto-rows-auto w-fit h-fit rounded-md cursor-pointer'
            passHref
          >
            <Image
              src={"/productsImage/" + product.imageUrl}
              alt='product-image'
              width={339.61}
              height={286.48}
            ></Image>
            <div className='h-fit gap-2 flex flex-col items-start'>
              <h3 className='text-sm font-bold '>{product.name}</h3>
              <p className='text-sm'>${product.shortDescription}</p>
              <h2 className='text-3xl font-bold'>${product.price}</h2>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFromCart(product.id);
                }}
                className='bg-red-500  p-2 text-sm text-white rounded-md'
              >
                Remove from cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
