import { ProductListContainer } from "@/components/organisms/ProductListContainer";
import { AppLayout } from "@/components/templates/AppLayout";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function ProductsPage() {
  await delay(600);

  return (
    <AppLayout>
      <ProductListContainer />
    </AppLayout>
  );
}
