"use client";
import { motion } from "motion/react";
import notInCart from "../../../../public/icons/cart-unfilled.svg";
import inCart from "../../../../public/icons/cart-filled.svg";
import Image from "next/image";
import useCart from "@/app/hooks/useCart";
import { useContext, useEffect } from "react";
import { RefreshContext } from "@/app/context/refreshContext";

// Define the props type for AddToCart
type cartItemProps = {
  productId: string;
};

export default function AddToCart({ productId }: cartItemProps) {
  // Function to check authentication before adding to cart
  const { removeFromCart, checkAuthentication, productIsInCart, isLoading } =
    useCart();

  function handleOnClick() {
    if (productIsInCart(productId)) {
      removeFromCart(productId);
    } else {
      checkAuthentication(productId);
    }
  }

  // Re-render when cart changes
  useEffect(() => {
    // This ensures the button status is updated when the cart changes
  }, [productIsInCart(productId)]);

  if (isLoading) {
    return (
      <div>
        <svg
          width='30'
          height='30'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className="animate-spin"
        >
          <path
            opacity='0.1'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24 9C20.0218 9 16.2064 10.5804 13.3934 13.3934C10.5804 16.2064 9 20.0218 9 24C9 27.9782 10.5804 31.7936 13.3934 34.6066C16.2064 37.4196 20.0218 39 24 39C27.9782 39 31.7936 37.4196 34.6066 34.6066C37.4196 31.7936 39 27.9782 39 24C39 20.0218 37.4196 16.2064 34.6066 13.3934C31.7936 10.5804 27.9782 9 24 9ZM3 24C3 12.402 12.402 3 24 3C35.598 3 45 12.402 45 24C45 35.598 35.598 45 24 45C12.402 45 3 35.598 3 24Z'
            fill='black'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24 9C20.1328 8.99173 16.4134 10.4854 13.626 13.166C13.0486 13.6999 12.2846 13.9857 11.4985 13.9619C10.7124 13.9381 9.96706 13.6065 9.42302 13.0386C8.87897 12.4707 8.57968 11.7118 8.58959 10.9255C8.59951 10.1391 8.91782 9.38801 9.47602 8.834C13.3801 5.08327 18.5862 2.99209 24 3C24.7957 3 25.5587 3.31607 26.1213 3.87868C26.6839 4.44129 27 5.20435 27 6C27 6.79565 26.6839 7.55871 26.1213 8.12132C25.5587 8.68393 24.7957 9 24 9Z'
            fill='black'
          />
        </svg>
      </div>
    ); // Show a loading state while cart data is being fetched
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", bounce: 0.25 }}
      whileTap={{ scale: 0.7 }}
      onClick={(e) => {
        e.preventDefault();
        handleOnClick();
      }}
    >
      {productIsInCart(productId) ? (
        <Image src={inCart} alt='in cart' width={35} height={35} />
      ) : (
        <Image src={notInCart} alt='notInCart' width={35} height={35} />
      )}
    </motion.div>
  );
}

type removeFromCartItemProps = {
  productId: string;
};

export const RemoveCartBtn = ({ productId }: removeFromCartItemProps) => {
  const { removeFromCart } = useCart();
  const refreshContext = useContext(RefreshContext);
  return (
    <>
      <motion.button
        initial={{
          opacity: 0,
          x: 10,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        whileHover={{ opacity: 0.7, scale: 1.03 }}
        transition={{
          type: "spring",
          bounce: 0.25,
        }}
        whileTap={{
          scale: 0.7,
        }}
        onClick={(e) => {
          e.preventDefault();
          removeFromCart(productId);
          refreshContext();
        }}
      >
        <Image src={inCart} alt='in cart' width={35} height={35} />
      </motion.button>
    </>
  );
};
