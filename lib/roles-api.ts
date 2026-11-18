import { apiFetch } from "@/lib/api-client";
import { normalizePermissions } from "@/lib/rbac/permissions";
import type { Role, RoleInput, RoleStatus } from "@/types/role";

type RawRole = Omit<Role, "id" | "systemKey" | "status"> & { id: string | number; systemKey?: Role["systemKey"]; status?: string | null };
function toRole(raw: RawRole): Role {
  return {
    ...raw,
    id: String(raw.id),
    systemKey: raw.systemKey ?? null,
    status: raw.status?.toLowerCase() === "active" ? "active" : raw.status?.toLowerCase() === "inactive" ? "inactive" : null,
    permissions: normalizePermissions(raw.permissions),
  };
}
export async function fetchRoles(notifyForbidden = true): Promise<Role[]> {
  return (await apiFetch<RawRole[]>("/roles", { auth: true, notifyForbidden })).map(toRole);
}
export async function fetchRole(id: string): Promise<Role> {
  return toRole(await apiFetch<RawRole>(`/roles/${encodeURIComponent(id)}`, { auth: true, notifyForbidden: false }));
}
export async function saveRole(input: RoleInput, id?: string): Promise<Role> {
  return toRole(await apiFetch<RawRole>(id ? `/roles/${encodeURIComponent(id)}` : "/roles", {
    method: id ? "PATCH" : "POST", body: input, auth: true,
  }));
}
export async function deleteRole(id: string): Promise<void> {
  await apiFetch(`/roles/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}

export function formatRoleId(id: string): string {
  return `ROLE-${id.padStart(4, "0")}`;
}

export async function updateRoleStatus(id: string, status: RoleStatus): Promise<Role> {
  return toRole(await apiFetch<RawRole>(`/roles/${encodeURIComponent(id)}`, {
    method: "PATCH", body: { status }, auth: true,
  }));
}
