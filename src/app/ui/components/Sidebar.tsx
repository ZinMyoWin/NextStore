"use client";
import Link from "next/link";
import { useState } from "react";
import HomeActive from "../../../../public/icons/home-active.svg";
import HomeInactive from "../../../../public/icons/home-inactive.svg";
import ProductActive from "../../../../public/icons/product-active.svg";
import ProductInactive from "../../../../public/icons/product-inactive.svg";
import CartActive from "../../../../public/icons/cart-filled.svg";
import CartInactive from "../../../../public/icons/cart-unfilled.svg";
import Login from "../../../../public/icons/login.svg";
import Image from "next/image";
import useCart from "@/app/hooks/useCart";

// Define the type for the hovered icon
type HoveredIcon = "home" | "product" | "cart" | "logout" | "login" | null;

export default function Sidebar() {
  const { session } = useCart();
  const [hoveredIcon, setHoveredIcon] = useState<HoveredIcon>(null);

  const handleMouseEnter = (iconName: HoveredIcon) => {
    setHoveredIcon(iconName);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  return (
    <div className='w-64 bg-background text-text h-screen fixed left-0 top-0 shadow-xl border-r border-border'>
      <div className='p-6 flex flex-col h-screen'>
        <div className='flex items-center gap-3 mb-12 px-2'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            NexE
          </h1>
        </div>
        <nav className='w-full mt-2 h-auto'>
          <ul className='flex flex-col space-y-1.5'>
            {session?.user?.role !== "admin" && (
              <li
                className='group'
                onMouseEnter={() => handleMouseEnter("home")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  className='flex flex-row items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 group-hover:translate-x-1'
                  href='/'
                >
                  <Image
                    src={hoveredIcon === "home" ? HomeActive : HomeInactive}
                    alt='Home Icon'
                    className='w-5 h-5 transition-transform duration-200 group-hover:scale-110'
                  />
                  <p className='w-3/4 text-[15px] font-medium'>Home</p>
                </Link>
              </li>
            )}
            <li
              className='group'
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href='/products'
                className='flex flex-row items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 group-hover:translate-x-1'
              >
                <Image
                  src={
                    hoveredIcon === "product" ? ProductActive : ProductInactive
                  }
                  alt='Product Icon'
                  className='w-5 h-5 transition-transform duration-200 group-hover:scale-110'
                />
                <p className='w-3/4 text-[15px] font-medium'>Products</p>
              </Link>
            </li>
            {session?.user?.role === "user" && (
              <li
                className='group'
                onMouseEnter={() => handleMouseEnter("cart")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href='/cart'
                  className='flex flex-row items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 group-hover:translate-x-1'
                >
                  <Image
                    src={hoveredIcon === "cart" ? CartActive : CartInactive}
                    alt='Cart Icon'
                    className='w-5 h-5 transition-transform duration-200 group-hover:scale-110'
                  />
                  <p className='w-3/4 text-[15px] font-medium'>Cart</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className='flex flex-col space-y-1.5 mt-auto pt-6 border-t border-border'>
          {session?.user ? (
            <div
              className='group'
              onMouseEnter={() => handleMouseEnter("logout")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href='/auth/signout'
                className='flex flex-row items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 group-hover:translate-x-1'
              >
                <Image
                  src={Login}
                  alt='Logout Icon'
                  className='w-5 h-5 transition-transform duration-200 group-hover:scale-110'
                />
                <p className='w-3/4 text-[15px] font-medium'>Log Out</p>
              </Link>
            </div>
          ) : (
            <div
              className='group'
              onMouseEnter={() => handleMouseEnter("login")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href='/auth/signin'
                className='flex flex-row items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 group-hover:translate-x-1'
              >
                <Image
                  src={Login}
                  alt='Login Icon'
                  className='w-5 h-5 transition-transform duration-200 group-hover:scale-110'
                />
                <p className='w-3/4 text-[15px] font-medium'>Login</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
