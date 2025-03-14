import AddProductForm from "@/app/ui/components/AddProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProduct() {
  return (
    <div className='min-h-[calc(100vh-4rem)] p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Products
          </Link>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            Add New Product
          </h1>
          <p className='text-muted-foreground mt-2'>
            Fill in the details below to add a new product to your store.
          </p>
        </div>

        {/* Form Container */}
        <div className='bg-card rounded-xl shadow-lg border border-border p-6'>
          <AddProductForm />
        </div>
      </div>
    </div>
  );
}
