"use client";

import useCart from "@/app/hooks/useCart";

import PageTransition from "../animations/pageTransition";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { Product } from "@/app/product-data";
// import SignIn from "@/app/auth/signin/sign-in";

export default function ShoppingCart() {
  const { session, isLoading, userId } = useCart();
  const [cart, setCart] = useState<Product[]>([]);
  const [cartUpdated, setCartUpdated] = useState(false); // State to track cart updates

  async function fetchCart() {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
      { cache: "no-cache" }
    );
    const cart = await response.json();
    setCart(cart);
    console.log("Cart", cart);
  }

  useEffect(() => {
  
    fetchCart();
  }, [userId, cartUpdated]);

  // Function to manually refresh the cart
  const refreshCart = () => {
    setCartUpdated((prev) => !prev); // Toggle cartUpdated to trigger useEffect
  };

  // Display a loading message while data is being fetched
  if (isLoading) return <div className='h-screen'>Loading...</div>;

  // Display a message if the user is not logged in
  if (!session?.user) {
    return <div className='h-screen'>Login to view the Cart.</div>;
  }
  // Render the shopping cart UI
  return (
    <PageTransition>
      <div className={`${cart.length > 0 ? "w-full " : "w-9/12"} mt-4 h-auto`}>
        <div className=''>
          <h1 className='w-full text-start text-xl font-semibold'>Carts</h1>
        </div>
        <div className='grid grid-cols-4 w-full justify-center ml-auto mr-auto gap-12 justify-items-center'>
          {/* Map through the cart products and render each product */}
          {cart.map((product) => (
            <ProductCard key={product.id} {...product} type='cart' refreshCart ={refreshCart}/>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
