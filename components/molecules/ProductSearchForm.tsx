"use client";

import { AiSearchForm } from "@/components/molecules/AiSearchForm";
import type { ProductSearchParams } from "@/lib/catalog-api";

type Props = {
  onSearch: (params: ProductSearchParams | null) => void;
  isLoading: boolean;
};

export function ProductSearchForm(props: Props) {
  return (
    <AiSearchForm
      {...props}
      subject="product"
      placeholder="Search products by name, brand, category..."
      hint="Try “comfortable Nike running shoes under 5000 that are in stock”."
    />
  );
}
