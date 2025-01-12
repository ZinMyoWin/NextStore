"use client";
import { Product } from "./product-data";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddToCart from "./ui/components/Button";

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

export default function ProductsList({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<Product[]>([]);
  // State to store the session data
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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

  return (
    <div className='grid grid-cols-3 w-full justify-center gap-12'>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/` + product.id}
          className='grid auto-rows-auto rounded-md w-fit cursor-pointer'
          passHref
        >
          <Image
            src={"/productsImage/" + product.imageUrl}
            alt='product-image'
            width={339.61}
            height={286.48}
          ></Image>

          <div className='h-fit gap-2 flex flex-col items-start'>
            <h3 className='text-sm font-bold '>{product.name}</h3>
            <p className='text-sm'>${product.shortDescription}</p>
            <h2 className='text-3xl font-bold'>${product.price}</h2>
            <AddToCart
              session={session}
              productId={product.id}
              productIsInCart={productIsInCart}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
