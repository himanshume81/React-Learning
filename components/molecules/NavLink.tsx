"use client";

import Link from "next/link";

type NavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

export function NavLink({ href, label, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
