import { CategoryDetailContainer } from "@/components/organisms/CategoryDetailContainer";
import { AppLayout } from "@/components/templates/AppLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category details | User Management Dashboard",
};

type CategoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { id } = await params;

  return (
    <AppLayout>
      <CategoryDetailContainer categoryId={id} />
    </AppLayout>
  );
}
