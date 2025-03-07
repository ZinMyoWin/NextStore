"use client";
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    try {
      setIsLoading(true);
      const result = await signOutAction();

      if (result.success) {
        // Small delay to ensure the session is cleared
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Force a full page refresh and navigation
        router.refresh();
        window.location.href = "/";
      } else {
        throw new Error(result.error || "Failed to sign out");
      }
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign out. Please try again."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      <div className='w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-lg border border-border text-center'>
        {/* Header */}
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            Sign Out
          </h1>
          <p className='text-muted-foreground text-sm'>
            Are you sure you want to sign out?
          </p>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-3 pt-4'>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className='w-full px-4 py-3 bg-destructive text-destructive-foreground 
                     rounded-lg hover:bg-destructive/90 transition-all duration-200
                     text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </button>

          <Link
            href='/products'
            className={`inline-flex items-center justify-center px-4 py-3
                     bg-background border border-border rounded-lg
                     hover:bg-secondary/50 transition-all duration-200
                     text-sm font-medium ${
                       isLoading ? "pointer-events-none opacity-50" : ""
                     }`}
          >
            Cancel
          </Link>
        </div>

        {/* Footer */}
        <p className='text-center text-sm text-muted-foreground pt-4'>
          You can always sign back in to your account
        </p>
      </div>
    </div>
  );
}
