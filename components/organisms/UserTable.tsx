import { EmptyState } from "@/components/molecules/EmptyState";
import { UserRow } from "@/components/molecules/UserRow";
import { UserRowSkeleton } from "@/components/molecules/UserRowSkeleton";
import type { User } from "@/types/user";
import type { ReactNode } from "react";

type UserTableProps = {
  users: User[];
  isLoading: boolean;
  onDelete: (user: User) => void;
  emptyAction?: ReactNode;
};

const SKELETON_COUNT = 5;

export function UserTable({ users, isLoading, onDelete, emptyAction }: UserTableProps) {
  if (!isLoading && users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="Try adjusting your search or filter."
        action={emptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left" aria-busy={isLoading}>
        <thead>
          <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
            <th className="px-4 py-3 font-semibold">User</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Role</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">Joined</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <UserRowSkeleton key={index} />
              ))
            : users.map((user) => (
                <UserRow key={user.id} user={user} onDelete={onDelete} />
              ))}
        </tbody>
      </table>
    </div>
  );
}
