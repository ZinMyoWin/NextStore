"use client";

import { useSidebar } from "@/app/store/use-sidebar";
import Footer from "@/app/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

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
