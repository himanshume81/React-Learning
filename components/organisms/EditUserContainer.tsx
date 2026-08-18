"use client";

import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { UserForm } from "@/components/organisms/UserForm";
import { fetchUserById, updateUser } from "@/lib/mock-users";
import type { UserFormValues } from "@/lib/validation/user-schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function EditUserContainer({ userId }: { userId: string }) {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<UserFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchUserById(userId).then((user) => {
      if (ignore) return;
      if (!user) {
        setNotFound(true);
      } else {
        setDefaultValues({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      }
      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const handleSubmit = async (values: UserFormValues) => {
    await updateUser(userId, values);
    router.push(`/users/${userId}`);
  };

  if (notFound) {
    return (
      <EmptyState
        title="User not found"
        description="This user may have already been deleted."
      />
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Text as="h1" className="text-2xl font-semibold">
          Edit user
        </Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Update this user's details.
        </Text>
      </div>

      {isLoading || !defaultValues ? (
        <div className="max-w-lg space-y-4 rounded-xl border border-zinc-200 p-8 dark:border-zinc-800">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        // Keyed so React mounts a fresh UserForm only once real data has
        // arrived — react-hook-form snapshots defaultValues on first render.
        <UserForm
          key={userId}
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/users/${userId}`)}
        />
      )}
    </section>
  );
}
