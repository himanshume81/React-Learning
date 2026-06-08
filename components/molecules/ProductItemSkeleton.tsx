import { Skeleton } from "@/components/atoms/Skeleton";

export function ProductItemSkeleton() {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-5 w-16" />
    </li>
  );
}
