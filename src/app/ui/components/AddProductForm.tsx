"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { toast } from "sonner";
import PreviewProductCard from "./PreviewProdcutCard";

interface FormData {
  productName: string;
  shortDescription: string;
  price: string;
  image: File | null;
}

export default function AddProductForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    shortDescription: "",
    price: "",
    image: null,
  });

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("File selected:", file?.name);
    setFormData({ ...formData, image: file });
  };

  const handleUploadImage = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    try {
      const imageBase64 = await toBase64(formData.image);

      const response = await fetch("/api/product/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.productName, // Changed from `productName` to `name`
          shortDescription: formData.shortDescription,
          price: formData.price,
          imageUrl: imageBase64,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        const errorData = text
          ? JSON.parse(text)
          : { error: "Unknown error occurred" };
        alert(`Error: ${errorData.error}`);
      } else {
        toast("Product Added", {
          description: "Product Added Successfully",
        });

        // Reset the form state
        setFormData({
          productName: "",
          shortDescription: "",
          price: "",
          image: null,
        });

        // Reset the file input value
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // console.log("File converted to base64:", reader.result);
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
        reject(error);
      };
    });

  return (
    <div className='grid grid-flow-col justify-items-center h-full bg-background'>
      <form
        onSubmit={handleSubmit}
        className='h-full w-full bg-background rounded-md p-4 grid grid-cols-1 justify-items-start gap-2 '
      >
        <div className='gap-2 flex flex-col items-start p-1 w-full justify-center h-auto '>
          <label className='font-medium'>Product Name</label>
          <input
            type='text'
            name='productName'
            className='h-1/2 rounded-sm bg-secondary text-text w-full'
            value={formData.productName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='gap-2 flex flex-col items-start  p-1 w-full justify-center h-auto'>
          <label className='font-medium'>Short Description</label>
          <textarea
            name='shortDescription'
            value={formData.shortDescription}
            className='h-1/2 rounded-sm bg-secondary text-text w-full resize-none'
            onChange={handleInputChange}
            maxLength={200}
            required
          ></textarea>
        </div>
        <div className='gap-2 flex flex-col items-start  p-1 w-full justify-center h-auto'>
          <label className='font-medium'>Price</label>

          <input
            type='number'
            step='0.01'
            name='price'
            className='h-1/2 rounded-sm bg-secondary text-text w-full'
            value={formData.price}
            onChange={handleInputChange}
            min={5}
            required
          />
        </div>
        <div className='gap-2 flex flex-col items-start  p-1 w-full justify-between h-fit'>
          <div
            onClick={handleUploadImage}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                const file = files[0];
                console.log("File dropped:", file.name);
                setFormData({ ...formData, image: file });
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className='w-full cursor-pointer h-40 bg-secondary grid grid-cols-1 justify-items-center rounded-lg border-dashed border-2 group'
          >
            <button
              type='submit'
              className='group-hover:scale-110 transition-all ease-in-out'
            >
              Click or Drop to upload Image
            </button>
          </div>
          <input
            type='file'
            accept='image/*'
            className='h-1/2 rounded-sm bg-secondary text-text w-full p-2'
            onChange={handleFileChange}
            ref={fileInputRef} // Attach the ref to the file input
            required
            hidden
          />
        </div>

        <button
          type='submit'
          className='h-10 w-full  self-end bg-primary text-background mt-6 rounded-lg hover:scale-95 transition-all ease-in-out duration-300'
        >
          Add Product
        </button>
      </form>

      <PreviewProductCard {...formData} />
    </div>
  );
}