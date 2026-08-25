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
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsMobileNavOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
