import type { Metadata } from "next";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard | SmartShopping Admin",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
