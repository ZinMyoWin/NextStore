import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./ui/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NexE",
  description: "Developed by Zin Myo Win",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='flex bg-background'>
        <Sidebar />
        <main className='flex-1 p-8 ml-64'>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
