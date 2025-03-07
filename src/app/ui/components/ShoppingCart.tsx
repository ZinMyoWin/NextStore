"use client";

import React, { useEffect, useState, useCallback } from "react";
import useCart from "@/app/hooks/useCart";
import PageTransition from "../animations/pageTransition";
import ProductCard from "./ProductCard";
import { Product } from "@/app/product-data";
import { RefreshContext } from "@/app/context/refreshContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

// Create the RefreshContext

export default function ShoppingCart() {
  const { session, isLoading, userId } = useCart();
  const [productIncart, setProductInCart] = useState<Product[]>([]);
  const [cartUpdated, setCartUpdated] = useState(false);

  // Calculate cart total
  const cartTotal = productIncart.reduce(
    (total, product) => total + product.price,
    0
  );
  const shipping = cartTotal > 100 ? 0 : 10;
  const finalTotal = cartTotal + shipping;

  // Fetch the cart data
  const fetchCart = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/users/${userId}/cart`, {
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const cartData = await response.json();
      setProductInCart(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const refreshCart = () => {
    setCartUpdated((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center space-y-4 px-4 text-center'>
        <h2 className='text-2xl font-bold'>Please Sign In</h2>
        <p className='text-muted-foreground'>
          You need to be logged in to view your cart
        </p>
        <Link
          href='/auth/signin'
          className='inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (session?.user?.role === "user") {
    return (
      <RefreshContext.Provider value={refreshCart}>
        <PageTransition>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h1 className='text-3xl font-bold'>Shopping Cart</h1>
                <p className='text-muted-foreground mt-1'>
                  {productIncart.length}{" "}
                  {productIncart.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>
              <Link
                href='/products'
                className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground group'
              >
                <ArrowLeft className='w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1' />
                Continue Shopping
              </Link>
            </div>

            {productIncart.length === 0 ? (
              <div className='text-center py-16 bg-secondary/20 rounded-xl'>
                <h2 className='text-xl font-semibold mb-2'>
                  Your cart is empty
                </h2>
                <p className='text-muted-foreground mb-6'>
                  Looks like you haven&apos;t added any products to your cart
                  yet
                </p>
                <Link
                  href='/products'
                  className='inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Cart Items */}
                <div className='lg:col-span-2'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    {productIncart.map((product) => (
                      <ProductCard key={product._id} {...product} type='cart' />
                    ))}
                  </div>
                </div>

                {/* Cart Summary */}
                <div className='lg:col-span-1'>
                  <div className='bg-card rounded-xl p-6 shadow-sm border border-border/50 sticky top-8'>
                    <h2 className='text-xl font-semibold mb-6'>Cart Summary</h2>

                    <div className='space-y-4'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Subtotal</span>
                        <span className='font-medium'>
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Shipping</span>
                        <span className='font-medium'>
                          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      {shipping > 0 && (
                        <p className='text-xs text-muted-foreground'>
                          Free shipping on orders over $100
                        </p>
                      )}

                      <div className='border-t border-border/50 pt-4 mt-4'>
                        <div className='flex justify-between'>
                          <span className='font-semibold'>Total</span>
                          <span className='font-bold text-lg text-primary'>
                            ${finalTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <CheckoutButton
                        items={productIncart.map((product) => ({
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          image: product.imageUrl,
                          quantity: 1,
                        }))}
                        className='mt-6'
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PageTransition>
      </RefreshContext.Provider>
    );
  }

  return null;
}
