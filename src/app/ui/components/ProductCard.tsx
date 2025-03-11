"use client";
import Image from "next/image";
import AddToCart, { RemoveCartBtn } from "./Button";
import Link from "next/link";
import useCart from "@/app/hooks/useCart";
import DeleteInactive from "../../../../public/icons/delete-inactive.svg";
import DeleteActive from "../../../../public/icons/delete-active.svg";
import { useState } from "react";
import { ProductDeleteConfirmationAlert } from "./AlertDialog";

interface CartItem {
  _id: string;
  imageUrl: string;
  name: string;
  shortDescription: string;
  price: number;
  type: string;
  onDelete?: () => void;
}

export default function ProductCard({
  _id,
  imageUrl,
  name,
  shortDescription,
  price,
  type,
  onDelete,
}: CartItem) {
  const { session } = useCart();
  const [deleteActive, setDeleteActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const productId = _id;

  // Determine the link based on user role
  const productLink =
    session?.user?.role === "admin"
      ? `/products/edit/${productId}`
      : `/products/${productId}`;

  return (
    <div
      className='group relative bg-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className='aspect-square w-full overflow-hidden bg-secondary/30'>
        <Link href={productLink} className='block relative w-full h-full'>
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div
            className={`absolute inset-0 bg-black/0 transition-opacity duration-300 ${
              isHovered ? "opacity-10" : "opacity-0"
            }`}
          />
        </Link>
      </div>

      {/* Content Container */}
      <div className='p-4 flex flex-col flex-1'>
        {/* Product Info */}
        <div className='flex-1 space-y-2'>
          <Link href={productLink}>
            <h3 className='font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300'>
              {name}
            </h3>
          </Link>
          <p className='text-sm text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300'>
            {shortDescription}
          </p>
        </div>

        {/* Price and Actions */}
        <div className='flex items-center justify-between pt-4 mt-2 border-t border-border/50'>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground'>Price</p>
            <p className='text-xl font-bold text-primary'>
              ${Number(price).toFixed(2)}
            </p>
          </div>

          <div className='flex items-center gap-2 transition-transform duration-300 group-hover:scale-105'>
            {type === "product" ? (
              session?.user?.role === "admin" ? (
                <div className='flex items-center gap-3'>
                  <Link
                    href={productLink}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                  </Link>
                  <ProductDeleteConfirmationAlert
                    setDeleteActive={setDeleteActive}
                    deleteActive={deleteActive}
                    productId={productId}
                    DeleteActiveIcon={DeleteActive}
                    DeleteInactiveIcon={DeleteInactive}
                    onConfirm={onDelete}
                  />
                </div>
              ) : (
                <AddToCart productId={productId} />
              )
            ) : (
              <RemoveCartBtn productId={productId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
