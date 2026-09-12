import { PostInventoryScreen } from "@/components/organisms/PostInventoryScreen";
import { AppLayout } from "@/components/templates/AppLayout";

export default async function TeamScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  return <AppLayout><PostInventoryScreen moduleName="team" screen={screen} /></AppLayout>;
}
