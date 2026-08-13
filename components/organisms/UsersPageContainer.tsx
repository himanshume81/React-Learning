"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Pagination } from "@/components/molecules/Pagination";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";
import { UserTable } from "@/components/organisms/UserTable";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { deleteUser, fetchUsers } from "@/lib/mock-users";
import type { User, UserStatus } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export function UsersPageContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);

  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Filters changed: results and total pages will change, so any page > 1
  // is no longer guaranteed valid. Reset to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    fetchUsers({ search: debouncedSearch, status, page, pageSize: PAGE_SIZE }).then(
      (result) => {
        if (ignore) return;
        setUsers(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
        setIsLoading(false);
      }
    );

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, status, page, refreshKey]);

  const handleConfirmDelete = async () => {
    if (!userPendingDelete) return;
    setIsDeleting(true);
    await deleteUser(userPendingDelete.id);
    setIsDeleting(false);
    setUserPendingDelete(null);

    // If that was the last user on the last page, step back a page so we
    // don't land on a now-empty page. Otherwise just re-run the fetch effect.
    const remaining = total - 1;
    const newTotalPages = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
    if (page > newTotalPages) {
      setPage(newTotalPages);
    } else {
      setRefreshKey((key) => key + 1);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            Users
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Search, filter, and manage user accounts.
          </Text>
        </div>
        <Link href="/dashboard/users/add">
          <Button>+ Add user</Button>
        </Link>
      </div>

      <SearchFilterBar
        search={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={setStatus}
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        onDelete={setUserPendingDelete}
      />

      {!isLoading && users.length > 0 && (
        <Text className="text-sm text-zinc-500">
          Showing {users.length} of {total} user{total === 1 ? "" : "s"}
        </Text>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(userPendingDelete)}
        title="Delete user"
        message={`Are you sure you want to delete ${userPendingDelete?.name}? This can't be undone.`}
        confirmLabel="Delete"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserPendingDelete(null)}
      />
    </section>
  );
}
