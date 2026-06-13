import { RouteStatusLayout } from "@/components/templates/RouteStatusLayout";
import Link from "next/link";

export default function NotFound() {
  return (
    <RouteStatusLayout
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
      actions={
        <>
          <Link
            href="/"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            View products
          </Link>
        </>
      }
    />
  );
}
