import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./ui/components/Sidebar";
import MainLayout from "./ui/components/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "NextStore - Your One-Stop Shop for Everything",
    template: "%s | NextStore",
  },
  description:
    "Discover amazing products at great prices. NextStore offers a wide range of electronics, clothing, and home goods with fast shipping and excellent customer service.",
  keywords: [
    "online store",
    "ecommerce",
    "shopping",
    "electronics",
    "clothing",
    "home goods",
  ],
  authors: [{ name: "NextStore Team" }],
  creator: "NextStore",
  publisher: "NextStore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "NextStore - Your One-Stop Shop for Everything",
    description:
      "Discover amazing products at great prices. NextStore offers a wide range of electronics, clothing, and home goods with fast shipping and excellent customer service.",
    siteName: "NextStore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextStore - Your One-Stop Shop for Everything",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextStore - Your One-Stop Shop for Everything",
    description:
      "Discover amazing products at great prices. NextStore offers a wide range of electronics, clothing, and home goods with fast shipping and excellent customer service.",
    images: ["/og-image.jpg"],
    creator: "@nextstore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Suspense fallback={null}>
          <Sidebar />
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
