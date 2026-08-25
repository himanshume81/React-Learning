import { Badge } from "@/components/atoms/Badge";
import { Text } from "@/components/atoms/Text";
import type { Activity } from "@/types/activity";

const toneByAction = {
  created: "success",
  updated: "info",
  deleted: "danger",
} as const;

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <Badge tone={toneByAction[activity.action]}>{activity.action}</Badge>
        <Text className="text-sm">
          <span className="font-medium">{activity.userName}</span> was{" "}
          {activity.action}
        </Text>
      </div>
      <Text className="shrink-0 text-xs text-zinc-500">
        {formatRelativeTime(activity.at)}
      </Text>
    </li>
  );
}
