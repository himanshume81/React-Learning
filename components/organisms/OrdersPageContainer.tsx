"use client";

import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { OrderStatusSelect } from "@/components/molecules/OrderStatusSelect";
import { Pagination, type PageSize } from "@/components/molecules/Pagination";
import { useToast } from "@/context/ToastContext";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { fetchOrders, updateOrderStatus } from "@/lib/orders-api";
import { ORDER_STATUS_FLOW, type Order, type OrderStatus } from "@/types/order";
import { useEffect, useMemo, useState } from "react";

const ALL_PAGE_SIZE = Number.MAX_SAFE_INTEGER;

function toApiPageSize(pageSize: PageSize) {
  return pageSize === "all" ? ALL_PAGE_SIZE : pageSize;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function OrdersPageContainer() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, pageSize]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    fetchOrders()
      .then((result) => {
        if (ignore) {
          return;
        }

        setOrders(result);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        if (ignore) {
          return;
        }

        setOrders([]);
        setIsLoading(false);
        showToast(error.message || "Failed to load orders.", "error");
      });

    return () => {
      ignore = true;
    };
  }, [showToast]);

  async function handleStatusChange(order: Order, nextStatus: OrderStatus) {
    setUpdatingOrderId(order.id);

    try {
      await updateOrderStatus(order.id, nextStatus);
      setOrders((current) =>
        current.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to update order status.",
        "error"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const statusOptions = useMemo(() => {
    const extraStatuses = Array.from(
      new Set(orders.map((order) => order.status).filter((s) => !ORDER_STATUS_FLOW.includes(s)))
    ).sort();
    return [...ORDER_STATUS_FLOW, ...extraStatuses];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term);

      const matchesStatus = status === "all" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, debouncedSearch, status]);

  const total = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / toApiPageSize(pageSize)));
  const effectivePageSize = pageSize === "all" ? total || 1 : pageSize;
  const start = (page - 1) * effectivePageSize;
  const paginatedOrders =
    pageSize === "all"
      ? filteredOrders
      : filteredOrders.slice(start, start + effectivePageSize);
  const rangeStart = total === 0 ? 0 : start + 1;
  const rangeEnd = total === 0 ? 0 : start + paginatedOrders.length;

  return (
    <section className="space-y-6">
      <div>
        <Text as="h1" className="text-2xl font-semibold">
          Orders
        </Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Review orders and filter the list by any available order status.
        </Text>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search by order number or customer..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label="Search orders"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-foreground focus:ring-2 focus:ring-foreground/20 sm:max-w-xs dark:border-zinc-700 dark:bg-zinc-950"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus | "all")}
          aria-label="Filter orders by status"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-foreground/20 sm:max-w-48 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="all">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {!isLoading && paginatedOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Try adjusting the search or selected order status."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {isLoading ? (
              <div className="rounded-xl border border-zinc-200 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800">
                Loading orders...
              </div>
            ) : (
              paginatedOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="min-w-0">
                    <Text className="font-medium">{order.orderNumber}</Text>
                    <Text className="mt-1 text-sm text-zinc-500">
                      {order.customerName}
                    </Text>
                    <Text className="text-sm text-zinc-500">
                      {order.customerEmail}
                    </Text>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Text className="text-zinc-500">Amount</Text>
                      <Text className="mt-1 font-medium">
                        {formatMoney(order.totalAmount)}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-zinc-500">Items</Text>
                      <Text className="mt-1 font-medium">{order.itemCount}</Text>
                    </div>
                    <div className="col-span-2">
                      <Text className="text-zinc-500">Placed</Text>
                      <Text className="mt-1 font-medium">
                        {formatDate(order.createdAt)}
                      </Text>
                    </div>
                    <div className="col-span-2">
                      <Text className="text-zinc-500">Status</Text>
                      <div className="mt-1">
                        <OrderStatusSelect
                          status={order.status}
                          disabled={updatingOrderId === order.id}
                          onChange={(nextStatus) => handleStatusChange(order, nextStatus)}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-zinc-200 md:block dark:border-zinc-800">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Placed</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        <Text className="font-medium">{order.orderNumber}</Text>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <Text className="font-medium">{order.customerName}</Text>
                          <Text className="text-sm text-zinc-500">
                            {order.customerEmail}
                          </Text>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Text className="text-sm text-zinc-500">
                          {formatMoney(order.totalAmount)}
                        </Text>
                      </td>
                      <td className="px-4 py-3">
                        <Text className="text-sm text-zinc-500">{order.itemCount}</Text>
                      </td>
                      <td className="px-4 py-3">
                        <Text className="text-sm text-zinc-500">
                          {formatDate(order.createdAt)}
                        </Text>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusSelect
                          status={order.status}
                          disabled={updatingOrderId === order.id}
                          onChange={(nextStatus) => handleStatusChange(order, nextStatus)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        total={total}
      />
    </section>
  );
}
