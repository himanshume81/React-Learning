import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <Logo />

      <nav className="hidden items-center gap-2 md:flex">
        <NavLink href="/dashboard" label="Dashboard" />
        <NavLink href="/dashboard/users" label="Users" />
        <NavLink href="/products" label="Products" />
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
