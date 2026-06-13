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
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            View products
          </Link>
        </>
      }
    />
  );
}
