"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Text } from "@/components/atoms/Text";
import { ApiError } from "@/lib/api-client";
import { setPassword } from "@/lib/auth-api";
import {
  setPasswordSchema,
  type SetPasswordFormValues,
} from "@/lib/validation/password-reset-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function EyeIcon() {
  return (
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
  );
}

function EyeOffIcon() {
  return (
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
  );
}

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SetPasswordFormValues) => {
    setFormError(null);
    clearErrors();

    if (!token) {
      setFormError("Setup token is missing from the URL.");
      return;
    }

    const result = setPasswordSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SetPasswordFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    try {
      await setPassword(token, result.data.password);
      router.replace("/login?setup=success");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const message = error.message.toLowerCase();
        if (message.includes("token")) {
          setFormError(error.message);
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
      <div className="space-y-1">
        <Text as="h1" className="text-2xl font-semibold">
          Set password
        </Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          Choose a password for your account using the secure link from your email.
        </Text>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter a new password"
              autoComplete="new-password"
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
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.password?.message && (
            <Text className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.password.message}
            </Text>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              hasError={Boolean(errors.confirmPassword?.message)}
              aria-invalid={Boolean(errors.confirmPassword?.message)}
              className="pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmPassword?.message && (
            <Text className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.confirmPassword.message}
            </Text>
          )}
        </div>
      </div>

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
          {isSubmitting ? "Setting password..." : "Set password"}
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
