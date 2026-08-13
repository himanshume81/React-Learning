import type { HTMLAttributes, ReactNode } from "react";

type TextProps = {
  as?: "p" | "span" | "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function Text({ as: Tag = "p", children, className = "", ...rest }: TextProps) {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
}
