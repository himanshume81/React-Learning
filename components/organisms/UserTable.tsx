import { EmptyState } from "@/components/molecules/EmptyState";
import { UserCard } from "@/components/molecules/UserCard";
import { UserCardSkeleton } from "@/components/molecules/UserCardSkeleton";
import { UserRow } from "@/components/molecules/UserRow";
import { UserRowSkeleton } from "@/components/molecules/UserRowSkeleton";
import type { User } from "@/types/user";
import { memo, type ReactNode } from "react";

type UserTableProps = {
  users: User[];
  isLoading: boolean;
  onDelete: (user: User) => void;
  emptyAction?: ReactNode;
};

const SKELETON_COUNT = 5;

// Memoized: users/isLoading only change once the debounced search/filter
// fetch resolves, so this should bail out while the parent re-renders on
// every keystroke of the (unrelated) search input.
export const UserTable = memo(function UserTable({
  users,
  isLoading,
  onDelete,
  emptyAction,
}: UserTableProps) {
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
    <>
      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden" aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <UserCardSkeleton key={index} />
            ))
          : users.map((user) => (
              <UserCard key={user.id} user={user} onDelete={onDelete} />
            ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden rounded-xl border border-zinc-200 md:block dark:border-zinc-800">
        <table className="w-full text-left" aria-busy={isLoading}>
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
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
    </>
  );
});
