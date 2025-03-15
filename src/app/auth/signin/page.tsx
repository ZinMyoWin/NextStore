"use client";

import { signInWithGoogle } from "@/app/actions";
import useCart from "@/app/hooks/useCart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {


  const {session} = useCart() 

  const router = useRouter()
  useEffect(()=>{
    if(!session?.user){
      router.push('/')
    }
  },[session])

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      <div className='w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-lg border border-border'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            Welcome to NextStore
          </h1>
          <p className='text-muted-foreground text-sm'>
            Sign in to access your account
          </p>
        </div>

        {/* Sign In Form */}
        <form action={signInWithGoogle} className='space-y-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-card px-2 text-muted-foreground'>
                Continue with
              </span>
            </div>
          </div>

          <button
            type='submit'
            className='w-full flex items-center justify-center gap-3 px-4 py-3 
                     bg-background border border-border rounded-lg
                     hover:bg-secondary/50 transition-all duration-200
                     text-sm font-medium'
          >
            <Image
              src='/google.svg'
              alt='Google Logo'
              width={20}
              height={20}
              className='w-5 h-5'
            />
            Google Account
          </button>
        </form>

        {/* Footer */}
        <p className='text-center text-sm text-muted-foreground'>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
