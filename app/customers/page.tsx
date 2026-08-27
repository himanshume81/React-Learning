import type { Metadata } from "next";
import { UsersPageContainer } from "@/components/organisms/UsersPageContainer";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";

export const metadata: Metadata = {
  title: "Customers | User Management Dashboard",
};

export default function CustomersPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <UsersPageContainer
          targetRole="user"
          title="Customers"
          description="Search, filter, and manage customer accounts."
          addHref={null}
        />
      </AppLayout>
    </AuthGuard>
  );
}
