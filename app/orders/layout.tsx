import { AdminSegmentLayout } from "@/components/templates/AdminSegmentLayout";
import type { ReactNode } from "react";

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return <AdminSegmentLayout>{children}</AdminSegmentLayout>;
}
