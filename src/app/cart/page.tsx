

import ShoppingCart from "./ShoppingCart";

export const dynamic = 'force-dynamic';

export default async function Cart(){


    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/users/2/cart')
    const cart = await response.json()
    return <ShoppingCart initalCartProducts= {cart}/>

}