import EditProduct from "@/app/ui/components/EditProduct";
import { auth } from "../../../../../auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CustomSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = (await auth()) as CustomSession;
  const isAdmin = session?.user?.role === "admin";

  // Redirect non-admin users to the product details page
  if (!isAdmin) {
    redirect(`/products/${id}`);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Edit Product
          </h1>
          <p className="text-muted-foreground mt-2">
            Make changes to your product details below.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-6">
          <EditProduct id={id} />
        </div>
      </div>
    </div>
  );
} 