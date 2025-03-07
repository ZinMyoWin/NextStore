import EditProduct from "@/app/ui/components/EditProduct";
import ProductDetails from "@/app/ui/components/ProductDetails";
import { auth } from "../../../../auth";
import { Session } from "next-auth";

// import { products } from "../../product-data";

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

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = (await auth()) as CustomSession;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div>{isAdmin ? <EditProduct id={id} /> : <ProductDetails id={id} />}</div>
  );
}
