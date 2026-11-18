"use client";

import { useAuth } from "@/context/AuthContext";
import { can, type MenuKey, type PermissionAction } from "@/lib/rbac/permissions";
import type { ReactNode } from "react";

export function Permission({ menu, action = "view", children }: { menu: MenuKey; action?: PermissionAction; children: ReactNode }) {
  const { user } = useAuth();
  return can(user, menu, action) ? <>{children}</> : null;
}
