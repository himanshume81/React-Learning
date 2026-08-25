import { ProductDetailContainer } from "@/components/organisms/ProductDetailContainer";
import { AppLayout } from "@/components/templates/AppLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product details | User Management Dashboard",
};

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <AppLayout>
      <ProductDetailContainer productId={id} />
    </AppLayout>
  );
}
