import type { Metadata } from "next";
import { UsersPageContainer } from "@/components/organisms/UsersPageContainer";

export const metadata: Metadata = {
  title: "Users | User Management Dashboard",
};

export default function UsersPage() {
  return <UsersPageContainer />;
}
