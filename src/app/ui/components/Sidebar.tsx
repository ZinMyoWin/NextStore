import Link from "next/link";
import { auth } from "../../../../auth";

export default async function Sidebar() {
  const session = await auth();
  console.log("Session in Sidebar.tsx", session);

  return (
    <div className='w-52 bg-primary text-background h-screen fixed left-0 top-0 shadow-lg shadow-black'>
      <div className='p-4'>
        <h1 className='text-2xl font-extrabold mb-8'>NexE</h1>
        <nav className="w-full mt-2">
          <ul className='flex flex-col space-y-2 font-semibold  hover:*:bg-secondary *:p-2 hover:*:text-text hover:*:rounded-sm hover:*:transition-all hover:*:ease-in-out hover:*:duration-700'>
            <li>
              <Link href='/' className=''>Home</Link>
            </li>
            <li>
              <Link href='/products' className=''>Products</Link>
            </li>
            <li>
              <Link href='/cart' className=''>Cart</Link>
            </li>
            {/* <li>
              <Link href='/checkout' className=''>CheckOut</Link>
            </li> */}
            {session?.user ? (
              <li>
                <Link href='/auth/signout' className=''>Sign Out</Link>
              </li>
            ) : (
              <li>
                <Link href='/auth/signin' className=''>Sign In</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}