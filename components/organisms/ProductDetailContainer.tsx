"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { fetchProductById, formatRecordId } from "@/lib/catalog-api";
import type { Product } from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductDetailContainer({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetchProductById(productId).then((result) => {
      if (ignore) {
        return;
      }

      setProduct(result);
      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <Text className="text-sm text-zinc-500">Loading product...</Text>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been deleted or is unavailable."
        action={
          <Link href="/products">
            <Button variant="secondary">Back to products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Text className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Product ID
        </Text>
        <Text as="h1" className="mt-2 text-2xl font-semibold">
          {formatRecordId("PRD", product.id)}
        </Text>

        <div className="mt-6 space-y-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-56 w-full rounded-xl bg-zinc-100 object-cover dark:bg-zinc-900"
            />
          ) : null}
          <div>
            <Text className="text-sm font-medium text-zinc-500">Name</Text>
            <Text className="mt-1 text-base">{product.name}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">Description</Text>
            <Text className="mt-1 text-base">{product.description}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">SKU</Text>
            <Text className="mt-1 text-base">{product.sku}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">Category</Text>
            <Text className="mt-1 text-base">{product.categoryName}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">Price</Text>
            <Text className="mt-1 text-base">{formatPrice(product.price)}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">Stock</Text>
            <Text className="mt-1 text-base">{product.stock}</Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={product.status === "active" ? "success" : "neutral"}>
              {product.status}
            </Badge>
          </div>
        </div>
      </div>

      <Link href="/products">
        <Button variant="ghost">Back to products</Button>
      </Link>
    </section>
  );
}
