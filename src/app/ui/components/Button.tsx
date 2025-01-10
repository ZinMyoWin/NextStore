"use client";
import { signInWithGoogle } from "@/app/actions";

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
  // Function to check authentication before adding to cart
  function checkAuthentication(productId: string) {
    if (session?.user) {
      // User is authenticated, add to cart
      addToCart(productId);
    } else {
      // User is not authenticated, redirect to sign-in
      signInWithGoogle();
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
          className="bg-red-500 p-2 text-sm text-white rounded-md"
        >
          Remove from cart
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            checkAuthentication(productId);
          }}
          className="bg-blue-500 p-2 text-sm text-white rounded-md"
        >
          Add to cart
        </button>
      )}
    </>
  );
}