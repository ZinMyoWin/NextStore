import Link from "next/link";
import { auth } from "../../../../auth";
import HomeActive from "../../../../public/icons/home-active.svg";
import HomeInactive from "../../../../public/icons/home-inactive.svg";
import ProductActive from "../../../../public/icons/product-active.svg";
import ProductInactive from "../../../../public/icons/product-inactive.svg";
import CartActive from "../../../../public/icons/cart-filled.svg";
import CartInactive from "../../../../public/icons/cart-unfilled.svg";
import Login from "../../../../public/icons/login.svg";
import Image from "next/image";

export default async function Sidebar() {
  const session = await auth();
  console.log("Session in Sidebar.tsx", session);

  return (
    <div className='w-52 bg-primary text-background h-screen fixed left-0 top-0 shadow-lg shadow-black'>
      <div className='p-4'>
        <h1 className='text-2xl font-extrabold mb-8'>NexE</h1>
        <nav className='w-full mt-2'>
          <ul className='flex flex-col space-y-2 font-semibold  hover:*:bg-accent *:p-2 *:rounded-sm'>
            <li>
              <Link
                className='flex flex-row items-center justify-between'
                href='/'
              >
                <Image src={HomeInactive} alt='' width={30} height={30}></Image>
                <p className="w-3/4">Home</p>
              </Link>
            </li>
            <li>
              <Link href='/products' className='flex flex-row items-center justify-between px-1'>
              <Image src={ProductInactive} alt='' width={30} height={30}></Image>
              <p className="w-3/4">Product</p>
              </Link>
            </li>
            <li>
              <Link href='/cart' className='flex flex-row items-center justify-between px-1'>
              <Image src={CartInactive} alt='' width={30} height={30}></Image>
              <p className="w-3/4">Cart</p>
              </Link>
            </li>
            {/* <li>
              <Link href='/checkout' className=''>CheckOut</Link>
            </li> */}
            {session?.user ? (
              <li>
                <Link href='/auth/signout' className='flex flex-row items-center justify-between px-1'>
                <Image src={Login} alt='' width={30} height={30}></Image>
                <p className="w-3/4">Log Out</p>
                </Link>
              </li>
            ) : (
              <li>
                <Link href='/auth/signin' className='flex flex-row items-center justify-between px-1'>
                <Image src={Login} alt='' width={30} height={30}></Image>
                <p className="w-3/4">Login</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
