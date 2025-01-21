"use client";
import Image from "next/image";
import AddToCart, { RemoveCartBtn } from "./Button";
import Link from "next/link";
import useCart from "@/app/hooks/useCart";
import DeleteInactive from "../../../../public/icons/delete-inactive.svg";
import DeleteActive from "../../../../public/icons/delete-active.svg";
import { useState } from "react";
import { ConfirmationAlert } from "./AlertDialog";

interface CartItem {
  _id: string;
  imageUrl: string;
  name: string;
  shortDescription: string;
  price: number;
  type: string;
}

// interface ProductCardProps extends CartItem {
//   onDelete: (deletedId: string) => void;
// }

export default function ProductCard({
  _id,
  imageUrl,
  name,
  shortDescription,
  price,
  type,
}: CartItem) {
  const { session } = useCart();
  const [deleteActive, setDeleteActive] = useState(false);
  const productId = _id;

  

  return (
    <div className='grid auto-rows-auto rounded-xl w-fit h-fit cursor-pointer p-2 hover:bg-secondary transition-all ease-in-out duration-300'>
      <Link href={`/products/` + productId} passHref>
        <Image
          src={"/productsImage/" + imageUrl}
          alt='product-image'
          width={279}
          height={286.48}
          className='justify-self-center rounded-md w-full h-full'
        ></Image>
      </Link>

      <div className='h-fit gap-2 flex flex-col items-start p-2'>
        <h3 className='text-sm font-bold '>{name}</h3>
        <p className='text-sm'>{shortDescription}</p>
        <div className='flex flex-row justify-between w-full'>
          <h2 className='text-3xl font-bold'>{price}</h2>
          {type === "product" ? (
            session?.user?.role === "admin" ? (
              <ConfirmationAlert
                setDeleteActive={setDeleteActive}
                deleteActive={deleteActive}
                productId={productId}
                DeleteActiveIcon={DeleteActive}
                DeleteInactiveIcon={DeleteInactive}
                
              />
            ) : (
              <AddToCart productId={productId} />
            )
          ) : (
            <RemoveCartBtn productId={productId} />
          )}
        </div>
      </div>
    </div>
  );
}
