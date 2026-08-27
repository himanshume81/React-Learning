"use client";

import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Pagination, type PageSize } from "@/components/molecules/Pagination";
import { SearchFilterBar } from "@/components/molecules/SearchFilterBar";
import { UserTable } from "@/components/organisms/UserTable";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { deleteUser, fetchUsers } from "@/lib/users-api";
import type { User, UserRole, UserStatus } from "@/types/user";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

// Only needed once a user clicks Delete, so it's split into its own chunk
// instead of shipping in this route's initial JS.
const ConfirmDialog = dynamic(() =>
  import("@/components/molecules/ConfirmDialog").then((m) => m.ConfirmDialog)
);

// "All" is sent to the mock API as a pageSize larger than any possible
// result set, so the existing slice(start, start + pageSize) logic just
// returns everything on a single page — no API changes needed.
const ALL_PAGE_SIZE = Number.MAX_SAFE_INTEGER;

function toApiPageSize(pageSize: PageSize) {
  return pageSize === "all" ? ALL_PAGE_SIZE : pageSize;
}

type UsersPageContainerProps = {
  targetRole?: UserRole | "all";
  title?: string;
  description?: string;
  addHref?: string | null;
  addLabel?: string;
};

export function UsersPageContainer({
  targetRole = "admin",
  title = "Users",
  description = "Search, filter, and manage user accounts.",
  addHref = "/users/add",
  addLabel = "+ Add user",
}: UsersPageContainerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Filters changed: results and total pages will change, so any page > 1
  // is no longer guaranteed valid. Reset to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, pageSize]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    fetchUsers({
      search: debouncedSearch,
      status,
      role: targetRole,
      page,
      pageSize: toApiPageSize(pageSize),
    }).then((result) => {
      if (ignore) return;
      setUsers(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setIsLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, status, page, pageSize, refreshKey]);

  // Position of the current page's results within the full filtered set,
  // e.g. "11-18 of 18" rather than the ambiguous "8 of 18" on the last page.
  const effectivePageSize = pageSize === "all" ? total || 1 : pageSize;
  const rangeStart = (page - 1) * effectivePageSize + 1;
  const rangeEnd = rangeStart + users.length - 1;

  const handleConfirmDelete = async () => {
    if (!userPendingDelete) return;
    setIsDeleting(true);
    await deleteUser(userPendingDelete.id);
    setIsDeleting(false);
    setUserPendingDelete(null);

    // If that was the last user on the last page, step back a page so we
    // don't land on a now-empty page. Otherwise just re-run the fetch effect.
    const remaining = total - 1;
    const newTotalPages = Math.max(
      1,
      Math.ceil(remaining / toApiPageSize(pageSize))
    );
    if (page > newTotalPages) {
      setPage(newTotalPages);
    } else {
      setRefreshKey((key) => key + 1);
    }
  };

  if (!isLoading && users.length === 0 && targetRole === "user") {
    return (
      <section className="space-y-6">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            {title}
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </Text>
        </div>

        <SearchFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          status={status}
          onStatusChange={setStatus}
        />

        <EmptyState
          title="No customers found"
          description="Try adjusting your search or filter."
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text as="h1" className="text-2xl font-semibold">
            {title}
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </Text>
        </div>
        {addHref ? (
          <Link href={addHref}>
            <Button>{addLabel}</Button>
          </Link>
        ) : null}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        total={total}
      />

      {userPendingDelete && (
        <ConfirmDialog
          open
          title="Delete user"
          message={`Are you sure you want to delete ${userPendingDelete.name}? This can't be undone.`}
          confirmLabel="Delete"
          isPending={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setUserPendingDelete(null)}
        />
      )}
    </section>
  );
}
