"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserMenu() {
  const { user, status, logout } = useAuth();
  const router = useRouter();

  if (status === "loading") {
    return <Skeleton className="h-9 w-24" />;
  }

  if (status !== "authenticated" || !user) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        Sign in
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar name={user.name} size="sm" />
      <Text className="hidden text-sm font-medium sm:block">{user.name}</Text>
      <Button variant="secondary" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
}
