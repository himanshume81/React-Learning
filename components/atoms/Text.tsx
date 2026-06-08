import type { ReactNode } from "react";

type TextProps = {
  as?: "p" | "span" | "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
};

export function Text({ as: Tag = "p", children, className = "" }: TextProps) {
  return <Tag className={className}>{children}</Tag>;
}
