"use client";
import Image from "next/image";
import AddToCart, { RemoveCartBtn } from "./Button";
import Link from "next/link";
import useCart from "@/app/hooks/useCart";
import DeleteInactive from "../../../../public/icons/delete-inactive.svg";
import DeleteActive from "../../../../public/icons/delete-active.svg";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationAlert } from "./AlertDialog";

interface CartItem {
  _id: string;
  imageUrl: string;
  name: string;
  shortDescription: string;
  price: number;
  type: string;
}

interface ProductCardProps extends CartItem {
  onDelete: (deletedId: string) => void;
}

export default function ProductCard({
  _id,
  imageUrl,
  name,
  shortDescription,
  price,
  type,
  onDelete,
}: ProductCardProps) {
  const { session } = useCart();
  const [deleteActive, setDeleteActive] = useState(false);
  async function deleteProduct() {
    console.log("Delete product clicked");

    try {
      const response = await fetch(`/api/product/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }
      onDelete(_id); // Notify the parent component to update the UI
      // Show success toast
      toast("Product Deleted", {
        description: "The product has been deleted successfully.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  }

  return (
    <div className='grid auto-rows-auto rounded-xl w-fit h-fit cursor-pointer p-2 hover:bg-secondary transition-all ease-in-out duration-300'>
      <Link href={`/products/` + _id} passHref>
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
                deleteProduct={deleteProduct}
                DeleteActiveIcon={DeleteActive}
                DeleteInactiveIcon={DeleteInactive}
              />
            ) : (
              <AddToCart productId={_id} />
            )
          ) : (
            <RemoveCartBtn productId={_id} />
          )}
        </div>
      </div>
    </div>
  );
}
