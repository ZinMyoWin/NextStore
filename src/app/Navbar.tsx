import Link from 'next/link';

export default function Navbar() {

    return (
        <div className='flex flex-row justify-between items-center p-4 bg-gray-200'>
            <h1 className='text-2xl font-extrabold '>My Store</h1>
            <nav >
                <ul className='flex flex-row justify-between items-center space-x-2 font-semibold'>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/products">Products</Link>
                    </li>
                    <li>
                        <Link href="/cart">Carts</Link>
                    </li>
                    <li>
                        <Link href="/checkout">CheckOut</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}