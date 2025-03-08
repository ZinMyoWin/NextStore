"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import useCart from "@/app/hooks/useCart";
import { toast } from "sonner";
import {
  PackageOpen,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  category?: string;
}

interface Filters {
  minPrice: number;
  maxPrice: number;
  category: string;
}

export default function ProductsList() {
  const { session } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const initialFilters = {
    minPrice: 0,
    maxPrice: 1000,
    category: "all",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filters]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, filters, filterProducts]);

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
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  function resetFilters() {
    setSearchQuery("");
    setFilters(initialFilters);
    setShowFilters(false);
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
    <div className='min-h-screen max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 mb-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold tracking-tight'>Products</h1>
          {session?.user?.role === "admin" && (
            <Link
              href='/products/add-product'
              className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium'
            >
              <Plus className='w-4 h-4' />
              Add Product
            </Link>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70'>
              <Search className='w-4 h-4' />
            </div>
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all'
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-card/50 hover:bg-card transition-colors text-sm font-medium whitespace-nowrap'
          >
            <SlidersHorizontal className='w-4 h-4' />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className='p-5 rounded-lg border border-input bg-card/50 backdrop-blur-sm space-y-5 animate-in slide-in-from-top-2 duration-200'>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Filter Products</h3>
              <button
                onClick={resetFilters}
                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-secondary/80 text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='w-3.5 h-3.5' />
                Reset all
              </button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-muted-foreground'>
                  Min Price
                </label>
                <input
                  type='number'
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: Number(e.target.value) })
                  }
                  className='w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                  min='0'
                />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-muted-foreground'>
                  Max Price
                </label>
                <input
                  type='number'
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: Number(e.target.value) })
                  }
                  className='w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                  min='0'
                />
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-muted-foreground'>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className='w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none'
                >
                  <option value='all'>All Categories</option>
                  <option value='electronics'>Electronics</option>
                  <option value='clothing'>Clothing</option>
                  <option value='books'>Books</option>
                  <option value='home'>Home & Garden</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredProducts.map((product) => (
          <div key={product._id}>
            <ProductCard
              {...product}
              type='product'
              onDelete={() => handleDeleteProduct(product._id)}
            />
          </div>
        ))}

        {session?.user?.role === "admin" && (
          <div>
            <Link
              href='/products/add-product'
              className='group relative bg-card/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-muted hover:border-primary/30 hover:bg-card'
            >
              <div className='text-center space-y-3'>
                <div className='w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-secondary transition-all duration-200'>
                  <Plus className='w-5 h-5 text-muted-foreground group-hover:text-foreground' />
                </div>
                <p className='text-sm font-medium text-muted-foreground group-hover:text-foreground'>
                  Add New Product
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
