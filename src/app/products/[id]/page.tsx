import EditProduct from "@/app/ui/components/EditProduct";

// import { products } from "../../product-data";
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div>
      <EditProduct id={id} />
    </div>
  );
}
