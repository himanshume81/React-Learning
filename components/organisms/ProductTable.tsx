import { Skeleton } from "@/components/atoms/Skeleton";
import { Spinner } from "@/components/atoms/Spinner";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { Product } from "@/types/product";
import type { ReactNode } from "react";

type ProductTableProps = {
  products: Product[];
  isLoading: boolean;
  emptyAction?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
};

const SKELETON_ROWS = 5;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
      {category}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <Text className="text-sm font-medium sm:text-base">{product.name}</Text>
        <Text className="shrink-0 text-sm font-semibold sm:text-base">
          {formatPrice(product.price)}
        </Text>
      </div>
      <Text className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {product.description}
      </Text>
      <div className="mt-3">
        <CategoryBadge category={product.category} />
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-3 h-5 w-24" />
    </article>
  );
}

function ProductTableSkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <tr key={index} className="border-b border-border">
          <td className="px-3 py-3 md:px-4">
            <Skeleton className="h-4 w-28 md:w-32" />
          </td>
          <td className="hidden px-3 py-3 lg:table-cell lg:px-4">
            <Skeleton className="h-4 w-full max-w-xs" />
          </td>
          <td className="px-3 py-3 md:px-4">
            <Skeleton className="h-4 w-20 md:w-24" />
          </td>
          <td className="px-3 py-3 text-right md:px-4">
            <Skeleton className="ml-auto h-4 w-14 md:w-16" />
          </td>
        </tr>
      ))}
    </>
  );
}

function ProductTableDesktop({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading: boolean;
}) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
      <table
        className="w-full text-left text-sm"
        aria-busy={isLoading}
        aria-label="Product table"
      >
        <thead className="border-b border-border bg-surface-muted">
          <tr>
            <th className="px-3 py-3 font-medium md:px-4 lg:py-3.5">Name</th>
            <th className="hidden px-3 py-3 font-medium lg:table-cell lg:px-4 lg:py-3.5">
              Description
            </th>
            <th className="px-3 py-3 font-medium md:px-4 lg:py-3.5">Category</th>
            <th className="px-3 py-3 text-right font-medium md:px-4 lg:py-3.5">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <ProductTableSkeletonRows />
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-3 py-3 font-medium md:px-4 lg:py-3.5">
                  {product.name}
                </td>
                <td className="hidden max-w-xs px-3 py-3 text-zinc-600 lg:table-cell lg:px-4 lg:py-3.5 dark:text-zinc-400">
                  {product.description}
                </td>
                <td className="px-3 py-3 md:px-4 lg:py-3.5">
                  <CategoryBadge category={product.category} />
                </td>
                <td className="px-3 py-3 text-right font-semibold md:px-4 lg:py-3.5">
                  {formatPrice(product.price)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProductTableMobile({
  products,
  isLoading,
}: {
  products: Product[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 md:hidden" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden" aria-label="Product list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductTable({
  products,
  isLoading,
  emptyAction,
  emptyTitle = "No products found",
  emptyDescription = "There are no products to display yet. Try loading the list again.",
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <Spinner size="sm" />
          <Text>Loading products...</Text>
        </div>

        <ProductTableMobile products={products} isLoading />
        <ProductTableDesktop products={products} isLoading />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <>
      <ProductTableMobile products={products} isLoading={false} />
      <ProductTableDesktop products={products} isLoading={false} />
    </>
  );
}
