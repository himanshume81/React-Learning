import { Text } from "@/components/atoms/Text";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <Text as="h3" className="text-lg font-semibold">
        {title}
      </Text>
      {description && (
        <Text className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </Text>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
