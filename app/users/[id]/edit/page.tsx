import type { Metadata } from "next";
import { EditUserContainer } from "@/components/organisms/EditUserContainer";

export const metadata: Metadata = {
  title: "Edit user | User Management Dashboard",
};

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  return <EditUserContainer userId={id} />;
}
