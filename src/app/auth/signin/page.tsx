"use client";

import { signInWithGoogle } from "@/app/actions";

export default function SignIn() {
  return (
    <div className="flex justify-center items-center h-svh">
      <form action={signInWithGoogle} className=" w-2/6 h-2/5 bg-gray-200 flex flex-col items-center justify-around ">
        <h4 className="font-bold">Login Form</h4>
        
        <button type='submit' className="transition-all ease-in-out duration-300 
        p-2 hover:bg-blue-500 bg-blue-600 text-white rounded-md"><p>Login with Google </p></button>
      </form>
    </div>
  );
}
