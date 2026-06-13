"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { Text } from "@/components/atoms/Text";
import { ProductTable } from "@/components/organisms/ProductTable";
import { fetchEmptyProducts, fetchProducts } from "@/lib/mock-products";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useMemo, useState } from "react";

type LoadMode = "products" | "empty";

const PAGE_SIZE = 5;
const ALL_CATEGORIES = "all";

export function ProductListContainer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMode, setLoadMode] = useState<LoadMode>("products");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async (mode: LoadMode) => {
    setIsLoading(true);
    setLoadMode(mode);
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setPage(1);

    const data =
      mode === "empty" ? await fetchEmptyProducts() : await fetchProducts();

    setProducts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts("products");
  }, [loadProducts]);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category))];
    return unique.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        category === ALL_CATEGORIES || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const rangeStart =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);

  const hasActiveFilters =
    search.trim() !== "" || category !== ALL_CATEGORIES;

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="h1" className="text-xl font-semibold sm:text-2xl">
            Products
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            Browse products in a table with search, filter, and pagination.
          </Text>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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

      {!isLoading && products.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_200px]">
          <div>
            <Label htmlFor="product-search" className="mb-1.5">
              Search
            </Label>
            <Input
              id="product-search"
              type="search"
              placeholder="Search by name, description, or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="product-category" className="mb-1.5">
              Category
            </Label>
            <Select
              id="product-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value={ALL_CATEGORIES}>All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <ProductTable
        products={paginatedProducts}
        isLoading={isLoading}
        emptyTitle={
          hasActiveFilters ? "No matching products" : "No products found"
        }
        emptyDescription={
          hasActiveFilters
            ? "Try adjusting your search or filter to find what you are looking for."
            : "There are no products to display yet. Try loading the list again."
        }
        emptyAction={
          hasActiveFilters ? (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setCategory(ALL_CATEGORIES);
              }}
            >
              Clear filters
            </Button>
          ) : loadMode === "empty" ? (
            <Button onClick={() => loadProducts("products")}>
              Load products
            </Button>
          ) : undefined
        }
      />

      {!isLoading && filteredProducts.length > 0 && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Text className="text-center text-sm text-muted-foreground sm:text-left">
            Showing {rangeStart}–{rangeEnd} of {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"}
          </Text>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center lg:justify-end">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setPage((current) => current - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Text className="text-center text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setPage((current) => current + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
