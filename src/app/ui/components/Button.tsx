type cartItemProps = {
  productId: string;
  productIsInCart: (productId: string) => boolean;
  removeFromCart: (productId: string) => void;
  addToCart: (productId: string) => void;
};

export default function AddToCart({
  productId,
  productIsInCart,
  removeFromCart,
  addToCart,
}: cartItemProps) {
  return (
    <>
      {productIsInCart(productId) ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            removeFromCart(productId);
          }}
          className="bg-red-500  p-2 text-sm text-white rounded-md"
        >
          Remove from cart
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(productId);
          }}
          className='bg-blue-500 p-2 text-sm text-white rounded-md'
        >
          Add to cart
        </button>
      )}
    </>
  );
}
