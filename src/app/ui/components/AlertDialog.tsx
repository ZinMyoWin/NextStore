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
import { StaticImageData } from "next/image";

interface DeleteItemsTypes {
  setDeleteActive: React.Dispatch<React.SetStateAction<boolean>>;
  deleteActive: boolean;
  productId: string;
  DeleteActiveIcon: StaticImageData;
  DeleteInactiveIcon: StaticImageData;
  onConfirm?: () => void;
}

interface UserDeleteItemsTypes {
  // setDeleteActive: React.Dispatch<React.SetStateAction<boolean>>;
  // deleteActive: boolean;
  // productId: string;
  // DeleteActiveIcon: StaticImageData;
  // DeleteInactiveIcon: StaticImageData;
  onConfirm?: () => void;
}

export function ProductDeleteConfirmationAlert({
  setDeleteActive,
  deleteActive,
  DeleteActiveIcon,
  DeleteInactiveIcon,
  onConfirm,
}: DeleteItemsTypes) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          className='cursor-pointer'
          onMouseEnter={() => setDeleteActive(true)}
          onMouseLeave={() => setDeleteActive(false)}
        >
          <Image
            src={deleteActive ? DeleteActiveIcon : DeleteInactiveIcon}
            alt='Delete Icon'
            className='w-6 h-6'
          />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            product from the store.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeleteActive(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UserDeleteConfirmationAlert({
  onConfirm,
}: UserDeleteItemsTypes) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className='text-red-600 hover:text-red-900'>Delete</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this user from the store.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
