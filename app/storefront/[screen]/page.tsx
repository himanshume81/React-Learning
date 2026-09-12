import { PostInventoryScreen } from "@/components/organisms/PostInventoryScreen";
import { AppLayout } from "@/components/templates/AppLayout";

export default async function StorefrontScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  return <AppLayout><PostInventoryScreen moduleName="storefront" screen={screen} /></AppLayout>;
}
