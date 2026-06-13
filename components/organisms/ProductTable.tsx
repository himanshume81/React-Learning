import { Skeleton } from "@/components/atoms/Skeleton";
import { Spinner } from "@/components/atoms/Spinner";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductCategoryBadge } from "@/components/molecules/ProductCategoryBadge";
import {
  getStatusBorderClass,
  ProductStatusBadge,
} from "@/components/molecules/ProductStatusBadge";
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

const tableWrapperClass =
  "overflow-hidden rounded-xl border border-border bg-surface shadow-sm";
const tableHeadClass =
  "border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const tableRowClass =
  "border-b border-border transition-colors last:border-b-0 even:bg-surface-muted/40 hover:bg-surface-muted/70";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className={`rounded-xl border border-border border-l-4 bg-surface p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md ${getStatusBorderClass(product.status)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <Text className="text-sm font-semibold sm:text-base">{product.name}</Text>
        <Text className="shrink-0 rounded-md bg-surface-muted px-2 py-0.5 text-sm font-semibold tabular-nums">
          {formatPrice(product.price)}
        </Text>
      </div>
      <Text className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {product.description}
      </Text>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ProductCategoryBadge category={product.category} />
        <ProductStatusBadge status={product.status} />
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="rounded-xl border border-border border-l-4 border-l-zinc-300 bg-surface p-4 shadow-sm dark:border-l-zinc-600">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="mt-2 h-4 w-full" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </article>
  );
}

function ProductTableSkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <tr key={index} className={tableRowClass}>
          <td className="px-3 py-3.5 md:px-4">
            <Skeleton className="h-4 w-28 md:w-32" />
          </td>
          <td className="hidden px-3 py-3.5 lg:table-cell lg:px-4">
            <Skeleton className="h-4 w-full max-w-xs" />
          </td>
          <td className="px-3 py-3.5 md:px-4">
            <Skeleton className="h-5 w-24" />
          </td>
          <td className="px-3 py-3.5 md:px-4">
            <Skeleton className="h-5 w-20" />
          </td>
          <td className="px-3 py-3.5 text-right md:px-4">
            <Skeleton className="ml-auto h-4 w-14 md:w-16" />
          </td>
        </tr>
      ))}
    </>
  );
}

function TableHeader() {
  return (
    <thead className={tableHeadClass}>
      <tr>
        <th className="px-3 py-3 md:px-4 lg:py-3.5">Name</th>
        <th className="hidden px-3 py-3 lg:table-cell lg:px-4 lg:py-3.5">
          Description
        </th>
        <th className="px-3 py-3 md:px-4 lg:py-3.5">Category</th>
        <th className="px-3 py-3 md:px-4 lg:py-3.5">Status</th>
        <th className="px-3 py-3 text-right md:px-4 lg:py-3.5">Price</th>
      </tr>
    </thead>
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
    <div className={`hidden md:block ${tableWrapperClass}`}>
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-sm"
          aria-busy={isLoading}
          aria-label="Product table"
        >
          <TableHeader />
          <tbody>
            {isLoading ? (
              <ProductTableSkeletonRows />
            ) : (
              products.map((product) => (
                <tr key={product.id} className={tableRowClass}>
                  <td className="px-3 py-3.5 font-semibold md:px-4 lg:py-4">
                    {product.name}
                  </td>
                  <td className="hidden max-w-xs px-3 py-3.5 text-muted-foreground lg:table-cell lg:px-4 lg:py-4">
                    {product.description}
                  </td>
                  <td className="px-3 py-3.5 md:px-4 lg:py-4">
                    <ProductCategoryBadge category={product.category} />
                  </td>
                  <td className="px-3 py-3.5 md:px-4 lg:py-4">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-3 py-3.5 text-right font-semibold tabular-nums md:px-4 lg:py-4">
                    {formatPrice(product.price)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
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
