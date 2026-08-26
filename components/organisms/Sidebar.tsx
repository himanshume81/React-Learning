"use client";

import { Text } from "@/components/atoms/Text";
import { useAuth } from "@/context/AuthContext";
import { NavLink } from "@/components/molecules/NavLink";
import type { UserRole } from "@/types/user";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const links: Array<{
  href: string;
  label: string;
  roles?: UserRole[];
}> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users", roles: ["admin"] },
  { href: "/customers", label: "Customers" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/banners", label: "Banners" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

type SidebarNavProps = {
  pathname: string;
  onNavigate?: () => void;
};

function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  const { user, status } = useAuth();

  const visibleLinks = links.filter((link) => {
    if (!link.roles) {
      return true;
    }

    if (status !== "authenticated" || !user) {
      return false;
    }

    return link.roles.includes(user.role);
  });

  return (
    <nav className="flex flex-col gap-1" onClick={onNavigate}>
      {visibleLinks.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          active={isActive(pathname, link.href)}
        />
      ))}
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
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onClose]);

  return (
    <>
      {/* Desktop: always in the flow, hidden below md */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 p-4 md:block dark:border-zinc-800">
        <Text
          as="h2"
          className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Menu
        </Text>
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile: slide-out drawer from the left, opened via the header's menu button */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 w-64 border-r border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-4 flex items-center justify-between px-3">
              <Text
                as="h2"
                className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Menu
              </Text>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                ✕
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
