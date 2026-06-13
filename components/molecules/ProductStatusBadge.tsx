import type { ProductStatus } from "@/types/product";

const statusConfig: Record<
  ProductStatus,
  { label: string; className: string }
> = {
  in_stock: {
    label: "In stock",
    className:
      "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  low_stock: {
    label: "Low stock",
    className:
      "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  out_of_stock: {
    label: "Out of stock",
    className:
      "border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
};

type ProductStatusBadgeProps = {
  status: ProductStatus;
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "in_stock"
            ? "bg-emerald-500"
            : status === "low_stock"
              ? "bg-amber-500"
              : "bg-red-500"
        }`}
        aria-hidden
      />
      {config.label}
    </span>
  );
}

export function getStatusBorderClass(status: ProductStatus) {
  switch (status) {
    case "in_stock":
      return "border-l-emerald-500";
    case "low_stock":
      return "border-l-amber-500";
    case "out_of_stock":
      return "border-l-red-500";
  }
}
