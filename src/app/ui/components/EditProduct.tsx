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
import { Camera } from "lucide-react";

interface FormData {
  productName: string;
  shortDescription: string;
  price: string;
  image: File | null;
  existingImageUrl?: string;
}

export default function EditProduct({ id }: { id: string }) {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    shortDescription: "",
    price: "",
    image: null,
    existingImageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/product/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      setFormData({
        productName: data.name,
        shortDescription: data.shortDescription,
        price: data.price.toString(),
        image: null,
        existingImageUrl: data.imageUrl,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details");
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
    setFormData({ ...formData, image: file });
  };

  const handleUploadImage = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        let imageBase64 = formData.existingImageUrl;

        if (formData.image) {
          imageBase64 = await toBase64(formData.image);
        }

        const response = await fetch(`/api/product/${id}`, {
          method: "PUT",
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
          toast.error(`Error: ${errorData.error}`);
        } else {
          toast.success("Product updated successfully");
          fetchProduct();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
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
    <form
      onSubmit={handleSubmit}
      className='grid grid-cols-1 lg:grid-cols-2 gap-8'
    >
      {/* Image Upload Section */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Product Image</label>
          <p className='text-sm text-muted-foreground'>
            Click the area below to upload a new image
          </p>
        </div>

        <div
          onClick={handleUploadImage}
          className='relative aspect-square group cursor-pointer rounded-xl overflow-hidden bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 transition-colors'
        >
          <Image
            src={
              formData.image
                ? URL.createObjectURL(formData.image)
                : formData.existingImageUrl || ImageUpload
            }
            alt='Product image'
            fill
            className='object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-50'
            priority
          />
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <div className='flex flex-col items-center gap-2 text-foreground/80'>
              <Camera className='w-8 h-8' />
              <span className='text-sm font-medium'>Change Image</span>
            </div>
          </div>
        </div>

        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
        />
      </div>

      {/* Form Fields Section */}
      <div className='space-y-6'>
        {/* Product Name */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Product Name</label>
          <input
            type='text'
            name='productName'
            className='flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm 
                     ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
                     placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                     focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            value={formData.productName}
            onChange={handleInputChange}
            placeholder='Enter product name'
            required
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Description</label>
          <textarea
            name='shortDescription'
            className='flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm 
                     ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
                     focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
                     disabled:cursor-not-allowed disabled:opacity-50 resize-none'
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder='Enter product description'
            maxLength={200}
            required
          />
          <p className='text-xs text-muted-foreground'>
            {formData.shortDescription.length}/200 characters
          </p>
        </div>

        {/* Price */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Price</label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              $
            </span>
            <input
              type='number'
              step='0.01'
              name='price'
              className='flex h-10 w-full rounded-lg border border-input bg-background pl-7 pr-3 py-2 text-sm 
                       ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
                       focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
                       disabled:cursor-not-allowed disabled:opacity-50'
              value={formData.price}
              onChange={handleInputChange}
              placeholder='0.00'
              min={0}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium
                   hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                  fill='none'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Saving Changes...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
