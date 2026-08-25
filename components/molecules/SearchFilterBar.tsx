import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import type { UserStatus } from "@/types/user";

type SearchFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: UserStatus | "all";
  onStatusChange: (value: UserStatus | "all") => void;
};

export function SearchFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        placeholder="Search by name or email..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search users"
        className="sm:max-w-xs"
      />
      <Select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as UserStatus | "all")}
        aria-label="Filter by status"
        className="sm:max-w-40"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    </div>
  );
}
