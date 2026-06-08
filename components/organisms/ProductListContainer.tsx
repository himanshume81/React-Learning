"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { ProductList } from "@/components/organisms/ProductList";
import { fetchEmptyProducts, fetchProducts } from "@/lib/mock-products";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

type LoadMode = "products" | "empty";

export function ProductListContainer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMode, setLoadMode] = useState<LoadMode>("products");

  const loadProducts = useCallback(async (mode: LoadMode) => {
    setIsLoading(true);
    setLoadMode(mode);

    const data =
      mode === "empty" ? await fetchEmptyProducts() : await fetchProducts();

    setProducts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts("products");
  }, [loadProducts]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            Products
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Practice list rendering with loading and empty states.
          </Text>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => loadProducts("products")}
            disabled={isLoading}
          >
            Load products
          </Button>
          <Button
            variant="ghost"
            onClick={() => loadProducts("empty")}
            disabled={isLoading}
          >
            Show empty
          </Button>
        </div>
      </div>

      <ProductList
        products={products}
        isLoading={isLoading}
        emptyAction={
          loadMode === "empty" ? (
            <Button onClick={() => loadProducts("products")}>
              Load products
            </Button>
          ) : undefined
        }
      />

      {!isLoading && products.length > 0 && (
        <Text className="text-sm text-zinc-500">
          Showing {products.length} product{products.length === 1 ? "" : "s"}
        </Text>
      )}
    </section>
  );
}
