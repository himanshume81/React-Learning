import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { AppLayout } from "@/components/templates/AppLayout";

const SKELETON_ROWS = 5;

function MobileCardSkeleton() {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-3 h-5 w-24" />
    </article>
  );
}

export function ProductsLoadingSkeleton() {
  return (
    <AppLayout>
      <section className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28 sm:h-8 sm:w-32" />
          <Skeleton className="h-4 w-full max-w-xs sm:max-w-md" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_200px]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-3 md:hidden">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <MobileCardSkeleton key={index} />
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface md:block">
          <table className="w-full text-left text-sm" aria-busy="true">
            <thead className="border-b border-border bg-surface-muted">
              <tr>
                <th className="px-3 py-3 font-medium md:px-4">Name</th>
                <th className="hidden px-3 py-3 font-medium lg:table-cell lg:px-4">
                  Description
                </th>
                <th className="px-3 py-3 font-medium md:px-4">Category</th>
                <th className="px-3 py-3 font-medium md:px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-3 py-3 md:px-4">
                    <Skeleton className="h-4 w-28 md:w-32" />
                  </td>
                  <td className="hidden px-3 py-3 lg:table-cell lg:px-4">
                    <Skeleton className="h-4 w-full max-w-xs" />
                  </td>
                  <td className="px-3 py-3 md:px-4">
                    <Skeleton className="h-4 w-20 md:w-24" />
                  </td>
                  <td className="px-3 py-3 md:px-4">
                    <Skeleton className="h-4 w-14 md:w-16" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Text className="text-sm text-zinc-500">Loading products...</Text>
      </section>
    </AppLayout>
  );
}
