import { Text } from "@/components/atoms/Text";

type KPICardTone = "neutral" | "success" | "danger";

type KPICardProps = {
  label: string;
  value: number | string;
  hint?: string;
  tone?: KPICardTone;
};

const toneStyles: Record<KPICardTone, string> = {
  neutral: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  danger: "text-red-600 dark:text-red-400",
};

export function KPICard({ label, value, hint, tone = "neutral" }: KPICardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </Text>
      <Text as="h3" className={`mt-2 text-3xl font-semibold ${toneStyles[tone]}`}>
        {value}
      </Text>
      {hint && (
        <Text className="mt-1 text-xs text-zinc-500">{hint}</Text>
      )}
    </div>
  );
}
