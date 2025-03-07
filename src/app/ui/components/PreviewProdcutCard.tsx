"use client";
import Image from "next/image";

interface PreviewData {
  productName: string;
  shortDescription: string;
  price: string;
  image: File | null;
}

export default function PreviewProductCard({
  productName,
  shortDescription,
  price,
  image,
}: PreviewData) {
  // Create object URL for preview image
  const imageUrl = image
    ? URL.createObjectURL(image)
    : "/product-placeholder.png";

  return (
    <div className='group relative bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300'>
      {/* Image Container */}
      <div className='aspect-square overflow-hidden bg-secondary/30'>
        <div className='relative w-full h-full'>
          {image ? (
            <Image
              src={imageUrl}
              alt='Product preview'
              fill
              className='object-cover'
              onLoadingComplete={() => {
                // Cleanup object URL after image loads
                if (image) URL.revokeObjectURL(imageUrl);
              }}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-secondary/50'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 text-muted-foreground/50'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className='p-4 space-y-4'>
        {/* Product Info */}
        <div className='space-y-2'>
          <h3 className='font-semibold text-lg line-clamp-1'>
            {productName || "Product Name"}
          </h3>
          <p className='text-sm text-muted-foreground line-clamp-2'>
            {shortDescription || "Product description will appear here..."}
          </p>
        </div>

        {/* Price */}
        <div className='flex items-center justify-between pt-2'>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground'>Price</p>
            <p className='text-xl font-bold text-primary'>
              ${Number(price || 0).toFixed(2)}
            </p>
          </div>

          {/* Preview Badge */}
          <div className='px-3 py-1 rounded-full bg-secondary text-xs font-medium'>
            Preview
          </div>
        </div>
      </div>
    </div>
  );
}
