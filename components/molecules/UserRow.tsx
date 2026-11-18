"use client";

import { Permission } from "@/components/templates/Permission";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Text } from "@/components/atoms/Text";
import { ActionMenu, ActionMenuItem } from "@/components/molecules/ActionMenu";
import type { User } from "@/types/user";
import Link from "next/link";

type UserRowProps = {
  user: User;
  showActions: boolean;
  onDelete: (user: User) => void;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function UserRow({ user, onDelete, showActions }: UserRowProps) {
  return (
    <tr className="border-b border-zinc-200 last:border-0 dark:border-zinc-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            {showActions ? <Text className="font-medium">{user.name}</Text> : (
              <Link href={`/users/${user.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                {user.name}
              </Link>
            )}
            <Text className="text-sm text-zinc-500">{user.email}</Text>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge tone="info">{user.roleName ?? "Unassigned"}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge tone={user.status === "active" ? "success" : "neutral"}>
          {user.status}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Text className="text-sm text-zinc-500">{formatDate(user.joinedAt)}</Text>
      </td>
      {showActions && (
        <td className="px-4 py-3">
          <div className="flex items-center">
            <ActionMenu label={`Actions for ${user.name}`}>
              <Link
                href={`/users/${user.id}`}
                role="menuitem"
                className="flex rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                View
              </Link>
              <Permission menu="users" action="addEdit"><Link
                href={`/users/${user.id}/edit`}
                role="menuitem"
                className="flex rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Edit
              </Link></Permission>
              <Permission menu="users" action="delete"><ActionMenuItem tone="danger" onSelect={() => onDelete(user)}>
                Delete
              </ActionMenuItem></Permission>
            </ActionMenu>
          </div>
        </td>
      )}
    </tr>
  );
}
