"use client";

import { PermissionGuard } from "@/components/templates/PermissionGuard";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { useEffect, useState, type ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [forbidden, setForbidden] = useState<string | null>(null);
  useEffect(() => {
    const onForbidden = (event: Event) => setForbidden((event as CustomEvent<string>).detail);
    window.addEventListener("api:forbidden", onForbidden);
    return () => window.removeEventListener("api:forbidden", onForbidden);
  }, []);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="min-w-0 px-5 py-[22px] sm:px-7 lg:px-[30px]"><PermissionGuard>{forbidden && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"><p>{forbidden}</p><button type="button" className="mt-2 underline" onClick={() => setForbidden(null)}>Dismiss</button></div>}{children}</PermissionGuard></main>
      </div>
    </div>
  );
}
