"use client";

import { useSidebar } from "@/app/store/use-sidebar";
import Footer from "@/app/components/Footer";
import { useState, useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        isOpen ? "ml-64" : "ml-20"
      } flex flex-col`}
    >
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
