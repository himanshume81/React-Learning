type SpinnerProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizeStyles = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-zinc-300 border-t-foreground dark:border-zinc-700 dark:border-t-zinc-100 ${sizeStyles[size]} ${className}`}
    />
  );
}
