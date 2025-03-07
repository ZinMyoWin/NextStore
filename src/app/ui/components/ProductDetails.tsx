"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AddToCart from "./Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
}

export default function ProductDetails({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/product/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='animate-pulse'>
          <div className='h-[600px] bg-secondary rounded-3xl mb-8' />
          <div className='space-y-4'>
            <div className='h-10 bg-secondary rounded w-1/2' />
            <div className='h-6 bg-secondary rounded w-3/4' />
            <div className='h-8 bg-secondary rounded w-1/4' />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Product not found</h2>
          <p className='text-muted-foreground mt-2'>
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href='/products'
            className='mt-4 inline-flex items-center text-primary hover:text-primary/80'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/* Back Button */}
      <Link
        href='/products'
        className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 group'
      >
        <ArrowLeft className='w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1' />
        Back to Products
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10'>
        {/* Product Image */}
        <div className='relative aspect-square rounded-3xl overflow-hidden bg-secondary/10 shadow-lg'>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className='object-cover hover:scale-105 transition-transform duration-500'
            priority
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        {/* Product Info */}
        <div className='flex flex-col lg:py-6'>
          <div className='flex-1 space-y-8'>
            {/* Title and Description */}
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold tracking-tight text-foreground/90'>
                {product.name}
              </h1>
              <p className='text-lg text-muted-foreground/90 leading-relaxed'>
                {product.shortDescription}
              </p>
            </div>

            {/* Price */}
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground/75'>
                Price
              </p>
              <p className='text-5xl font-bold text-primary'>
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Add to Cart */}
            <div className='pt-6'>
              <AddToCart productId={product._id} />
            </div>

            {/* Additional Info */}
            <div className='pt-10 mt-10 border-t border-border/50'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-3 bg-secondary/20 p-4 rounded-xl'>
                  <div className='flex items-center space-x-2'>
                    <svg
                      className='w-5 h-5 text-primary'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
                      />
                    </svg>
                    <p className='text-sm font-medium text-foreground'>
                      Shipping
                    </p>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Free shipping on orders over $100
                  </p>
                </div>
                <div className='space-y-3 bg-secondary/20 p-4 rounded-xl'>
                  <div className='flex items-center space-x-2'>
                    <svg
                      className='w-5 h-5 text-primary'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z'
                      />
                    </svg>
                    <p className='text-sm font-medium text-foreground'>
                      Returns
                    </p>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Free 30-day returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
