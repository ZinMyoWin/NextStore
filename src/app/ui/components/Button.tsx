"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define the Session type
type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

type Session = {
  user?: User;
  expires?: string;
};

// Define the props type for AddToCart
type cartItemProps = {
  session: Session | null; // Session can be null
  productId: string;
  productIsInCart: (productId: string) => boolean;
  removeFromCart: (productId: string) => void;
  addToCart: (productId: string) => void;
};

export default function AddToCart({
  session,
  productId,
  productIsInCart,
  removeFromCart,
  addToCart,
}: cartItemProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Function to check authentication before adding to cart
  function checkAuthentication(productId: string) {
    if (session?.user) {
      // User is authenticated, add to cart
      setIsLoading(true);
      try {
        addToCart(productId);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // User is not authenticated, redirect to sign-in
      router.push("/auth/signin");
    }
  }

  return (
    <>
      {productIsInCart(productId) ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            removeFromCart(productId);
          }}
          className='bg-red-500 p-2 text-sm text-white rounded-md'
        >
          Remove from cart
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            checkAuthentication(productId);
          }}
          className='bg-blue-500 p-2 text-sm text-white rounded-md'
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add to cart"}
        </button>
      )}
    </>
  );
}
