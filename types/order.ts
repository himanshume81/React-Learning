export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "completed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | string;

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
};

// The admin-managed lifecycle an order moves through. Anything outside this
// list (shipped/delivered/cancelled/refunded, etc.) comes from the backend
// but isn't part of the flow admins step through here.
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "processing",
  "confirmed",
  "completed",
];

// Statuses an admin may move this order to, current one included so a
// <select> can show it as the selected value. Forward-only: earlier stages
// are never offered. Empty once the order is at the last stage, or if its
// status isn't part of the managed flow at all.
export function getAvailableOrderStatuses(status: OrderStatus): OrderStatus[] {
  const index = ORDER_STATUS_FLOW.indexOf(status);
  if (index === -1) {
    return [];
  }
  return ORDER_STATUS_FLOW.slice(index);
}
