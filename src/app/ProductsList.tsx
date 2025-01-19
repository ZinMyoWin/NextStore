"use client";
import { Product } from "./product-data";
import ProductCard from "./ui/components/ProductCard";

export default function ProductsList({ products }: { products: Product[] }) {
  


  return (
    <div className='grid grid-cols-4 w-full justify-center gap-4 mt-8'>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} type="product" />
      ))}
    </div>
  );
}
