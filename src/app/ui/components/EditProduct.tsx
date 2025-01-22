"use client";

import Image from "next/image";
import ImageUpload from "../../../../public/icons/guidance_image.svg";
import { toast } from "sonner";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface FormData {
  productName: string;
  shortDescription: string;
  price: string;
  image: File | null;
  existingImageUrl?: string; // Add this to store the existing image URL
}

export default function EditProduct({ id }: { id: string }) {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    shortDescription: "",
    price: "",
    image: null,
    existingImageUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the product data and pre-fill the form
  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SITE_URL + `/api/product/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const product = await response.json();
      console.log("Product: ", product);

      // Construct the full image path
      const fullImageUrl = `/productsImage/${product.imageUrl}`;

      setFormData({
        productName: product.name,
        shortDescription: product.shortDescription,
        price: product.price,
        image: null,
        existingImageUrl: fullImageUrl, // Use the full image path
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast("Error", {
        description: "Failed to fetch product.",
        duration: 2000,
      });
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

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

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        let imageBase64 = formData.existingImageUrl; // Use the existing image URL by default

        // If a new image is uploaded, convert it to base64
        if (formData.image) {
          imageBase64 = await toBase64(formData.image);
        }

        const response = await fetch(`/api/product/${id}`, {
          method: "PUT", // Use PUT for updates
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.productName,
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
          toast("Product Updated", {
            description: "Product updated successfully.",
          });

          // Refresh the product data
          fetchProduct();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    },
    [
      formData.image,
      formData.productName,
      formData.shortDescription,
      formData.price,
      formData.existingImageUrl,
      id,
      fetchProduct,
    ]
  );

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      {/* Image Upload Section */}
      <div>
        <div
          onClick={handleUploadImage}
          className='w-full cursor-pointer h-full bg-secondary grid grid-cols-1 justify-items-center rounded-lg border-dashed border-2 group'
        >
          <Image
            src={
              formData.image
                ? URL.createObjectURL(formData.image) // Use blob URL for newly uploaded image
                : formData.existingImageUrl || ImageUpload // Use the full image path for existing image or fallback to default image
            }
            alt='upload image'
            width={1000}
            height={1000}
            className='object-cover w-full rounded-lg'
          />
        </div>
        <input
          type='file'
          accept='image/*'
          className='h-1/2 rounded-sm bg-secondary text-text w-full p-2'
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
        />
      </div>

      {/* Form Fields Section */}
      <div className='space-y-4'>
        <input
          type='text'
          name='productName'
          placeholder='Product Name'
          className='w-full p-2 rounded-sm bg-secondary text-text'
          value={formData.productName}
          onChange={handleInputChange}
          required
        />
        <textarea
          name='shortDescription'
          placeholder='Short Description'
          className='w-full p-2 rounded-sm bg-secondary text-text resize-none'
          value={formData.shortDescription}
          onChange={handleInputChange}
          maxLength={200}
          required
        />
        <input
          type='number'
          step='0.01'
          name='price'
          placeholder='Price'
          className='w-full p-2 rounded-sm bg-secondary text-text'
          value={formData.price}
          onChange={handleInputChange}
          min={5}
          required
        />
        <button
          type='submit'
          onClick={handleSubmit}
          className='w-full p-2 bg-primary text-background rounded-lg hover:bg-primary-dark transition-all'
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
