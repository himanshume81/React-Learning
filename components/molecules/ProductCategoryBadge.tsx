type ProductCategoryBadgeProps = {
  category: string;
};

const categoryStyles: Record<string, string> = {
  Electronics:
    "border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  Home: "border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
  Stationery:
    "border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  Outdoors:
    "border border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300",
};

const defaultCategoryStyle =
  "border border-zinc-200 bg-surface-muted text-zinc-600 dark:border-zinc-700 dark:text-zinc-400";

export function ProductCategoryBadge({ category }: ProductCategoryBadgeProps) {
  const className = categoryStyles[category] ?? defaultCategoryStyle;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${className}`}
    >
      {category}
    </span>
  );
}
