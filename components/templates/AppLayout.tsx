"use client";

import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";
import { useState, type ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="min-w-0 px-5 py-[22px] sm:px-7 lg:px-[30px]">{children}</main>
      </div>
    </div>
  );
}
