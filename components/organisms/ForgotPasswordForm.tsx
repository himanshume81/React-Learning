"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import { forgotPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation/password-reset-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setFormError(null);
    setSuccessMessage(null);
    clearErrors();

    const result = forgotPasswordSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForgotPasswordFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    try {
      const message = await forgotPassword(result.data.email);
      setSuccessMessage(message || "If that email exists, a reset link has been sent.");
      reset({ email: result.data.email });
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
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
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      noValidate
    >
      <div className="space-y-1">
        <Text as="h1" className="text-2xl font-semibold">
          Forgot password
        </Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your account email and we&apos;ll send you a reset link or token.
        </Text>
      </div>

      <FormField
        id="forgot-password-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {successMessage && (
        <Text
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          role="status"
        >
          {successMessage}
        </Text>
      )}

      {formError && (
        <Text
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
          role="alert"
        >
          {formError}
        </Text>
      )}

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => router.push("/login")}
          disabled={isSubmitting}
        >
          Back to sign in
        </Button>
      </div>
    </form>
  );
}
