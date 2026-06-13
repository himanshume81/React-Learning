"use client";

import { Button } from "@/components/atoms/Button";
import { RouteStatusLayout } from "@/components/templates/RouteStatusLayout";
import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatusLayout
      title="Something went wrong"
      description="An unexpected error occurred while loading this page. You can try again or return to the dashboard."
      actions={
        <>
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Go home
          </Link>
        </>
      }
    />
  );
}
