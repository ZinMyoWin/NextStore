import ProductsList from "../ProductsList";
export const dynamic = 'force-dynamic';

export default async function ProductsPage(){
    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/product');
    const products = await response.json();
    
    return (
    <div className="w-fit ml-auto mr-auto mt-4 ">
        <h1 className="text-xl font-semibold">Products</h1>

        <ProductsList products={products}/>
    </div>
    )
}