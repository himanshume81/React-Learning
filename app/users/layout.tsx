import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";
import type { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
