"use client";
import { Product } from "./product-data";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "./ui/components/Button";
import useCart from "./hooks/useCart";

export default function ProductsList({ products }: { products: Product[] }) {
  
  const {productIsInCart, removeFromCart, checkAuthentication, isLoading } = useCart();

  return (
    <div className='grid grid-cols-4 w-full justify-center gap-4 '>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/` + product.id}
          className='grid auto-rows-auto rounded-xl w-fit cursor-pointer p-2 hover:bg-secondary transition-all ease-in-out duration-300'
          passHref
        >
          <Image
            src={"/productsImage/" + product.imageUrl}
            alt='product-image'
            width={279}
            height={286.48}
            className="justify-self-center"
          ></Image>

          <div className='h-fit gap-2 flex flex-col items-start p-2'>
            <h3 className='text-sm font-bold '>{product.name}</h3>
            <p className='text-sm'>{product.shortDescription}</p>
            <div className="flex flex-row justify-between w-full">
              <h2 className='text-3xl font-bold'>${product.price}</h2>
              <AddToCart
              isInCart = {productIsInCart(product.id)}
              removeFromCart={removeFromCart}
                         isLoading = {isLoading}
              checkAuthentication = {checkAuthentication}
              productId={product.id}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
