"use client";

import { NavLink } from "@/components/molecules/NavLink";
import { Text } from "@/components/atoms/Text";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/products", label: "Products" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 p-4 md:block dark:border-zinc-800">
      <Text
        as="h2"
        className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-500"
      >
        Menu
      </Text>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)}
          />
        ))}
      </nav>
    </aside>
  );
}
