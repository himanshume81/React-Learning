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
      className={`animate-spin rounded-full border-muted border-t-primary ${sizeStyles[size]} ${className}`}
    />
  );
}
