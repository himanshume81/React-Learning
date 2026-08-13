"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { deleteUser, fetchUserById } from "@/lib/mock-users";
import type { User } from "@/types/user";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Only needed once a user clicks Delete, so it's split into its own chunk
// instead of shipping in this route's initial JS.
const ConfirmDialog = dynamic(() =>
  import("@/components/molecules/ConfirmDialog").then((m) => m.ConfirmDialog)
);

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export function UserDetailContainer({ userId }: { userId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchUserById(userId).then((result) => {
      if (ignore) return;
      setUser(result);
      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteUser(userId);
    setIsDeleting(false);
    setConfirmingDelete(false);
    router.push("/dashboard/users");
  };

  if (isLoading) {
    return (
      <div className="max-w-lg space-y-4 rounded-xl border border-zinc-200 p-8 dark:border-zinc-800">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="This user may have already been deleted."
        action={
          <Link href="/dashboard/users">
            <Button variant="secondary">Back to users</Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="max-w-lg space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} />
          <div>
            <Text as="h1" className="text-xl font-semibold">
              {user.name}
            </Text>
            <Text className="text-sm text-zinc-500">{user.email}</Text>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Badge tone="info">{user.role}</Badge>
          <Badge tone={user.status === "active" ? "success" : "neutral"}>
            {user.status}
          </Badge>
        </div>

        <Text className="mt-4 text-sm text-zinc-500">
          Joined {formatDate(user.joinedAt)}
        </Text>
      </div>

      <div className="flex gap-3">
        <Link href={`/dashboard/users/${user.id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
        <Button variant="ghost" onClick={() => setConfirmingDelete(true)}>
          Delete
        </Button>
        <Link href="/dashboard/users">
          <Button variant="ghost">Back to users</Button>
        </Link>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          open
          title="Delete user"
          message={`Are you sure you want to delete ${user.name}? This can't be undone.`}
          confirmLabel="Delete"
          isPending={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </section>
  );
}
