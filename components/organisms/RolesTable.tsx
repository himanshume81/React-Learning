"use client";

import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { formatRoleId } from "@/lib/roles-api";
import type { Role } from "@/types/role";

type RolesTableProps = {
  roles: Role[];
  updatingId: string | null;
  onToggleStatus: (role: Role) => void;
};

export function RolesTable({ roles, updatingId, onToggleStatus }: RolesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Roles and their status</caption>
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th scope="col" className="px-4 py-3">Role ID</th>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b border-zinc-200 last:border-0 dark:border-zinc-800">
              <td className="px-4 py-3">
                <Link href={`/roles/${encodeURIComponent(role.id)}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  {formatRoleId(role.id)}
                </Link>
              </td>
              <td className="px-4 py-3">{role.name}</td>
              <td className="px-4 py-3"><Badge tone={role.status === "active" ? "success" : "neutral"}>{role.status ?? "Not provided"}</Badge></td>
              <td className="px-4 py-3">
                {role.systemKey === "admin" ? <span className="text-zinc-500">Protected</span> : role.status ? (
                  <Button variant="secondary" disabled={updatingId !== null} onClick={() => onToggleStatus(role)} aria-label={`${role.status === "active" ? "Deactivate" : "Activate"} ${role.name}`}>
                    {updatingId === role.id ? "Updating..." : role.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                ) : <span className="text-zinc-500">Status unavailable</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
