import { Spinner } from "@/components/atoms/Spinner";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductItem } from "@/components/molecules/ProductItem";
import { ProductItemSkeleton } from "@/components/molecules/ProductItemSkeleton";
import type { Product } from "@/types/product";
import type { ReactNode } from "react";

type ProductListProps = {
  products: Product[];
  isLoading: boolean;
  emptyAction?: ReactNode;
};

const SKELETON_COUNT = 4;

export function ProductList({
  products,
  isLoading,
  emptyAction,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <Spinner size="sm" />
          <Text>Loading products...</Text>
        </div>
        <ul className="space-y-3" aria-busy="true" aria-label="Loading products">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductItemSkeleton key={index} />
          ))}
        </ul>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="There are no products to display yet. Try loading the list again."
        action={emptyAction}
      />
    );
  }

  return (
    <ul className="space-y-3" aria-label="Product list">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ul>
  );
}
