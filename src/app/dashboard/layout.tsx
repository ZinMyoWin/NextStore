"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/app/hooks/useCart";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Wait a bit to ensure session is properly loaded
    const timer = setTimeout(() => {
      if (!session?.user) {
        router.push("/auth/signin");
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [session, router]);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 animate-in fade-in-50'>
        <div className='flex flex-col gap-8'>
          {/* Header Skeleton */}
          <div className='flex items-center justify-between'>
            <div className='h-8 w-32 bg-secondary rounded-lg animate-pulse'></div>
          </div>

          {/* Dashboard Content Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Profile Card Skeleton */}
            <div className='col-span-1'>
              <div className='bg-card rounded-lg border border-border p-6 space-y-6'>
                <div className='flex flex-col items-center text-center space-y-4'>
                  <div className='w-24 h-24 rounded-full bg-secondary animate-pulse'></div>
                  <div className='space-y-2'>
                    <div className='h-6 w-32 bg-secondary rounded-lg animate-pulse mx-auto'></div>
                    <div className='h-4 w-20 bg-secondary rounded-lg animate-pulse mx-auto'></div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-4 h-4 bg-secondary rounded-full animate-pulse'></div>
                    <div className='h-4 w-48 bg-secondary rounded-lg animate-pulse'></div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='w-4 h-4 bg-secondary rounded-full animate-pulse'></div>
                    <div className='h-4 w-32 bg-secondary rounded-lg animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Skeleton */}
            <div className='col-span-1 md:col-span-2'>
              <div className='bg-card rounded-lg border border-border p-6 space-y-6'>
                <div className='flex items-center justify-between'>
                  <div className='h-6 w-32 bg-secondary rounded-lg animate-pulse'></div>
                  <div className='h-9 w-28 bg-secondary rounded-lg animate-pulse'></div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className='space-y-2'>
                      <div className='h-4 w-24 bg-secondary rounded-lg animate-pulse'></div>
                      <div className='h-10 w-full bg-secondary rounded-lg animate-pulse'></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Skeleton */}
              <div className='mt-8 bg-card rounded-lg border border-border p-6 space-y-6'>
                <div className='h-6 w-36 bg-secondary rounded-lg animate-pulse'></div>
                <div className='space-y-4'>
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className='flex items-center gap-4 p-4 rounded-lg bg-accent/50'
                    >
                      <div className='w-10 h-10 rounded-full bg-secondary animate-pulse'></div>
                      <div className='space-y-2'>
                        <div className='h-4 w-36 bg-secondary rounded-lg animate-pulse'></div>
                        <div className='h-3 w-24 bg-secondary rounded-lg animate-pulse'></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
