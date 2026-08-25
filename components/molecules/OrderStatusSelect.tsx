import { Badge } from "@/components/atoms/Badge";
import { getAvailableOrderStatuses, type OrderStatus } from "@/types/order";

export function badgeToneForOrderStatus(status: string) {
  switch (status) {
    case "delivered":
    case "confirmed":
    case "completed":
      return "success" as const;
    case "cancelled":
    case "refunded":
      return "danger" as const;
    case "processing":
    case "shipped":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

type OrderStatusSelectProps = {
  status: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
};

// Admins can jump ahead to any later stage in one step, but never move an
// order backward. Once there's nowhere forward left to go (completed, or a
// status outside the managed flow), this renders a plain read-only badge.
export function OrderStatusSelect({ status, onChange, disabled }: OrderStatusSelectProps) {
  const options = getAvailableOrderStatuses(status);

  if (options.length <= 1) {
    return <Badge tone={badgeToneForOrderStatus(status)}>{status}</Badge>;
  }

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Order status"
      className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-medium capitalize outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
    >
      {options.map((option) => (
        <option key={option} value={option} className="capitalize">
          {option}
        </option>
      ))}
    </select>
  );
}
