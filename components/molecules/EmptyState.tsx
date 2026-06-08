import { Text } from "@/components/atoms/Text";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
      <Text as="h3" className="text-lg font-semibold">
        {title}
      </Text>
      {description && (
        <Text className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </Text>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
