"use client";
import useCart from "@/app/hooks/useCart";
import { Product } from "../../product-data";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProductsList({ products }: { products: Product[] }) {
  const { session } = useCart();
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    setProductList(products);
    console.log("Products Updated")
  }, [products]);

  function handleDeleteProduct(deletedId: string): void {
    // Assuming you have a state to manage the products
    const updatedProducts = products.filter(
      (product) => product._id !== deletedId
    );
    // Update the state with the new list of products
    // This is a placeholder, you need to implement the state update logic
    console.log("Updated products list after deletion:", updatedProducts);
    setProductList(updatedProducts);
  }

  if (productList.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full mt-8 justify-center ml-auto mr-auto gap-12 justify-items-center '>
      {productList.map((product) => (
        <ProductCard
          key={product._id}
          {...product}
          type='product'
          onDelete={handleDeleteProduct}
        />
      ))}
      {session?.user?.role === "admin" && (
        <div className='w-full p-2 pt-1 pb-3 h-72'>
          <Link
            href={"/products/add-product"}
            className='h-full mt-1 hover:bg-text hover:text-background bg-secondary grid grid-cols-1 justify-items-center items-center border-dashed border-2 border-primary rounded-md group transition-all ease-in-out duration-300 cursor-pointer'
          >
            <div className=''>Click to Add Product</div>
          </Link>
        </div>
      )}
    </div>
  );
}
