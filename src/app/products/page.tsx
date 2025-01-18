import ProductsList from "../ProductsList";
import PageTransition from "../ui/animations/pageTransition";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {

  
  const response = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + "/api/product"
  );
  const products = await response.json();

  return (
    <PageTransition>
      <div className=' mt-4 '>
        <h1 className='text-xl font-semibold'>Products</h1>

        <ProductsList products={products} />
      </div>
    </PageTransition>
  );
}
