"use client";

import React, { createContext, useEffect, useState } from "react";
import useCart from "@/app/hooks/useCart";
import PageTransition from "../animations/pageTransition";
import ProductCard from "./ProductCard";
import { Product } from "@/app/product-data";

// Create the RefreshContext
export const RefreshContext = createContext<() => void>(() => {});

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
  if (isLoading) return <div className="h-screen">Loading...</div>;

  // If the user is not logged in
  if (!session?.user) {
    return <div className="h-screen">Login to view the Cart.</div>;
  }

  return (
    <RefreshContext.Provider value={refreshCart}>
      <PageTransition>
        <div className={`${cart.length > 0 ? "w-full" : "w-9/12"} mt-1 h-auto`}>
        <div className="px-2 pt-1">
          <h1 className='text-2xl font-bold'>Carts</h1>
        </div>
          <div className="grid grid-cols-4 w-full mt-8 justify-center ml-auto mr-auto gap-12 justify-items-center">
            {cart.map((product) => (
              <ProductCard key={product.id} {...product} type="cart" />
            ))}
          </div>
        </div>
      </PageTransition>
    </RefreshContext.Provider>
  );
}
