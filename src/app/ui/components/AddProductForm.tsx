"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { toast } from "sonner";
import PreviewProductCard from "./PreviewProdcutCard";
import { Loader2 } from "lucide-react";

interface FormData {
  productName: string;
  shortDescription: string;
  price: string;
  image: File | null;
}

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    shortDescription: "",
    price: "",
    image: null,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateImageFile(file)) {
        setFormData({ ...formData, image: file });
      }
    }
  };

  const validateImageFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return false;
    }
    return true;
  };

  const handleUploadImage = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isSubmitting) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateImageFile(file)) {
        setFormData({ ...formData, image: file });
        // Update the file input value for consistency
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitting) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Adding product...");

      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("image", formData.image);

      const response = await fetch("/api/product", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      // Reset form
      setFormData({
        productName: "",
        shortDescription: "",
        price: "",
        image: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.dismiss(loadingToast);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      {/* Form Section */}
      <div className='space-y-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Product Name */}
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Product Name
            </label>
            <input
              type='text'
              name='productName'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              value={formData.productName}
              onChange={handleInputChange}
              placeholder='Enter product name'
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Description
            </label>
            <textarea
              name='shortDescription'
              className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none'
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder='Enter product description'
              maxLength={200}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Price */}
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Price
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                $
              </span>
              <input
                type='number'
                step='0.01'
                name='price'
                className='flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                value={formData.price}
                onChange={handleInputChange}
                placeholder='0.00'
                min={5}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Product Image
            </label>
            <div
              onClick={!isSubmitting ? handleUploadImage : undefined}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`h-48 rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : isSubmitting
                  ? "border-border opacity-50 cursor-not-allowed"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <div className='flex flex-col items-center gap-2 text-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-10 w-10 text-muted-foreground'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <p className='text-sm text-muted-foreground'>
                  {formData.image
                    ? formData.image.name
                    : "Drop your image here, or click to select"}
                </p>
              </div>
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              ref={fileInputRef}
              className='hidden'
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 transition-colors'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className='lg:sticky lg:top-6'>
        <div className='space-y-2 mb-4'>
          <h2 className='text-lg font-semibold'>Preview</h2>
          <p className='text-sm text-muted-foreground'>
            This is how your product will appear in the store.
          </p>
        </div>
        <div className='bg-background rounded-lg border border-border p-4'>
          <PreviewProductCard {...formData} />
        </div>
      </div>
    </div>
  );
}
