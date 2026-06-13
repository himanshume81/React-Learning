"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div
      className="flex rounded-lg border border-border bg-surface p-1"
      role="group"
      aria-label="Theme mode"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={resolvedTheme === "light"}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          resolvedTheme === "light"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={resolvedTheme === "dark"}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          resolvedTheme === "dark"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Dark
      </button>
    </div>
  );
}
