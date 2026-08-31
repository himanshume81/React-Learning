import { StaticAdminPage } from "@/components/organisms/StaticAdminPage";
import {
  getAdminPageConfig,
  getCustomerDetailConfig,
  getOrderDetailConfig,
} from "@/lib/admin-static-data";

export function AdminStaticRoute({ pageKey }: { pageKey: string }) {
  const config = getAdminPageConfig(pageKey);

  if (!config) {
    throw new Error(`Missing admin static page config: ${pageKey}`);
  }

  return <StaticAdminPage config={config} />;
}

export function AdminOrderDetailRoute({ orderId }: { orderId: string }) {
  return <StaticAdminPage config={getOrderDetailConfig(orderId)} />;
}

export function AdminCustomerDetailRoute({ customerId }: { customerId: string }) {
  return <StaticAdminPage config={getCustomerDetailConfig(customerId)} />;
}
