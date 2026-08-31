import { AdminStaticFormRoute } from "@/components/templates/AdminStaticFormRoute";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";

export default function CreateBannerPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <AdminStaticFormRoute formKey="bannerForm" mode="create" />
      </AppLayout>
    </AuthGuard>
  );
}
