"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
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
      role: "viewer",
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
      const message = error instanceof Error ? error.message : "Something went wrong";
      if (message === "Email already in use") {
        setError("email", { message });
      } else {
        setFormError(message);
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

        <SelectField id="role" label="Role" error={errors.role?.message} {...register("role")}>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </SelectField>

        <SelectField
          id="status"
          label="Status"
          error={errors.status?.message}
          {...register("status")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </SelectField>
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
