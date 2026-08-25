import type { ReactNode } from "react";

type BadgeTone = "success" | "neutral" | "danger" | "info";

type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
};

const toneStyles: Record<BadgeTone, string> = {
  success:
    "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  neutral:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export function Badge({ tone = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
