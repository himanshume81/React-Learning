"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/login-schema";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitMessage(null);
    clearErrors();

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmitMessage(`Welcome back! Logged in as ${result.data.email}`);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      noValidate
    >
      <div className="space-y-1">
        <Text as="h1" className="text-2xl font-semibold">
          Sign in
        </Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email and password to continue.
        </Text>
      </div>

      <div className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {submitMessage && (
        <Text
          className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
          role="status"
        >
          {submitMessage}
        </Text>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
