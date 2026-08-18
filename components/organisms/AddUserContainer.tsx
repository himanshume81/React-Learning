"use client";

import { Text } from "@/components/atoms/Text";
import { UserForm } from "@/components/organisms/UserForm";
import { createUser } from "@/lib/users-api";
import type { UserFormValues } from "@/lib/validation/user-schema";
import { useRouter } from "next/navigation";

export function AddUserContainer() {
  const router = useRouter();

  const handleSubmit = async (values: UserFormValues) => {
    await createUser(values);
    router.push("/users");
  };

  return (
    <section className="space-y-6">
      <div>
        <Text as="h1" className="text-2xl font-semibold">
          Add user
        </Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Create a new user account.
        </Text>
      </div>

      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/users")}
      />
    </section>
  );
}
