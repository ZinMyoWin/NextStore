import Link from "next/link";
import SignIn from "../../../../components/sign-in";
import { auth } from "../../../../auth";
import Image from "next/image";
import SignOut from "../../../../components/sing-out";

export default async function Navbar() {
  const session = await auth();
  console.log("Session in Navbar.tsx",session);
  return (
    <div className='w-full bg-blue-500 grid grid-cols-1 justify-items-center'>
      <div className="w-10/12 flex flex-row justify-between items-center p-5">
        <h1 className='text-2xl font-extrabold text-white'>NexE</h1>
        <nav>
          <ul className='flex flex-row justify-between items-center space-x-2 font-semibold text-white'>
            <li>
              <Link href='/'>Home</Link>
            </li>
            <li>
              <Link href='/products'>Products</Link>
            </li>
            <li>
              <Link href='/cart'>Carts</Link>
            </li>
            {/* <li>
              <Link href='/checkout'>CheckOut</Link>
            </li> */}
            {session?.user ? (
              <>
                <Image
                  src={session.user.image ?? ""}
                  alt={session.user.name ?? ""}
                  width={30}
                  height={30}
                />
                <SignOut />
              </>
            ) : (
              <SignIn />
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
