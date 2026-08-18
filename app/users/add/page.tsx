import type { Metadata } from "next";
import { AddUserContainer } from "@/components/organisms/AddUserContainer";

export const metadata: Metadata = {
  title: "Add user | User Management Dashboard",
};

export default function AddUserPage() {
  return <AddUserContainer />;
}
