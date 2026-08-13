import { Skeleton } from "@/components/atoms/Skeleton";

export function UserRowSkeleton() {
  return (
    <tr className="border-b border-zinc-200 last:border-0 dark:border-zinc-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32" />
      </td>
    </tr>
  );
}
