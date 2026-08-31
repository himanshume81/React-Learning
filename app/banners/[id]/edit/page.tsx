import { AdminStaticFormRoute } from "@/components/templates/AdminStaticFormRoute";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";

export default function EditBannerPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <AdminStaticFormRoute formKey="bannerForm" mode="edit" />
      </AppLayout>
    </AuthGuard>
  );
}
