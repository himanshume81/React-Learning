"use client";

import { Text } from "@/components/atoms/Text";
import { NavLink } from "@/components/molecules/NavLink";
import { useAuth } from "@/contexts/AuthContext";

const publicLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
];

export function Sidebar() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface-muted p-4 md:block">
      {isAuthenticated && user && (
        <div className="mb-6 rounded-lg border border-border bg-surface p-3">
          <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Signed in as
          </Text>
          <Text className="mt-1 text-sm font-medium">{user.name}</Text>
          <Text className="text-xs text-muted-foreground">{user.email}</Text>
        </div>
      )}

      <Text
        as="h2"
        className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Menu
      </Text>
      <nav className="flex flex-col gap-1">
        {publicLinks.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
        {!isLoading && !isAuthenticated && (
          <NavLink href="/login" label="Login" />
        )}
      </nav>
    </aside>
  );
}
