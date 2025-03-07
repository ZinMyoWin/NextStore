"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import useCart from "@/app/hooks/useCart";
import { toast } from "sonner";
import { PackageOpen, Plus } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
}

export default function ProductsList() {
  const { session } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/product");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteProduct(productId: string) {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='w-full'>
              <div className='animate-pulse bg-secondary h-[400px] rounded-xl' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state for admin
  if (products.length === 0 && session?.user?.role === "admin") {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
            <PackageOpen className='w-8 h-8 text-primary' />
          </div>
          <h2 className='text-2xl font-bold mb-2'>No Products Available</h2>
          <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
            Start building your store by adding your first product. Click the
            button below to get started.
          </p>
          <Link
            href='/products/add-product'
            className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
          >
            <Plus className='w-5 h-5' />
            Add Your First Product
          </Link>
        </div>
      </div>
    );
  }

  // Empty state for users
  if (products.length === 0 && session?.user?.role === "user") {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
            <PackageOpen className='w-8 h-8 text-primary' />
          </div>
          <h2 className='text-2xl font-bold mb-2'>No Products Available</h2>
          <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
            Our store is currently being updated. Please check back later for
            new products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
        {products.map((product) => (
          <div key={product._id} className='w-full'>
            <ProductCard
              {...product}
              type='product'
              onDelete={() => handleDeleteProduct(product._id)}
            />
          </div>
        ))}

        {session?.user?.role === "admin" && (
          <div className='w-full h-full'>
            <Link
              href='/products/add-product'
              className='group relative bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full aspect-[3/4] flex items-center justify-center border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50'
            >
              <div className='text-center space-y-4'>
                <div className='w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200'>
                  <Plus className='w-6 h-6' />
                </div>
                <p className='text-sm font-medium'>Add New Product</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
