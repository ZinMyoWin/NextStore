"use client";
import Image from "next/image";
import AddToCart, { RemoveCartBtn } from "./Button";
import Link from "next/link";
// import useCart from "@/app/hooks/useCart";

type cartItems = {
  _id: string;
  imageUrl: string;
  name: string;
  shortDescription: string;
  price: number;
  type: string;
};

export default function ProductCard({
  _id,
  imageUrl,
  name,
  shortDescription,
  price,
  type,
}: cartItems) {
  return (
    <Link
      href={`/products/` + _id}
      className='grid auto-rows-auto rounded-xl w-fit cursor-pointer p-2 hover:bg-secondary transition-all ease-in-out duration-300'
      passHref
    >
      <Image
        src={"/productsImage/" + imageUrl}
        alt='product-image'
        width={279}
        height={286.48}
        className='justify-self-center rounded-md'
      ></Image>

      <div className='h-fit gap-2 flex flex-col items-start p-2'>
        <h3 className='text-sm font-bold '>{name}</h3>
        <p className='text-sm'>{shortDescription}</p>
        <div className='flex flex-row justify-between w-full'>
          <h2 className='text-3xl font-bold'>${price}</h2>
          {type === "product" ? (
            <div>
              <AddToCart productId={_id} />
            </div>
          ) : (
            <RemoveCartBtn productId={_id} />
          )}
        </div>
      </div>
    </Link>
  );
}
