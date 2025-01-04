import ProductsList from "../ProductsList";
export const dynamic = 'force-dynamic';

export default async function ProductsPage(){
    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/product');
    const products = await response.json();

    const response2= await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/users/2/cart');
    const cart = await response2.json();

    return (
    <div>
        <h1>Products Page</h1>

        <ProductsList products={products} initialCart = {cart}/>
    </div>
    )
}