import Link from "next/link";
import SignIn from "../../components/sign-in";
import { auth } from "../../auth";
import Image from "next/image";
import SignOut from "../../components/sing-out";

export default async function Navbar() {
  const session = await auth();
  console.log(session);
  return (
    <div className='flex flex-row justify-between items-center p-4 bg-gray-200'>
      <h1 className='text-2xl font-extrabold '>My Store</h1>
      <nav>
        <ul className='flex flex-row justify-between items-center space-x-2 font-semibold'>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/products'>Products</Link>
          </li>
          <li>
            <Link href='/cart'>Carts</Link>
          </li>
          <li>
            <Link href='/checkout'>CheckOut</Link>
          </li>

          {session?.user? (
            <>
              <Image src={session.user.image?? ""} alt={session.user.name??""} width={30} height={30}/>
              <SignOut/>
            </>
          ) : (
            <SignIn />
          )}
        </ul>
      </nav>
    </div>
  );
}
