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

interface DeleteItemsTypes {
  deleteProduct: () => void; // Function to delete the product
  setDeleteActive: (active: boolean) => void; // Function to set delete active state
  deleteActive: boolean; // State to track if delete is active
  DeleteActiveIcon: string; // Icon for active state
  DeleteInactiveIcon: string; // Icon for inactive state
}

export function ConfirmationAlert({
  deleteProduct,
  setDeleteActive,
  deleteActive,
  DeleteActiveIcon,
  DeleteInactiveIcon,
}: DeleteItemsTypes) {
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
            <button  onClick={deleteProduct}>Delete</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
