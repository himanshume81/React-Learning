"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Modal } from "@/components/molecules/Modal";
import { OrderStatusSelect } from "@/components/molecules/OrderStatusSelect";
import { Pagination, type PageSize } from "@/components/molecules/Pagination";
import { useToast } from "@/context/ToastContext";
import { fetchProducts } from "@/lib/catalog-api";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { createOrder, fetchOrders, updateOrderStatus } from "@/lib/orders-api";
import { fetchUsers } from "@/lib/users-api";
import { ORDER_STATUS_FLOW, type Order, type OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";
import { useEffect, useMemo, useState } from "react";

const ALL_PAGE_SIZE = 1000;

type OrderItemForm = {
  productId: string;
  quantity: number;
};

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

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
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [orderProducts, setOrderProducts] = useState<Product[]>([]);
  const [orderUsers, setOrderUsers] = useState<User[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [ordersVersion, setOrdersVersion] = useState(0);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setPage(1);
  }, [status, pageSize]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    fetchOrders({
      page,
      limit: toApiPageSize(pageSize),
      status: status === "all" ? undefined : status,
    })
      .then((result) => {
        if (ignore) {
          return;
        }

        setOrders(result.data);
        setTotalOrders(result.total);
        setTotalPages(result.totalPages);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        if (ignore) {
          return;
        }

        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
        setIsLoading(false);
        showToast(error.message || "Failed to load orders.", "error");
      });

    return () => {
      ignore = true;
    };
  }, [page, pageSize, status, ordersVersion, showToast]);

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

  async function openCreateOrderModal() {
    setIsCreateModalOpen(true);
    setIsLoadingProducts(true);
    setOrderProducts([]);
    setOrderUsers([]);
    setOrderItems([]);
    setSelectedUserId("");
    setIdempotencyKey(createIdempotencyKey());

    try {
      const [products, users] = await Promise.all([
        fetchProducts(),
        fetchUsers({ pageSize: Number.MAX_SAFE_INTEGER }),
      ]);
      const availableProducts = products.filter((product) => product.stock > 0);
      const availableUsers = users.data.filter(
        (user) => user.status === "active" && user.role === "user"
      );
      setOrderProducts(availableProducts);
      setOrderUsers(availableUsers);
      setOrderItems(
        availableProducts.length > 0
          ? [{ productId: availableProducts[0].id, quantity: 1 }]
          : []
      );
      setSelectedUserId(availableUsers[0]?.id ?? "");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to load products.",
        "error"
      );
    } finally {
      setIsLoadingProducts(false);
    }
  }

  function closeCreateOrderModal() {
    if (!isCreatingOrder) {
      setIsCreateModalOpen(false);
      setOrderItems([]);
      setSelectedUserId("");
    }
  }

  function updateOrderItem(index: number, changes: Partial<OrderItemForm>) {
    setOrderItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item
      )
    );
  }

  function addOrderItem() {
    const unusedProduct = orderProducts.find(
      (product) => !orderItems.some((item) => item.productId === product.id)
    );

    if (unusedProduct) {
      setOrderItems((current) => [
        ...current,
        { productId: unusedProduct.id, quantity: 1 },
      ]);
    }
  }

  async function handleCreateOrder() {
    const userId = Number(selectedUserId);

    if (!Number.isInteger(userId) || userId <= 0) {
      showToast("Choose a user for this order.", "error");
      return;
    }

    const items = orderItems.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }));
    const hasInvalidItem =
      items.length === 0 ||
      items.some(
        (item) =>
          !Number.isInteger(item.productId) ||
          item.productId <= 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0 ||
          item.quantity >
            (orderProducts.find((product) => product.id === String(item.productId))
              ?.stock ?? 0)
      ) ||
      new Set(items.map((item) => item.productId)).size !== items.length;

    if (hasInvalidItem) {
      showToast("Choose each product once and enter a whole quantity of at least 1.", "error");
      return;
    }

    setIsCreatingOrder(true);

    try {
      await createOrder({ userId, items, idempotencyKey });
      showToast("Order created successfully.");
      setIsCreateModalOpen(false);
      setOrderItems([]);
      setPage(1);
      setOrdersVersion((version) => version + 1);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create the order.",
        "error"
      );
    } finally {
      setIsCreatingOrder(false);
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

      return matchesSearch;
    });
  }, [orders, debouncedSearch]);

  const isSearching = Boolean(debouncedSearch.trim());
  const displayedOrders = filteredOrders;
  const displayTotal = isSearching ? displayedOrders.length : totalOrders;
  const displayTotalPages = isSearching ? 1 : totalPages;
  const rangeStart =
    displayTotal === 0 ? 0 : isSearching ? 1 : (page - 1) * toApiPageSize(pageSize) + 1;
  const rangeEnd = isSearching
    ? displayedOrders.length
    : Math.min((page - 1) * toApiPageSize(pageSize) + displayedOrders.length, totalOrders);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            Orders
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review orders and filter the list by any available order status.
          </Text>
        </div>
        <Button onClick={() => void openCreateOrderModal()}>Create order</Button>
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

      {!isLoading && displayedOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Try adjusting the search or selected order status."
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {isLoading ? (
              Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-2 h-4 w-40" />
                  <Skeleton className="mt-2 h-4 w-52" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="col-span-2 h-10 w-full" />
                    <Skeleton className="col-span-2 h-10 w-full" />
                  </div>
                </div>
              ))
            ) : (
              displayedOrders.map((order) => (
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
                  Array.from({ length: 5 }, (_, index) => (
                    <tr
                      key={index}
                      className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-2 h-4 w-56" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-10" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-10 w-32" />
                      </td>
                    </tr>
                  ))
                ) : (
                  displayedOrders.map((order) => (
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

      <Modal
        open={isCreateModalOpen}
        onClose={closeCreateOrderModal}
        title="Create order"
      >
        {isLoadingProducts ? (
          <div className="space-y-5" aria-label="Loading order form">
            <Skeleton className="h-4 w-72" />
            <div>
              <Skeleton className="h-4 w-12" />
              <Skeleton className="mt-2 h-10 w-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem_auto] sm:items-end">
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-2 h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-2 h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-10 w-28" />
            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Text className="text-sm text-zinc-600 dark:text-zinc-400">
              Add the products and quantities for this order.
            </Text>

            <label className="block text-sm font-medium">
              User
              <Select
                className="mt-1"
                value={selectedUserId}
                disabled={isCreatingOrder}
                onChange={(event) => setSelectedUserId(event.target.value)}
              >
                {orderUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Select>
            </label>

            {orderItems.map((item, index) => {
              const selectedProduct = orderProducts.find(
                (product) => product.id === item.productId
              );

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem_auto] sm:items-end"
                >
                  <label className="block text-sm font-medium">
                    Product
                    <Select
                      className="mt-1"
                      value={item.productId}
                      disabled={isCreatingOrder}
                      onChange={(event) =>
                        updateOrderItem(index, { productId: event.target.value })
                      }
                    >
                      {orderProducts.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                          disabled={
                            product.id !== item.productId &&
                            orderItems.some((orderItem) => orderItem.productId === product.id)
                          }
                        >
                          {product.name} ({product.stock} in stock)
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="block text-sm font-medium">
                    Quantity
                    <Input
                      className="mt-1"
                      type="number"
                      min="1"
                      max={selectedProduct?.stock}
                      value={item.quantity}
                      disabled={isCreatingOrder}
                      onChange={(event) =>
                        updateOrderItem(index, { quantity: Number(event.target.value) })
                      }
                    />
                  </label>
                  <Button
                    variant="ghost"
                    type="button"
                    disabled={isCreatingOrder || orderItems.length === 1}
                    onClick={() =>
                      setOrderItems((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              );
            })}

            <Button
              variant="secondary"
              type="button"
              disabled={isCreatingOrder || orderItems.length >= orderProducts.length}
              onClick={addOrderItem}
            >
              Add product
            </Button>

            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <Button
                variant="secondary"
                type="button"
                disabled={isCreatingOrder}
                onClick={closeCreateOrderModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isCreatingOrder}
                onClick={() => void handleCreateOrder()}
              >
                {isCreatingOrder ? "Creating..." : "Create order"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Pagination
        page={page}
        totalPages={displayTotalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        total={displayTotal}
      />
    </section>
  );
}
