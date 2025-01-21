"use client";
import Image from "next/image";
import AddToCart, { RemoveCartBtn } from "./Button";
import Link from "next/link";
import useCart from "@/app/hooks/useCart";
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
  const { session } = useCart();

  async function deleteProduct(event: React.MouseEvent<HTMLDivElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    try {
      const response = await fetch(`/api/product/${_id}`, {
        method: 'DELETE',
      });
      console.log("Response", response)
      if (!response.ok) {
        throw new Error('Failed to delete the product');
      }
      alert('Product deleted successfully');
      // Optionally, you can add logic to update the UI or redirect the user
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  }

  return (
    <Link
      href={`/products/` + _id}
      className='grid auto-rows-auto rounded-xl w-fit h-fit cursor-pointer p-2 hover:bg-secondary transition-all ease-in-out duration-300'
      passHref
    >
      <Image
        src={"/productsImage/" + imageUrl}
        alt='product-image'
        width={279}
        height={286.48}
        className='justify-self-center rounded-md w-full h-full'
      ></Image>

      <div className='h-fit gap-2 flex flex-col items-start p-2'>
        <h3 className='text-sm font-bold '>{name}</h3>
        <p className='text-sm'>{shortDescription}</p>
        <div className='flex flex-row justify-between w-full'>
          <h2 className='text-3xl font-bold'>{price}</h2>
          {type === "product" ? (
            session?.user?.role === "admin" ? (
              <div onClick={deleteProduct} className="p-2 bg-accent rounded-lg hover:scale-95">
                Delete
              </div>
            ) : (
              <AddToCart productId={_id} />
            )
          ) : (
            <RemoveCartBtn productId={_id} />
          )}
        </div>
      </div>
    </Link>
  );
}
