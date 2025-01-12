"use client";
import { useEffect, useState } from "react";
import { Product } from "../../product-data";
import Link from "next/link";
import Image from "next/image";
// import SignIn from "@/app/auth/signin/sign-in";

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

export default function ShoppingCart() {
  // State to store the cart products
  const [cartProducts, setCartProducts] = useState<Product[]>([]);

  // State to store the user ID
  const [userId, setUserId] = useState<string | null>(null);

  // State to store the session data
  const [session, setSession] = useState<Session | null>(null);

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Fetch the user session when the component mounts
  useEffect(() => {
    async function fetchUserSession() {
      try {
        // Fetch the session data from the API
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        // If the session contains a user ID, update the session and userId state
        if (session?.user?.id) {
          setSession(session);
          setUserId(session.user.id);
        }
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error("Error fetching session:", error);
      } finally {
        // Set loading to false once the fetch is complete (whether successful or not)
        setLoading(false);
      }
    }

    // Call the fetchUserSession function
    fetchUserSession();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Fetch the user's cart when the userId changes
  useEffect(() => {
    async function fetchCart() {
      if (userId) {
        try {
          // Fetch the cart data for the user from the API
          const response = await fetch(
            process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
            { cache: "no-cache" } // Ensure the response is not cached
          );
          const cart = await response.json();

          // Update the cartProducts state with the fetched cart data
          setCartProducts(cart);
          console.log("Cart", cart);
        } catch (error) {
          // Log any errors that occur during the fetch
          console.error("Error fetching cart:", error);
        }
      }
    }

    // Call the fetchCart function
    fetchCart();
  }, [userId]); // This effect runs whenever userId changes

  // Function to remove a product from the cart
  async function removeFromCart(productId: string) {
    if (userId) {
      try {
        // Send a DELETE request to remove the product from the cart
        const response = await fetch(
          process.env.NEXT_PUBLIC_SITE_URL + `/api/users/${userId}/cart`,
          {
            method: "DELETE",
            body: JSON.stringify({ productId }), // Send the product ID in the request body
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // If the response is not OK, throw an error
        if (!response.ok) {
          throw new Error("Failed to remove product from cart");
        }

        // Parse the updated cart data from the response
        const updatedCart = await response.json();

        // Update the cartProducts state with the updated cart data
        setCartProducts(updatedCart);
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error("Error removing product from cart:", error);
      }
    }
  }

  // Display a loading message while data is being fetched
  if (loading) return <div className='h-screen'>Loading...</div>;

  // Display a message if the user is not logged in
  if (!session?.user) {
    return <div className='h-screen'>Login to view the Cart.</div>;
  }
  // Render the shopping cart UI
  return (
    <div className={`${cartProducts.length > 0 ? "w-full " : "w-9/12"} mt-4 h-screen`}>
      <h1 className='w-full text-start text-xl font-semibold'>Carts</h1>
      <div className='grid grid-cols-3 w-full justify-center ml-auto mr-auto gap-12 justify-items-center'>
        {/* Map through the cart products and render each product */}
        {cartProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/` + product.id}
            className='grid auto-rows-auto w-fit h-fit rounded-md cursor-pointer'
            passHref
          >
            {/* Display the product image */}
            <Image
              src={"/productsImage/" + product.imageUrl}
              alt='product-image'
              width={339.61}
              height={286.48}
            ></Image>
            <div className='h-fit gap-2 flex flex-col items-start'>
              {/* Display the product name */}
              <h3 className='text-sm font-bold '>{product.name}</h3>

              {/* Display the product short description */}
              <p className='text-sm'>${product.shortDescription}</p>

              {/* Display the product price */}
              <h2 className='text-3xl font-bold'>${product.price}</h2>

              {/* Button to remove the product from the cart */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent the link from navigating
                  removeFromCart(product.id); // Call the removeFromCart function
                }}
                className='bg-red-500  p-2 text-sm text-white rounded-md'
              >
                Remove from cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
