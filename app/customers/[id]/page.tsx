import { AdminCustomerDetailRoute } from "@/components/templates/AdminStaticRoute";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminCustomerDetailRoute customerId={id} />;
}
