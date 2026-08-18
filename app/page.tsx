import { DashboardOverview } from "@/components/organisms/DashboardOverview";
import { AppLayout } from "@/components/templates/AppLayout";
import { AuthGuard } from "@/components/templates/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <AppLayout>
        <DashboardOverview />
      </AppLayout>
    </AuthGuard>
  );
}
