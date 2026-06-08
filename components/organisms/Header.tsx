import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <Logo />

      <nav className="hidden items-center gap-2 md:flex">
        <NavLink href="/" label="Home" active />
        <NavLink href="/about" label="About" />
        <NavLink href="/contact" label="Contact" />
      </nav>

      <Button variant="secondary">Sign in</Button>
    </header>
  );
}
