import { Spinner } from "@/components/atoms/Spinner";
import { Text } from "@/components/atoms/Text";
import { AppLayout } from "@/components/templates/AppLayout";
import type { ReactNode } from "react";

type RouteStatusLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ReactNode;
};

export function RouteStatusLayout({
  title,
  description,
  actions,
  icon,
}: RouteStatusLayoutProps) {
  return (
    <AppLayout>
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 py-16 text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <Text as="h1" className="text-2xl font-semibold">
          {title}
        </Text>
        {description && (
          <Text className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </Text>
        )}
        {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </AppLayout>
  );
}

export function RouteLoadingLayout({ message = "Loading page..." }: { message?: string }) {
  return (
    <AppLayout>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner size="md" />
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">{message}</Text>
      </div>
    </AppLayout>
  );
}
