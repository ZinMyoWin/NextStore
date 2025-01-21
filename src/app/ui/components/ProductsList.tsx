"use client";
import useCart from "@/app/hooks/useCart";
import { Product } from "../../product-data";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { createContext, useCallback, useState, useEffect } from "react";
import { toast } from "sonner";

interface ContextType {
  fetchProducts: () => void;
  deleteProduct: (productId: string) => void;
}

export const ProductContext = createContext<ContextType | null>(null);

export default function ProductsList() {
  const { session } = useCart();
  const [productList, setProductList] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + "/api/product"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();
      setProductList(products);
      console.log("Products_ ", products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast("Error", {
        description: "Failed to fetch products.",
        duration: 2000,
      });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(
    async (id: string) => {
      console.log("Delete product clicked");

      try {
        const response = await fetch(`/api/product/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete the product");
        }

        fetchProducts();
        // Show success toast
        toast("Product Deleted", {
          description: "The product has been deleted successfully.",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast("Error", {
          description: "Failed to delete the product.",
          duration: 2000,
        });
      }
    },
    [fetchProducts]
  );

  if (productList.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <ProductContext.Provider value={{ fetchProducts, deleteProduct }}>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full mt-8 justify-center ml-auto mr-auto gap-12 justify-items-center'>
        {productList.map((product) => (
          <ProductCard key={product._id} {...product} type='product' />
        ))}
        {session?.user?.role === "admin" && (
          <div className='w-full p-2 pt-1 pb-3 h-72'>
            <Link
              href={"/products/add-product"}
              className='h-full mt-1 hover:bg-text hover:text-background bg-secondary grid grid-cols-1 justify-items-center items-center border-dashed border-2 border-primary rounded-md group transition-all ease-in-out duration-300 cursor-pointer'
            >
              <div className=''>Click to Add Product</div>
            </Link>
          </div>
        )}
      </div>
    </ProductContext.Provider>
  );
}
