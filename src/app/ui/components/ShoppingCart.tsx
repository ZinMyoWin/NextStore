"use client";

import React, { useEffect, useState } from "react";
import useCart from "@/app/hooks/useCart";
import PageTransition from "../animations/pageTransition";
import ProductCard from "./ProductCard";
import { Product } from "@/app/product-data";
import { RefreshContext } from "@/app/context/refreshContext";

// Create the RefreshContext

export default function ShoppingCart() {
  const { session, isLoading, userId } = useCart();
  const [cart, setCart] = useState<Product[]>([]);
  const [cartUpdated, setCartUpdated] = useState(false);

  // Fetch the cart data
  async function fetchCart() {
    if (!userId) return; // Ensure userId is available
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${userId}/cart`,
        { cache: "no-cache" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const cartData = await response.json();
      setCart(cartData);
      console.log("Cart", cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  // Trigger fetchCart when userId or cartUpdated changes
  useEffect(() => {
    fetchCart();
  }, [userId, cartUpdated]);

  // Function to refresh the cart manually
  const refreshCart = () => {
    setCartUpdated((prev) => !prev);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <svg
          width='30'
          height='30'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='animate-spin'
        >
          <path
            opacity='0.1'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24 9C20.0218 9 16.2064 10.5804 13.3934 13.3934C10.5804 16.2064 9 20.0218 9 24C9 27.9782 10.5804 31.7936 13.3934 34.6066C16.2064 37.4196 20.0218 39 24 39C27.9782 39 31.7936 37.4196 34.6066 34.6066C37.4196 31.7936 39 27.9782 39 24C39 20.0218 37.4196 16.2064 34.6066 13.3934C31.7936 10.5804 27.9782 9 24 9ZM3 24C3 12.402 12.402 3 24 3C35.598 3 45 12.402 45 24C45 35.598 35.598 45 24 45C12.402 45 3 35.598 3 24Z'
            fill='black'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24 9C20.1328 8.99173 16.4134 10.4854 13.626 13.166C13.0486 13.6999 12.2846 13.9857 11.4985 13.9619C10.7124 13.9381 9.96706 13.6065 9.42302 13.0386C8.87897 12.4707 8.57968 11.7118 8.58959 10.9255C8.59951 10.1391 8.91782 9.38801 9.47602 8.834C13.3801 5.08327 18.5862 2.99209 24 3C24.7957 3 25.5587 3.31607 26.1213 3.87868C26.6839 4.44129 27 5.20435 27 6C27 6.79565 26.6839 7.55871 26.1213 8.12132C25.5587 8.68393 24.7957 9 24 9Z'
            fill='black'
          />
        </svg>
      </div>
    ); // Show a loading state while cart data is being fetched
  }

  // If the user is not logged in
  if (!session?.user?.id) {
    return <div className='h-screen'>Login to view the Cart.</div>;
  }

  if (session?.user?.id) {
    console.log("SESSION IN Shopping Cart: ", session.user);
    if (session?.user?.role === "user") {
      return (
        <RefreshContext.Provider value={refreshCart}>
          <PageTransition>
            <div
              className={`${cart.length > 0 ? "w-full" : "w-9/12"} mt-1 h-auto`}
            >
              <div className='px-2 pt-1'>
                <h1 className='text-2xl font-bold'>Carts</h1>
              </div>
              <div className='grid grid-cols-4 w-full mt-8 justify-center ml-auto mr-auto gap-12 justify-items-center'>
                {cart.map((product) => (
                  <ProductCard key={product.id} {...product} type='cart' />
                ))}
              </div>
            </div>
          </PageTransition>
        </RefreshContext.Provider>
      );
    } else {
      return <div>Hello</div>;
    }
  }
}
