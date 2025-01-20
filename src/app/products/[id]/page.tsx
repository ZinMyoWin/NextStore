import NotFound from "@/app/not-found";
import Image from "next/image";
// import { products } from "../../product-data";
export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const response = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + `/api/product/${id}`
  );
  const product = await response.json();

  return (
    <div>
      {product ? (
        <>
          <h1 className='font-bold text-xl'>{product.name}</h1>
          <Image src={`/productsImage/${product.imageUrl}`} alt="" width={200} height={300} ></Image>
          <div className='text-lg'>{product.shortDescription}</div>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
