"use client";
import { motion } from "motion/react";

// Define the props type for AddToCart
type cartItemProps = {
  productId: string;
  removeFromCart: (productId: string) => void;
  checkAuthentication: (productId: string) => void;
  isInCart: boolean;
  isLoading: boolean;
};

export default function AddToCart({
  isInCart,
  removeFromCart,
  checkAuthentication,
  productId,
  isLoading,
}: cartItemProps) {
  // Function to check authentication before adding to cart

  function handleOnClick() {
    if (isInCart) {
      removeFromCart(productId);
    } else {
      checkAuthentication(productId);
    }
  }

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
          handleOnClick();
        }}
        className={`${
          isInCart ? "bg-red-500" : "bg-blue-500"
        } p-2 text-sm text-white rounded-md`}
      >
        {isLoading ? "Loading" : isInCart ? "Remove from cart" : "Add to cart"}
      </motion.button>
    </>
  );
}

type removeFromCartItemProps = {
  productId: string;
  removeFromCart: (productId: string) => void;

  isLoading: boolean;
};

export const RemoveCartBtn = ({
  productId,

  removeFromCart,
  isLoading,
}: removeFromCartItemProps) => {
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
        }}
        className={`${"bg-red-500"} p-2 text-sm text-white rounded-md`}
      >
        {isLoading ? "Loading" : "Remove from cart"}
      </motion.button>
    </>
  );
};
