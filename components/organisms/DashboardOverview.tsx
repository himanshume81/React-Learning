"use client";

import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/rbac/permissions";
import { KPICard } from "@/components/molecules/KPICard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { RecentActivity } from "@/components/organisms/RecentActivity";
import { fetchRecentActivity, fetchUserStats } from "@/lib/users-api";
import type { Activity } from "@/types/activity";
import { useEffect, useState } from "react";

type Stats = { total: number; active: number; inactive: number };

export function DashboardOverview() {
  const { user } = useAuth();
  const canViewUsers = can(user, "users");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    if (!canViewUsers) return;
    Promise.all([fetchUserStats(), fetchRecentActivity()]).then(
      ([statsResult, activityResult]) => {
        if (ignore) return;
        setStats(statsResult);
        setActivity(activityResult);
        setIsLoading(false);
      }
    ).catch((error: unknown) => {
      if (!ignore) { setError(error instanceof Error ? error.message : "Could not load dashboard."); setIsLoading(false); }
    });

    return () => {
      ignore = true;
    };
  }, [canViewUsers]);

  if (!canViewUsers) return <section><Text as="h1" className="text-2xl font-semibold">Dashboard</Text><Text className="mt-2 text-zinc-500">Welcome. Use the sidebar to open your available pages.</Text></section>;

  if (error) return <p role="alert" className="text-red-600">{error}</p>;

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
    </section>
  );
}
