import { Logo } from "@/components/atoms/Logo";
import { NavLink } from "@/components/molecules/NavLink";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <Logo />

      <nav className="hidden items-center gap-2 md:flex">
        <NavLink href="/" label="Home" active />
        <NavLink href="/about" label="About" />
        <NavLink href="/contact" label="Contact" />
      </nav>

      <Link
        href="/login"
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        Sign in
      </Link>
    </header>
  );
}
