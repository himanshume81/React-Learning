import { PostInventoryScreen } from "@/components/organisms/PostInventoryScreen";
import { AppLayout } from "@/components/templates/AppLayout";

export default async function IntegrationsScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  return <AppLayout><PostInventoryScreen moduleName="integrations" screen={screen} /></AppLayout>;
}
