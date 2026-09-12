import { Logo } from "@/components/atoms/Logo";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { UserMenu } from "@/components/molecules/UserMenu";

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-[59px] items-center justify-between border-b border-[#e8ede8] px-5 sm:px-7 lg:px-[30px] dark:border-zinc-800">
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
        <span className="md:hidden"><Logo /></span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
