"use client";

import useCart from "@/app/hooks/useCart";

import PageTransition from "../animations/pageTransition";
import ProductCard from "./ProductCard";
// import SignIn from "@/app/auth/signin/sign-in";

export default function ShoppingCart() {
  const { session, cart, isLoading } = useCart();

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
            <ProductCard key={product.id} {...product} type='cart' />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
