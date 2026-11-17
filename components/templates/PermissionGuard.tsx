"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/templates/AuthGuard";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { firstPermittedPage, routeAllowed } from "@/lib/rbac/permissions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

export function PermissionGuard({ children }: { children: ReactNode }) {
  const { user, permissionError, refreshProfile, permissionsLoading } = useAuth();
  const pathname = usePathname();
  return (
    <AuthGuard>
      {permissionsLoading && !user ? <div className="flex justify-center py-24"><Spinner /></div> : permissionError ? (
        <div role="alert" className="space-y-3 py-8">
          <p>{permissionError}</p>
          <Button onClick={() => void refreshProfile()}>Retry access check</Button>
        </div>
      ) : routeAllowed(user, pathname) ? children : (
        <div role="alert" className="space-y-3 py-8">
          <h1 className="text-xl font-semibold">Access denied</h1>
          <p>You do not have permission to view this page.</p>
          <Link className="text-green-700 underline" href={firstPermittedPage(user)}>Open an available page</Link>
        </div>
      )}
    </AuthGuard>
  );
}
