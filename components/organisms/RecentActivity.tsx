import { ActivityItem } from "@/components/molecules/ActivityItem";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import type { Activity } from "@/types/activity";

type RecentActivityProps = {
  items: Activity[];
  isLoading: boolean;
};

export function RecentActivity({ items, isLoading }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Text as="h3" className="text-lg font-semibold">
        Recent activity
      </Text>

      <div className="mt-2">
        {isLoading ? (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className="py-3">
                <Skeleton className="h-5 w-full" />
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <EmptyState title="No activity yet" description="Create or edit a user to see it here." />
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {items.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
