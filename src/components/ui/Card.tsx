import clsx from "clsx";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: boolean;
}

export default function Card({
  children,
  className,
  title,
  description,
  header,
  footer,
  padding = true,
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-card",
        padding && "p-6",
        className
      )}
    >
      {(title || description || header) && (
        <div
          className={clsx(
            title || description ? "mb-4 border-b border-border pb-4" : "mb-4"
          )}
        >
          {header ?? (
            <>
              {title && (
                <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </>
          )}
        </div>
      )}
      {children}
      {footer}
    </div>
  );
}
