"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/templates/AuthGuard";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { routeAllowed } from "@/lib/rbac/permissions";
import { usePathname } from "next/navigation";
import { AccessDenied } from "@/components/templates/AccessDenied";
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
      ) : routeAllowed(user, pathname) ? children : <AccessDenied />}
    </AuthGuard>
  );
}
