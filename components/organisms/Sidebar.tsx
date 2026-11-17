"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/atoms/Logo";
type NavItem = {
  href: string;
  label: string;
};

const navigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Orders", href: "/orders" },
  { label: "Customers", href: "/customers" },
  { label: "Products", href: "/products" },
  { label: "Category", href: "/categories" },
];

function routeIsActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarNavProps = {
  pathname: string;
  onNavigate?: () => void;
};

function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="Primary navigation" className="py-4">
      {navigation.map((item) => {
        const active = routeIsActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 cursor-pointer items-center px-[22px] text-[15px] transition-colors ${
              active
                ? "bg-[#f0faeb] font-medium text-[#4a942e] dark:bg-green-950/40 dark:text-green-400"
                : "text-[#6b7580] hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

type SidebarProps = {
  isMobileOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ isMobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobileOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onClose]);

  const sidebarContent = (mobile = false) => (
    <>
      <div className="flex h-[72px] items-center justify-between border-b border-[#e8ede8] px-[22px] dark:border-zinc-800">
        <Logo />
        {mobile ? (
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">✕</button>
        ) : null}
      </div>
      <SidebarNav key={pathname} pathname={pathname} onNavigate={mobile ? onClose : undefined} />
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 overflow-y-auto border-r border-[#e8ede8] bg-white md:block dark:border-zinc-800 dark:bg-zinc-950">
        {sidebarContent()}
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 h-full w-full bg-black/40" />
          <aside role="dialog" aria-modal="true" aria-label="Menu" className="absolute inset-y-0 left-0 w-[280px] overflow-y-auto border-r border-[#e8ede8] bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            {sidebarContent(true)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
