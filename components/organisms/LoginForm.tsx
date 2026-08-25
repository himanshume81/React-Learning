"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/login-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const setupSuccess = searchParams.get("setup") === "success";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      userType: "user",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
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
      await login(result.data.email, result.data.password, result.data.userType);
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError("Incorrect email or password.");
      } else if (error instanceof ApiError && error.status === 400) {
        // Backend validation error, e.g. "email must be an email" — surface
        // it against the field it names, falling back to the banner.
        const message = error.message.toLowerCase();
        if (message.includes("email")) {
          setError("email", { message: error.message });
        } else if (message.includes("password")) {
          setError("password", { message: error.message });
        } else {
          setFormError(error.message);
        }
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
      <pre>{process.env.NEXT_PUBLIC_API_BASE_URL}</pre>

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

        <input type="hidden" value="admin" {...register("userType")} />

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              hasError={Boolean(errors.password?.message)}
              aria-invalid={Boolean(errors.password?.message)}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.4 5.5A10.7 10.7 0 0 1 12 5c5 0 9.3 3 11 7-1 2.3-2.8 4.1-5 5.3" />
                  <path d="M6.2 6.2C4.2 7.5 2.7 9.5 2 12c1.7 4 6 7 10 7 1.3 0 2.6-.3 3.8-.8" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {errors.password?.message && (
            <Text className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.password.message}
            </Text>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>

      {resetSuccess && (
        <Text
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          role="status"
        >
          Password reset successful. Sign in with your new password.
        </Text>
      )}

      {setupSuccess && (
        <Text
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          role="status"
        >
          Password setup successful. Sign in with your new password.
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
