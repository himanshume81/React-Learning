"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <Text className="text-sm text-zinc-500" aria-live="polite">
        ...
      </Text>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <Text className="text-sm font-medium">{user.name}</Text>
        <Text className="text-xs text-zinc-500">{user.email}</Text>
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
