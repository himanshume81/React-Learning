"use client";

import { Button } from "@/components/atoms/Button";
import { RouteStatusLayout } from "@/components/templates/RouteStatusLayout";
import Link from "next/link";
import { useEffect } from "react";

type ProductsErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsErrorPage({ error, reset }: ProductsErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatusLayout
      title="Unable to load products"
      description="Something went wrong while fetching the products page. Please try again."
      actions={
        <>
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/products"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Reload products
          </Link>
        </>
      }
    />
  );
}
