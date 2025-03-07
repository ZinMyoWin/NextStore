"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

// Loading component
function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='max-w-md w-full p-8 bg-card rounded-xl shadow-lg text-center'>
        <div className='animate-pulse space-y-4'>
          <div className='w-16 h-16 bg-muted rounded-full mx-auto'></div>
          <div className='h-6 bg-muted rounded w-3/4 mx-auto'></div>
          <div className='h-4 bg-muted rounded w-1/2 mx-auto'></div>
          <div className='space-y-2'>
            <div className='h-10 bg-muted rounded'></div>
            <div className='h-10 bg-muted rounded'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success content component
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear the cart after successful payment
    const clearCart = async () => {
      try {
        const response = await fetch("/api/cart/clear", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to clear cart");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart");
      }
    };

    if (sessionId) {
      clearCart();
    }
  }, [searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='max-w-md w-full p-8 bg-card rounded-xl shadow-lg text-center'>
        <div className='mb-6'>
          <CheckCircle className='w-16 h-16 text-green-500 mx-auto' />
        </div>
        <h1 className='text-2xl font-bold text-foreground mb-4'>
          Payment Successful!
        </h1>
        <p className='text-muted-foreground mb-8'>
          Thank you for your purchase. Your order has been processed
          successfully.
        </p>
        <div className='space-y-4'>
          <Link
            href='/products'
            className='block w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
          >
            Continue Shopping
          </Link>
          <Link
            href='/orders'
            className='block w-full py-3 px-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors'
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessContent />
    </Suspense>
  );
}
