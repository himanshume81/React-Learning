import type { Permissions } from "@/lib/rbac/permissions";

export type RoleStatus = "active" | "inactive";

export type Role = {
  id: string;
  name: string;
  status: RoleStatus | null;
  systemKey: "admin" | "user" | null;
  permissions: Permissions;
};
export type RoleInput = Pick<Role, "name" | "permissions"> & { status?: RoleStatus };
