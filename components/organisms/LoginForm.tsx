"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/AuthContext";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/login-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    clearErrors();

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    try {
      await login(result.data.email, result.data.password);
      router.push("/");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    }
  };

  if (isAuthenticated) {
    return (
      <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <Text as="h1" className="text-2xl font-semibold">
          Already signed in
        </Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          You are already logged in. Go back to the dashboard to continue.
        </Text>
        <Button className="w-full" onClick={() => router.push("/")}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 rounded-xl border border-border bg-surface p-8 shadow-sm"
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

      {submitError && (
        <Text className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {submitError}
        </Text>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
