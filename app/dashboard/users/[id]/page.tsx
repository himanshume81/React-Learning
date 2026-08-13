import type { Metadata } from "next";
import { UserDetailContainer } from "@/components/organisms/UserDetailContainer";

export const metadata: Metadata = {
  title: "User details | User Management Dashboard",
};

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  return <UserDetailContainer userId={id} />;
}
