import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ hasError = false, className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 ${
        hasError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "border-border focus:border-primary focus:ring-ring/20"
      } ${className}`}
      {...props}
    />
  );
}
