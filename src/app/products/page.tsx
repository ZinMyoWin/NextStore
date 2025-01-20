import ProductsList from "../ui/components/ProductsList";
import PageTransition from "../ui/animations/pageTransition";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + "/api/product"
  );
  const products = await response.json();

  return (
    <PageTransition>
      <div className=' mt-1 '>
        <div className='px-2 pt-1'>
          <h1 className='text-2xl font-bold'>Products</h1>
        </div>

        <ProductsList products={products} />
      </div>
    </PageTransition>
  );
}
