"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useContext } from "react";
import { ProductContext } from "./ProductsList";

interface DeleteItemsTypes {
  setDeleteActive: (active: boolean) => void; // Function to set delete active state
  deleteActive: boolean; // State to track if delete is active
  DeleteActiveIcon: string; // Icon for active state
  DeleteInactiveIcon: string; // Icon for inactive state
  productId: string;
}

export function ConfirmationAlert({
  setDeleteActive,
  deleteActive,
  DeleteActiveIcon,
  DeleteInactiveIcon,
  productId,
}: DeleteItemsTypes) {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "ConfirmationAlert must be used within a ProductContext.Provider"
    );
  }

  const { deleteProduct } = context;

  const handleDelete = () => {
    deleteProduct(productId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          onMouseEnter={() => setDeleteActive(true)}
          onMouseLeave={() => setDeleteActive(false)}
          className='w-fit h-fit'
        >
          {deleteActive ? (
            <Image
              src={DeleteActiveIcon}
              alt='delete active'
              width={35}
              height={35}
            />
          ) : (
            <Image
              src={DeleteInactiveIcon}
              alt='delete inactive'
              width={35}
              height={35}
            />
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product and remove it from your
            store.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button onClick={handleDelete}>Delete</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
