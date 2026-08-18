"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/login-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

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
      await login(result.data.email, result.data.password);
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
