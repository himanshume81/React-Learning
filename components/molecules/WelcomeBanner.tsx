"use client";

import { Text } from "@/components/atoms/Text";
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeBanner() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <Text className="text-sm font-medium">
        Welcome back, {user.name}!
      </Text>
      <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        You are signed in with {user.email}. Your session is stored with Context
        API and persists across page refreshes.
      </Text>
    </div>
  );
}
