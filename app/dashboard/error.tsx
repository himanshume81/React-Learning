"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { useEffect } from "react";

// Nests inside app/dashboard/layout.tsx, so the header/sidebar stay mounted
// and only the page content is replaced with this fallback.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <Text as="h2" className="text-xl font-semibold">
        Something went wrong
      </Text>
      <Text className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        {error.message || "An unexpected error occurred while loading this page."}
      </Text>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
