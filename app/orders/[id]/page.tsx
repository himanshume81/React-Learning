import { AdminOrderDetailRoute } from "@/components/templates/AdminStaticRoute";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminOrderDetailRoute orderId={id} />;
}
