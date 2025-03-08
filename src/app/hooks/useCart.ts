import { useEffect, useState } from "react";
import { Product } from "../product-data";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserSession() {
      try {
        const response = await fetch("/api/auth/session", { 
          cache: "no-store",
          credentials: "include"
        });
        const data = await response.json();
        
        if (data?.user) {
          setSession(data);
          setUserId(data.user.id);
        } else {
          setSession(null);
          setUserId(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
        setUserId(null);
      }
    }
    fetchUserSession();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function fetchCart() {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}/cart`, {
            cache: "no-cache",
            credentials: "include"
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.status}`);
          }

          const cart = await response.json();
          setCart(cart);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          timeoutId = setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      } else {
        timeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }

    fetchCart();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userId]);

  async function addToCart(productId: string) {
    if (userId) {
      const response = await fetch(`/api/users/${userId}/cart`, {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
    }
  }

  function productIsInCart(productId: string) {
    return cart.some((cartItem) => cartItem._id === productId);
  }

  async function removeFromCart(productId: string) {
    if (userId) {
      const response = await fetch(`/api/users/${userId}/cart`, {
        method: "DELETE",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
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
