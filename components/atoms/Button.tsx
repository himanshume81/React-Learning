"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#4a942e] text-white hover:bg-[#3f7f27] disabled:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600",
  secondary:
    "border border-[#e0e6df] bg-white text-[#5f6872] hover:bg-[#f7faf6] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
  ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-900",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
