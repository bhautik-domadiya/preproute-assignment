import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  loading,
  children,
  className,
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={clsx(
        "h-12 w-full cursor-pointer rounded-lg bg-primary text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
