"use client";

import Link from "next/link";
import Image from "next/image";
import useCart from "@/app/hooks/useCart";
import { RemoveCartBtn } from "./Button";
import PageTransition from "../animations/pageTransition";
// import SignIn from "@/app/auth/signin/sign-in";



export default function ShoppingCart() {
  const {session, cart, removeFromCart, isLoading } = useCart()


  

  // Display a loading message while data is being fetched
  if (isLoading) return <div className='h-screen'>Loading...</div>;

  // Display a message if the user is not logged in
  if (!session?.user) {
    return <div className='h-screen'>Login to view the Cart.</div>;
  }
  // Render the shopping cart UI
  return (
    <PageTransition>
    <div className={`${cart.length > 0 ? "w-full " : "w-9/12"} mt-4 h-full`}>
      <div className="">
        <h1 className='w-full text-start text-xl font-semibold'>Carts</h1>
      </div>
      <div className='grid grid-cols-4 w-full justify-center ml-auto mr-auto gap-12 justify-items-center'>
        {/* Map through the cart products and render each product */}
        {cart.map((product) => (
          <Link
            key={product.id}
            href={`/products/` + product.id}
            className='grid auto-rows-auto w-fit h-fit rounded-md cursor-pointer'
            passHref
          >
            {/* Display the product image */}
            <Image
              src={"/productsImage/" + product.imageUrl}
              alt='product-image'
              width={339.61}
              height={286.48}
            ></Image>
            <div className='h-fit gap-2 flex flex-col items-start'>
              {/* Display the product name */}
              <h3 className='text-sm font-bold '>{product.name}</h3>

              {/* Display the product short description */}
              <p className='text-sm'>${product.shortDescription}</p>

              {/* Display the product price */}
              <h2 className='text-3xl font-bold'>${product.price}</h2>

              {/* Button to remove the product from the cart */}
              <RemoveCartBtn
              productId={product.id}
              removeFromCart={removeFromCart}
              isLoading = {isLoading}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
    </PageTransition>
  );
}
