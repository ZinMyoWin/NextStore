"use client";
import Image from "next/image";
import ImagePreview from '../../../../public/icons/guidance_image.svg'

interface CartItem {
  productName: string;
  shortDescription: string;
  price: string;
  image: File | null;
}

// interface ProductCardProps extends CartItem {
//   onDelete: (deletedId: string) => void;
// }

export default function PreviewProductCard({
  productName,
  shortDescription,
  price,
  image,
}: CartItem) {
  return (
    <div>
         <p className="font-semibold mb-2">Preview Card</p>
        <div className='grid auto-rows-auto rounded-xl w-fit h-fit p-2 bg-secondary transition-all ease-in-out duration-300'>
        
          <Image
            src={image ? URL.createObjectURL(image) : ImagePreview}
            alt='product-image'
            width={279}
            height={286.48}
            className='justify-self-center rounded-md bg-background'
          ></Image>
          <div className='h-fit gap-2 flex flex-col items-start p-2'>
            <h3 className='text-sm font-bold '>{productName ? productName: 'Product Name'}</h3>
            <p className='text-sm'>{shortDescription? shortDescription: 'Short Description'}</p>
            <h2 className='text-3xl font-bold'>{price? price: "$$"}</h2>
          </div>
        </div>
    </div>
  );
}
