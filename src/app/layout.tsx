import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Sidebar from "./ui/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextStore - Your One-Stop Shop",
  description: "Discover amazing products at great prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} flex`}>
        <Sidebar />
        <div className='flex-1 flex flex-col min-h-screen ml-64'>
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
