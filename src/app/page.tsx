import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // If user is admin, redirect to products page
  if (
    session?.user &&
    "role" in session.user &&
    session.user.role === "admin"
  ) {
    redirect("/products");
  }

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center space-y-8'>
          <h1 className='text-4xl md:text-6xl font-bold text-foreground'>
            Welcome to MyStore
          </h1>
          <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
            Discover our amazing collection of products at great prices
          </p>
          <div className='flex justify-center gap-4'>
            <Link
              href='/products'
              className='bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors'
            >
              Shop Now
            </Link>
            <Link
              href='/auth/signin'
              className='border border-input bg-background px-8 py-3 rounded-full hover:bg-accent transition-colors'
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
