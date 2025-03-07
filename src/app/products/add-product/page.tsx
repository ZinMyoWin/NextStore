import AddProductForm from "@/app/ui/components/AddProductForm";

export default function AddProduct() {
  return (
    <div className='min-h-[calc(100vh-4rem)] p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
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
