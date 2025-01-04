
'use client';
import { useState } from "react"
import { Product } from "../product-data"
import Link from 'next/link'
import Image from 'next/image'

export default function ShoppingCart({initalCartProducts}: {initalCartProducts: Product[]}) {
    const [cartProducts] = useState(initalCartProducts)

    
        return (
        <div>
            <h1>Cart Page</h1>
            <div>
                {cartProducts.map((product)=>(
                    <Link key={product!.id} href={`/products/${product!.id}`}>
                        <h3>{product!.name}</h3>
                        <Image src={'/'+product!.imageUrl} alt="product-image" width={150} height={150}></Image>
                    </Link>
                ))}
        </div>
        </div>)
}