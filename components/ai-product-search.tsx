"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Spinner } from "@/components/atoms/Spinner";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductCard } from "@/components/product-card";
import {
  aiProductTransport,
  type AiProduct,
  type ProductChatMessage,
} from "@/services/ai-product.service";

export function AiProductSearch() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
    stop,
    clearError,
  } = useChat<ProductChatMessage>({
    transport: aiProductTransport,
  });

  const isBusy = status === "submitted" || status === "streaming";
  const assistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const answer = assistantMessage?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("") ?? "";
  const products = assistantMessage?.parts.reduce<AiProduct[]>((current, part) => {
    return part.type === "data-products" ? part.data : current;
  }, []) ?? [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery || isBusy) return;

    // Each search is independent: clear the previous answer and products
    // before useChat creates the next user/assistant message pair.
    setMessages([]);
    clearError();
    setHasSearched(true);
    void sendMessage({ text: trimmedQuery });
  }

  return (
    <section className="w-full" aria-labelledby="ai-product-search-title">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-medium text-[#4a942e] dark:text-green-400">
            AI-powered search
          </p>
          <h1 id="ai-product-search-title" className="text-2xl font-semibold tracking-tight">
            Find the right product
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Describe what you need, including your budget, preferred brand, or use case.
          </p>
        </div>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <label htmlFor="ai-product-query" className="sr-only">
            Product search query
          </label>
          <Input
            id="ai-product-query"
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Show me laptops under ₹80,000 for coding"
            autoComplete="off"
            disabled={isBusy}
            aria-describedby={error ? "ai-product-search-error" : undefined}
            className="min-h-11 flex-1"
          />
          <Button
            type="submit"
            disabled={isBusy || !query.trim()}
            className="inline-flex min-h-11 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-28"
          >
            {isBusy ? (
              <>
                <Spinner size="sm" className="border-white/50 border-t-white" />
                {status === "submitted" ? "Searching" : "Streaming"}
              </>
            ) : (
              "Search"
            )}
          </Button>
          {isBusy ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => void stop()}
              className="min-h-11"
            >
              Stop
            </Button>
          ) : null}
        </form>

        <p className="mt-2 text-xs text-zinc-500">Press Enter to search.</p>

        {error ? (
          <div
            id="ai-product-search-error"
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error.message || "We couldn't search products right now. Please try again."}
          </div>
        ) : null}
      </div>

      <div className="mt-8" aria-live="polite" aria-busy={isBusy}>
        {answer || isBusy ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                AI answer
              </p>
              {isBusy ? <Spinner size="sm" /> : null}
            </div>
            <p className="mt-2 min-h-6 whitespace-pre-wrap text-sm leading-6 text-zinc-800 dark:text-zinc-200">
              {answer || "Thinking..."}
              {status === "streaming" && answer ? (
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-4 w-1 animate-pulse bg-green-600 align-middle"
                />
              ) : null}
            </p>
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Matched products ({products.length})</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : hasSearched && status === "ready" && !error ? (
          <div className="mt-6">
            <EmptyState
              title="No matching products"
              description="Try changing your budget, brand, category, or intended use."
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
