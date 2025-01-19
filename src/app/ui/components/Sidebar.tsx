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
    <div className='w-52 bg-background text-text h-screen fixed left-0 top-0 shadow-lg '>
      <div className='p-4 flex flex-col h-screen'>
        <h1 className='text-2xl font-bold mb-8 px-4 h-1/8'>NexE</h1>
        <nav className='w-full mt-2 h-auto'>
          <ul className='flex flex-col space-y-2  hover:*:bg-secondary *:p-2 *:rounded-sm '>
            <li className='gap-2'>
              <Link
                className='flex flex-row items-center justify-between gap-2'
                href='/'
              >
                <Image src={HomeInactive} alt='' className='w-1/4'></Image>
                <p className='w-3/4 text-[16px]'>Home</p>
              </Link>
            </li>
            <li className='gap-2'>
              <Link
                href='/products'
                className='flex flex-row items-center justify-between gap-2 '
              >
                <Image src={ProductInactive} alt='' className='w-1/4'></Image>
                <p className='w-3/4 text-[16px]'>Product</p>
              </Link>
            </li>
            <li className='gap-2'>
              <Link
                href='/cart'
                className='flex flex-row items-center justify-between gap-2   '
              >
                <Image src={CartInactive} alt='' className='w-1/4'></Image>
                <p className='w-3/4 text-[16px]'>Cart</p>
              </Link>
            </li>
            {/* <li>
              <Link href='/checkout' className=''>CheckOut</Link>
            </li> */}
          </ul>
        </nav>
        
          <div className="flex flex-col space-y-2  hover:*:bg-secondary *:p-2 *:rounded-sm h-full justify-end ">
            {session?.user ? (
              <div>
                <Link
                  href='/auth/signout'
                  className='flex flex-row items-center justify-between gap-2'
                >
                  <Image src={Login} alt='' className='w-1/4'></Image>
                  <p className='w-3/4 text-[16px]'>Log Out</p>
                </Link>
              </div>
            ) : (
              <div>
                <Link
                  href='/auth/signin'
                  className='flex flex-row items-center justify-between gap-2 '
                >
                  <Image src={Login} alt='' className='w-1/4'></Image>
                  <p className='w-3/4 text-[16px] '>Login</p>
                </Link>
              </div>
            )}
          
        </div>
      </div>
    </div>
  );
}
