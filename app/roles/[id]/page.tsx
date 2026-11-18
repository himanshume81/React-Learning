import { AppLayout } from "@/components/templates/AppLayout";
import { RoleDetailContainer } from "@/components/organisms/RoleDetailContainer";

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppLayout><RoleDetailContainer key={id} roleId={id} /></AppLayout>;
}
