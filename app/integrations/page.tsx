import { AdminStaticRoute } from "@/components/templates/AdminStaticRoute";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";

export default function IntegrationsPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <AdminStaticRoute pageKey="integrations" />
      </AppLayout>
    </AuthGuard>
  );
}
