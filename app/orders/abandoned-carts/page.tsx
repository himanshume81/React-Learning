import { OrdersView } from "@/components/organisms/AdminViews";
import { AppLayout } from "@/components/templates/AppLayout";

export default function AbandonedCartsPage() {
  return <AppLayout><OrdersView abandoned /></AppLayout>;
}
