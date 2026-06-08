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
          ? "bg-zinc-200 font-medium dark:bg-zinc-800"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }`}
    >
      {label}
    </Link>
  );
}
