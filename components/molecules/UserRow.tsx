import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import type { User } from "@/types/user";
import Link from "next/link";

type UserRowProps = {
  user: User;
  onDelete: (user: User) => void;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function UserRow({ user, onDelete }: UserRowProps) {
  return (
    <tr className="border-b border-zinc-200 last:border-0 dark:border-zinc-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <Text className="font-medium">{user.name}</Text>
            <Text className="text-sm text-zinc-500">{user.email}</Text>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <Badge tone="info">{user.role}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge tone={user.status === "active" ? "success" : "neutral"}>
          {user.status}
        </Badge>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <Text className="text-sm text-zinc-500">{formatDate(user.joinedAt)}</Text>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/users/${user.id}`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            View
          </Link>
          <Link
            href={`/dashboard/users/${user.id}/edit`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Edit
          </Link>
          <Button variant="ghost" onClick={() => onDelete(user)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
