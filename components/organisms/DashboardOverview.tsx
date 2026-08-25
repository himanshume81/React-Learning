"use client";

import { AiChat } from "@/components/organisms/AiChat";
import { KPICard } from "@/components/molecules/KPICard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { fetchRecentActivity, fetchUserStats } from "@/lib/users-api";
import type { Activity } from "@/types/activity";
import { useEffect, useState } from "react";

type Stats = { total: number; active: number; inactive: number };

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    Promise.all([fetchUserStats(), fetchRecentActivity()]).then(
      ([statsResult, activityResult]) => {
        if (ignore) return;
        setStats(statsResult);
        setActivity(activityResult);
        setIsLoading(false);
      }
    );

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <Text as="h1" className="text-2xl font-semibold">
          Dashboard
        </Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          An overview of your users.
        </Text>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading || !stats ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <KPICard label="Total users" value={stats.total} />
            <KPICard label="Active" value={stats.active} tone="success" />
            <KPICard label="Inactive" value={stats.inactive} tone="danger" />
          </>
        )}
      </div>

      <RecentActivity items={activity} isLoading={isLoading} />

      <AiChat />
    </section>
  );
}
