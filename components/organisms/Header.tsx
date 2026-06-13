import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <Logo />

      <nav className="hidden items-center gap-2 md:flex">
        <NavLink href="/" label="Home" active />
        <NavLink href="/about" label="About" />
        <NavLink href="/contact" label="Contact" />
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
