"use client";
import { motion } from "motion/react";
import notInCart from "../../../../public/icons/cart-unfilled.svg";
import inCart from "../../../../public/icons/cart-filled.svg";
import Image from "next/image";
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
      <motion.div
        initial={{
          opacity: 0,
          x: 10,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        whileHover={{ scale: 1.03 }}
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
        className={``}
      >
        {isLoading ? (
          "Loading"
        ) : isInCart ? (
          <Image src={inCart} alt='in cart' width={35} height={35} />
        ) : (
          <Image src={notInCart} alt='notInCart' width={35} height={35} />
        )}
      </motion.div>
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
      >
        {isLoading ? (
          "Loading"
        ) : (
          <Image src={inCart} alt='in cart' width={35} height={35} />
        )}
      </motion.button>
    </>
  );
};
