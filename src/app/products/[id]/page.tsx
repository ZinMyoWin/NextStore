import NotFound from "@/app/not-found";
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
          <div className='text-lg'>{product.description}</div>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
