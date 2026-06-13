import { Text } from "@/components/atoms/Text";
import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  footer?: ReactNode;
};

export function Card({ title, description, footer }: CardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <Text as="h3" className="text-lg font-semibold">
        {title}
      </Text>
      {description && (
        <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </Text>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}
