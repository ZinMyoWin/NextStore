"use client";
import useCart from "@/app/hooks/useCart";
import { Product } from "../../product-data";
import ProductCard from "./ProductCard";
import Link from "next/link";

export default function ProductsList({ products }: { products: Product[] }) {
  const { session } = useCart();

  return (
    <div className='grid grid-cols-4 w-full mt-8 justify-center ml-auto mr-auto gap-12 justify-items-center '>
      {products.map(( product) => (
        <ProductCard key={product._id} {...product} type='product' />
      ))}
      {session?.user?.role === "user" && (
        <div className="w-full p-2 pt-1 pb-3 h-72">
          <Link
            href={"/products/add-product"}
            className='h-full mt-1 hover:bg-accent bg-secondary hover:text-background grid grid-cols-1 justify-items-center items-center border-dashed border-2 border-accent rounded-md group transition-all ease-in-out duration-300 cursor-pointer'
          >
            <div className=''>Add Product</div>
          </Link>
        </div>
      )}
    </div>
  );
}
