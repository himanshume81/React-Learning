import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import type { User } from "@/types/user";
import Link from "next/link";

type UserCardProps = {
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

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} />
        <div className="min-w-0 flex-1">
          <Text className="truncate font-medium">{user.name}</Text>
          <Text className="truncate text-sm text-zinc-500">{user.email}</Text>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone="info">{user.role}</Badge>
        <Badge tone={user.status === "active" ? "success" : "neutral"}>
          {user.status}
        </Badge>
        <Text className="text-xs text-zinc-500">
          Joined {formatDate(user.joinedAt)}
        </Text>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
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
    </div>
  );
}
