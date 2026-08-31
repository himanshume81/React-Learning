import type { Metadata } from "next";
import { AdminStaticRoute } from "@/components/templates/AdminStaticRoute";

export const metadata: Metadata = {
  title: "Customers | User Management Dashboard",
};

export default function CustomersPage() {
  return <AdminStaticRoute pageKey="customersAll" />;
}
