"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { ProductSearchForm } from "@/components/molecules/ProductSearchForm";
import type { ProductSearchParams } from "@/lib/catalog-api";
import type { Product } from "@/types/product";

export type ProductAssistantMessage = {
  id: number;
  query: string;
  reply?: string;
  error?: string;
  status: "loading" | "complete" | "error";
};

type Props = {
  messages: ProductAssistantMessage[];
  products: Product[];
  isLoading: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSearch: (params: ProductSearchParams | null) => void;
};

export function ProductSearchAssistant({
  messages,
  products,
  isLoading,
  onClose,
  onRetry,
  onSearch,
}: Props) {
  const latestMessage = messages.at(-1);

  return (
    <aside
      aria-labelledby="product-assistant-title"
      className="flex min-h-[520px] min-w-0 flex-col self-start rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="product-assistant-title" className="flex items-center gap-2 text-lg font-semibold">
          <span aria-hidden="true" className="text-2xl text-violet-600">✧</span>
          AI Assistant
        </h2>
        <button type="button" onClick={onClose} aria-label="Close AI Assistant" className="rounded-lg px-2 py-1 text-xl text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-violet-500 dark:hover:bg-zinc-800">×</button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            <div className="ml-6 break-words rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              {message.query}
            </div>

            {message.status === "loading" ? (
              <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                <Spinner size="sm" /> Finding matching products...
              </div>
            ) : message.status === "error" ? (
              <div role="alert" className="space-y-3">
                <p className="text-sm text-red-600 dark:text-red-400">{message.error}</p>
                {message.id === latestMessage?.id ? <Button variant="secondary" onClick={onRetry}>Try again</Button> : null}
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {message.reply}
              </p>
            )}
          </div>
        ))}

        {latestMessage?.status === "complete" && products.length > 0 ? (
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-semibold">Top Results</h3>
              <a href="#product-results" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-300">View current page</a>
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
      </div>

      <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <ProductSearchForm
          id="product-assistant-search"
          compact
          clearAfterSubmit
          isLoading={isLoading}
          onSearch={onSearch}
        />
      </div>
    </aside>
  );
}
