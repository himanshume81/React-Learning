import { AdminStaticFormRoute } from "@/components/templates/AdminStaticFormRoute";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";

export default function CreateIntegrationPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <AdminStaticFormRoute formKey="integrationForm" mode="create" />
      </AppLayout>
    </AuthGuard>
  );
}
