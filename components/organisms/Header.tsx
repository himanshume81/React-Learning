import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            ☰
          </button>
        )}
        <Logo />
      </div>

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
