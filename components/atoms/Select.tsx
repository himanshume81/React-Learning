import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export function Select({ hasError = false, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors focus:ring-2 dark:bg-zinc-950 ${
        hasError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "border-zinc-300 focus:border-foreground focus:ring-foreground/20 dark:border-zinc-700"
      } ${className}`}
      {...props}
    />
  );
}
