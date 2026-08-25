import { apiFetch } from "@/lib/api-client";
import type { Order, OrderStatus } from "@/types/order";

type RawOrder = {
  id: number | string;
  orderNumber?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  status?: unknown;
  totalAmount?: number | string | null;
  total?: number | string | null;
  amount?: number | string | null;
  itemCount?: number | string | null;
  itemsCount?: number | string | null;
  createdAt?: string | null;
  orderDate?: string | null;
  customer?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

type OrderListResponse =
  | RawOrder[]
  | {
      data?: RawOrder[];
      items?: RawOrder[];
      orders?: RawOrder[];
    };

function normalizeOrderStatus(status: unknown): OrderStatus {
  if (typeof status !== "string") {
    return "pending";
  }

  return status.toLowerCase();
}

function normalizeOrderListResponse(payload: OrderListResponse): RawOrder[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.items)) {
      return payload.items;
    }

    if (Array.isArray(payload.orders)) {
      return payload.orders;
    }
  }

  return [];
}

function toOrder(raw: RawOrder): Order {
  const id = String(raw.id);

  return {
    id,
    orderNumber: raw.orderNumber?.trim() || `ORD-${id.padStart(4, "0")}`,
    customerName: raw.customerName?.trim() || raw.customer?.name?.trim() || "Unknown customer",
    customerEmail: raw.customerEmail?.trim() || raw.customer?.email?.trim() || "No email",
    status: normalizeOrderStatus(raw.status),
    totalAmount: Number(raw.totalAmount ?? raw.total ?? raw.amount ?? 0),
    itemCount: Number(raw.itemCount ?? raw.itemsCount ?? 0),
    createdAt: raw.createdAt || raw.orderDate || new Date().toISOString(),
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const raw = await apiFetch<OrderListResponse>("/orders", { auth: true });
  return normalizeOrderListResponse(raw).map(toOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  // The response shape here isn't guaranteed to be a full order (it may just
  // echo the new status), so callers should apply `status` to local state
  // themselves rather than trusting a returned body.
  await apiFetch<unknown>(`/orders/${id}/status`, {
    method: "PATCH",
    body: { status: status.toUpperCase() },
    auth: true,
  });
}
