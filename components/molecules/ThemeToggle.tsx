"use client";

import { Button } from "@/components/atoms/Button";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="text-lg leading-none"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
