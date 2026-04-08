import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/shared/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonOwnProps<T extends ElementType> = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  as?: T;
};

type ButtonProps<T extends ElementType> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-[0_12px_30px_-18px_rgba(15,98,254,0.9)] hover:bg-[#0a54dd]",
  secondary: "bg-secondary text-secondary-foreground hover:bg-[#c6d9ff]",
  ghost: "bg-transparent text-foreground hover:bg-surface-strong",
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button<T extends ElementType = "button">({
  as,
  children,
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-transparent font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60",
        variantClassMap[variant],
        sizeClassMap[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
