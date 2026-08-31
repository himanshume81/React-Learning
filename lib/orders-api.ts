import { apiFetch } from "@/lib/api-client";
import type { Order, OrderStatus } from "@/types/order";

export type CreateOrderInput = {
  userId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  idempotencyKey: string;
};

type RawOrder = {
  id: number | string;
  orderNumber?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  status?: unknown;
  totalAmount?: number | string | null;
  total?: number | string | null;
  amount?: number | string | null;
  itemCount?: number | string | null;
  itemsCount?: number | string | null;
  items?: unknown[] | null;
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
      total?: number | string;
      page?: number | string;
      limit?: number | string;
      totalPages?: number | string;
      pagination?: {
        total?: number | string;
        page?: number | string;
        limit?: number | string;
        totalPages?: number | string;
      };
      meta?: {
        total?: number | string;
        page?: number | string;
        limit?: number | string;
        totalPages?: number | string;
      };
    };

export type OrderListQuery = {
  page: number;
  limit: number;
  status?: OrderStatus;
};

export type PaginatedOrders = {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

function toPositiveInteger(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function toOrder(raw: RawOrder): Order {
  const id = String(raw.id);

  return {
    id,
    orderNumber: raw.orderNumber?.trim() || `ORD-${id.padStart(4, "0")}`,
    customerName:
      raw.userName?.trim() || raw.customerName?.trim() || raw.customer?.name?.trim() || "Unknown customer",
    customerEmail:
      raw.userEmail?.trim() || raw.customerEmail?.trim() || raw.customer?.email?.trim() || "No email",
    status: normalizeOrderStatus(raw.status),
    totalAmount: Number(raw.totalAmount ?? raw.total ?? raw.amount ?? 0),
    itemCount: Number(raw.itemCount ?? raw.itemsCount ?? raw.items?.length ?? 0),
    createdAt: raw.createdAt || raw.orderDate || new Date().toISOString(),
  };
}

export async function fetchOrders({ page, limit, status }: OrderListQuery): Promise<PaginatedOrders> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: "createdAt_desc",
  });

  if (status) {
    query.set("status", status.toUpperCase());
  }

  const raw = await apiFetch<OrderListResponse>(`/orders/all?${query.toString()}`, {
    auth: true,
  });
  const data = normalizeOrderListResponse(raw).map(toOrder);
  const metadata = Array.isArray(raw) ? undefined : raw.pagination ?? raw.meta ?? raw;
  const total = toPositiveInteger(metadata?.total, data.length);
  const currentPage = toPositiveInteger(metadata?.page, page);
  const currentLimit = toPositiveInteger(metadata?.limit, limit);
  const totalPages = toPositiveInteger(metadata?.totalPages, Math.max(1, Math.ceil(total / currentLimit)));

  return { data, total, page: currentPage, limit: currentLimit, totalPages };
}

export async function createOrder(input: CreateOrderInput): Promise<void> {
  await apiFetch<unknown>("/orders", {
    method: "POST",
    body: {
      userId: input.userId,
      items: input.items,
    },
    headers: { "Idempotency-Key": input.idempotencyKey },
    auth: true,
  });
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
