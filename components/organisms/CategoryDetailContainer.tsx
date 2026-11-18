"use client";

import { AccessDenied } from "@/components/templates/AccessDenied";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import { can } from "@/lib/rbac/permissions";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { fetchCategoryById, formatRecordId } from "@/lib/catalog-api";
import type { Category } from "@/types/category";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CategoryDetailContainer({ categoryId }: { categoryId: string }) {
  const { user } = useAuth();
  const canViewProducts = can(user, "products");
  const [viewDenied, setViewDenied] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetchCategoryById(categoryId, canViewProducts).then((result) => {
      if (ignore) {
        return;
      }

      setViewDenied(false);
      setCategory(result);
      setIsLoading(false);
    }).catch((error: unknown) => {
      if (ignore) return;
      setCategory(null);
      setViewDenied(error instanceof ApiError && error.status === 403);
      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [categoryId, canViewProducts]);

  if (viewDenied) return <AccessDenied />;

  if (isLoading) {
    return (
      <div className="max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <Text className="text-sm text-zinc-500">Loading category...</Text>
      </div>
    );
  }

  if (!category) {
    return (
      <EmptyState
        title="Category not found"
        description="This category may have been deleted or is unavailable."
        action={
          <Link href="/categories">
            <Button variant="secondary">Back to categories</Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Text className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Category ID
        </Text>
        <Text as="h1" className="mt-2 text-2xl font-semibold">
          {formatRecordId("CAT", category.id)}
        </Text>

        <div className="mt-6 space-y-4">
          <div>
            <Text className="text-sm font-medium text-zinc-500">Name</Text>
            <Text className="mt-1 text-base">{category.name}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">Slug</Text>
            <Text className="mt-1 text-base">{category.slug}</Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500">Description</Text>
            <Text className="mt-1 text-base">
              {category.description || "No description provided."}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={category.status === "active" ? "success" : "neutral"}>
              {category.status}
            </Badge>
            {canViewProducts && category.productCount !== undefined && (
              <Badge tone="info">
                {category.productCount} product{category.productCount === 1 ? "" : "s"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Link href="/categories">
        <Button variant="ghost">Back to categories</Button>
      </Link>
    </section>
  );
}
