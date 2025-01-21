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
    <div className="w-52 bg-background text-text h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-4 flex flex-col h-screen">
        <h1 className="text-2xl font-bold mb-8 px-4 h-1/8">NexE</h1>
        <nav className="w-full mt-2 h-auto">
          <ul className="flex flex-col space-y-2 hover:*:bg-secondary *:p-2 *:rounded-sm">
            <li
              className="gap-2"
              onMouseEnter={() => handleMouseEnter("home")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                className="flex flex-row items-center justify-between gap-2"
                href="/"
              >
                <Image
                  src={hoveredIcon === "home" ? HomeActive : HomeInactive}
                  alt="Home Icon"
                  className="w-1/4"
                />
                <p className="w-3/4 text-[16px]">Home</p>
              </Link>
            </li>
            <li
              className="gap-2"
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/products"
                className="flex flex-row items-center justify-between gap-2"
              >
                <Image
                  src={
                    hoveredIcon === "product" ? ProductActive : ProductInactive
                  }
                  alt="Product Icon"
                  className="w-1/4"
                />
                <p className="w-3/4 text-[16px]">Product</p>
              </Link>
            </li>
            {session?.user?.role === "user" && (
              <li
                className="gap-2"
                onMouseEnter={() => handleMouseEnter("cart")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/cart"
                  className="flex flex-row items-center justify-between gap-2"
                >
                  <Image
                    src={hoveredIcon === "cart" ? CartActive : CartInactive}
                    alt="Cart Icon"
                    className="w-1/4"
                  />
                  <p className="w-3/4 text-[16px]">Cart</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex flex-col space-y-2 hover:*:bg-secondary *:p-2 *:rounded-sm h-full justify-end">
          {session?.user ? (
            <div
              onMouseEnter={() => handleMouseEnter("logout")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/auth/signout"
                className="flex flex-row items-center justify-between gap-2"
              >
                <Image src={Login} alt="Logout Icon" className="w-1/4" />
                <p className="w-3/4 text-[16px]">Log Out</p>
              </Link>
            </div>
          ) : (
            <div
              onMouseEnter={() => handleMouseEnter("login")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/auth/signin"
                className="flex flex-row items-center justify-between gap-2"
              >
                <Image src={Login} alt="Login Icon" className="w-1/4" />
                <p className="w-3/4 text-[16px]">Login</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}