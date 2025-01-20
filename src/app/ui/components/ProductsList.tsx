"use client";
import { Product } from "../../product-data";
import ProductCard from "./ProductCard";

export default function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className='grid grid-cols-4 w-full mt-8 justify-center ml-auto mr-auto gap-12 justify-items-center'>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} type='product' />
      ))}
    </div>
  );
}
