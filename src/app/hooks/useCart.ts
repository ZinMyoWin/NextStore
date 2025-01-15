
import { useEffect, useState } from "react";
import { Product } from "../product-data";
import { useRouter } from "next/navigation";
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

export default function useCart() {
  const router = useRouter();

  const [cart, setCart] = useState<Product[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserSession() {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const session = await response.json();

      if (session?.user?.id) {
        setSession(session);
        setUserId(session.user.id);
      }
    }

    fetchUserSession();
  }, []);

  useEffect(() => {
    async function fetchCart() {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
        { cache: "no-cache" }
      );
      const cart = await response.json();
      setCart(cart);
      console.log("Cart", cart);
    }
    fetchCart();
  }, [userId]);

  // Add to cart
  async function addToCart(productId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
      {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const updatedCart = await response.json();
    setCart(updatedCart);
  }

  function productIsInCart(productId: string) {
    return cart.some((cartItem) => cartItem.id === productId);
  }

  // Remove From Cart
  async function removeFromCart(productId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
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

  return {
    session,
    addToCart,
    productIsInCart,
    removeFromCart,
    userId,
    cart,
    isLoading,
    checkAuthentication,
  };
}
