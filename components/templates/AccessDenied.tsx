"use client";

import { useAuth } from "@/context/AuthContext";
import { firstPermittedPage } from "@/lib/rbac/permissions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccessDenied() {
  const { user } = useAuth();
  const pathname = usePathname();
  const fallback = firstPermittedPage(user);

  return (
    <div role="alert" className="space-y-3 py-8">
      <h1 className="text-xl font-semibold">Access denied</h1>
      <p>You do not have permission to view this page.</p>
      {fallback === "/no-access" ? (
        <p className="text-sm text-zinc-500">Ask an administrator to assign a role with page access.</p>
      ) : fallback !== pathname && (
        <Link className="text-green-700 underline dark:text-green-400" href={fallback}>
          Open an available page
        </Link>
      )}
    </div>
  );
}
