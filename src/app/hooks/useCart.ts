import { useEffect, useState } from "react";
import { Product } from "../product-data";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
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
  const [isLoading, setIsLoading] = useState(true); // Track loading state

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
    let timeoutId: NodeJS.Timeout;

    async function fetchCart() {
      if (userId) {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
            { cache: "no-cache" }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.status}`);
          }

          const cart = await response.json();
          setCart(cart);
        } catch (error) {
          console.error("Error fetching cart:", error);
          // Optionally, you can set an error state here
        } finally {
          // Wait for 2 seconds before setting isLoading to false
          timeoutId = setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      } else {
        timeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 1000); // If no userId, ensure loading is set to false immediately
      }
    }

    fetchCart();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear the timeout if the component unmounts
      }
    };
  }, [userId]);

  async function addToCart(productId: string) {
    // console.log("PRODUCT ID: ", productId)
    if (userId) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
        {
          method: "POST",
          body: JSON.stringify({ productId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const updatedCart = await response.json();
      console.log("Updated Cart", updatedCart)
      setCart(updatedCart);
    }
  }

  function productIsInCart(productId: string) {
    return cart.some((cartItem) => cartItem._id === productId);
  }

  async function removeFromCart(productId: string) {
    if (userId) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
        {
          method: "DELETE",
          body: JSON.stringify({ productId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const updatedCart = await response.json();
      setCart(updatedCart);
    }
  }

  function checkAuthentication(productId: string) {
    if (session?.user) {
      setIsLoading(true);
      addToCart(productId).finally(() =>
        setTimeout(() => {
          setIsLoading(false);
        }, 300)
      );
    } else {
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
