"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { ProductSearchForm } from "@/components/molecules/ProductSearchForm";
import type { ProductSearchParams } from "@/lib/catalog-api";
import type { Product } from "@/types/product";

type Props = {
  query: string;
  products: Product[];
  reply: string | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  onSearch: (params: ProductSearchParams | null) => void;
};

export function ProductSearchAssistant({ query, products, reply, isLoading, error, onClose, onRetry, onSearch }: Props) {
  return (
    <aside aria-labelledby="product-assistant-title" className="min-w-0 self-start rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 id="product-assistant-title" className="flex items-center gap-2 text-lg font-semibold">
          <span aria-hidden="true" className="text-2xl text-violet-600">✧</span>
          AI Assistant
        </h2>
        <button type="button" onClick={onClose} aria-label="Close AI Assistant" className="rounded-lg px-2 py-1 text-xl text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-violet-500 dark:hover:bg-zinc-800">×</button>
      </div>

      <div className="mb-5">
        <ProductSearchForm
          key={query}
          id="product-assistant-search"
          initialQuery={query}
          compact
          isLoading={isLoading}
          onSearch={onSearch}
        />
      </div>

      <div className="mb-5 ml-6 break-words rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">{query}</div>

      <div aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            <Spinner size="sm" /> Finding matching products...
          </div>
        ) : error ? (
          <div role="alert" className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="secondary" onClick={onRetry}>Try again</Button>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap break-words rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {reply ?? (products.length > 0
                ? `I found ${products.length} matching product${products.length === 1 ? "" : "s"}. Explore the results below or view them in the product list.`
                : "No matching products found. Try a different description, brand, or price range.")}
            </p>
            {products.length > 0 ? (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-semibold">Top Results</h3>
                  <a href="#product-results" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">View all ({products.length})</a>
                </div>
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {products.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      <Link href={`/products/${product.id}`} className="flex items-center gap-3 rounded-lg py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          {product.imageUrl ? (
                            // Product images may come from arbitrary catalog upload hosts.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.imageUrl} alt="" className="h-full w-full object-contain" />
                          ) : <span aria-hidden="true" className="text-xl text-zinc-400">◇</span>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-medium">{product.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</p>
                          <p className="mt-1 text-xs text-zinc-500">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
                        </div>
                        <span aria-hidden="true" className="text-xl text-zinc-400">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </div>
    </aside>
  );
}
