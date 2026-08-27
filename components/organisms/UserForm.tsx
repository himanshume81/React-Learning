"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import { ApiError } from "@/lib/api-client";
import { userSchema, type UserFormValues } from "@/lib/validation/user-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UserFormProps = {
  mode: "create" | "edit";
  defaultValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function UserForm({ mode, defaultValues, onSubmit, onCancel }: UserFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "admin",
      status: "active",
    },
  });

  const submit = async (data: UserFormValues) => {
    setFormError(null);
    clearErrors();

    const result = userSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UserFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    try {
      await onSubmit(result.data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="max-w-lg space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      noValidate
    >
      <div className="space-y-4">
        <FormField
          id="name"
          label="Name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="jane.doe@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormField
          id="phoneNumber"
          label="Phone number"
          type="tel"
          placeholder="+15551234567"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />

        <input type="hidden" value="admin" {...register("role")} />

        <div className="space-y-1.5">
          <Text as="span" className="text-sm font-medium">
            Role
          </Text>
          <Text className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            Admin
          </Text>
        </div>

        <select
          id="status"
          {...register("status")}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-foreground/20 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status?.message && (
          <Text className="text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.status.message}
          </Text>
        )}
      </div>

      {formError && (
        <Text className="text-sm text-red-600 dark:text-red-400" role="alert">
          {formError}
        </Text>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create user"
              : "Save changes"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
