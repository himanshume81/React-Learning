import type { Metadata } from "next";
import { AiProductSearch } from "@/components/ai-product-search";
import { AppLayout } from "@/components/templates/AppLayout";

export const metadata: Metadata = {
  title: "AI product search | User Management Dashboard",
};

export default function AiProductSearchPage() {
  return (
    <AppLayout>
      <AiProductSearch />
    </AppLayout>
  );
}
