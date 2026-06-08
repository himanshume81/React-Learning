import { NavLink } from "@/components/molecules/NavLink";
import { Text } from "@/components/atoms/Text";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
];

export function Sidebar() {
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
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>
    </aside>
  );
}
