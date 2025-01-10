import Link from "next/link";
import { auth } from "../../../../auth";

export default async function Sidebar() {
  const session = await auth();
  console.log("Session in Sidebar.tsx", session);

  return (
    <div className='w-64 bg-blue-500 h-screen fixed left-0 top-0'>
      <div className='p-5'>
        <h1 className='text-2xl font-extrabold text-white mb-8'>NexE</h1>
        <nav>
          <ul className='flex flex-col space-y-4 font-semibold text-white'>
            <li>
              <Link href='/' className='hover:text-blue-200'>Home</Link>
            </li>
            <li>
              <Link href='/products' className='hover:text-blue-200'>Products</Link>
            </li>
            <li>
              <Link href='/cart' className='hover:text-blue-200'>Cart</Link>
            </li>
            {/* <li>
              <Link href='/checkout' className='hover:text-blue-200'>CheckOut</Link>
            </li> */}
            {session?.user ? (
              <li>
                <Link href='/auth/signout' className='hover:text-blue-200'>Sign Out</Link>
              </li>
            ) : (
              <li>
                <Link href='/auth/signin' className='hover:text-blue-200'>Sign In</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}