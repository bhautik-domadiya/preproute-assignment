import clsx from "clsx";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  bordered?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  badge,
  bordered = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={clsx(
        "mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start",
        bordered && "border-b border-border pb-6",
        className
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
