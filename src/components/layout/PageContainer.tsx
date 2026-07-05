import clsx from "clsx";
import type { ReactNode } from "react";

type PageWidth = "default" | "narrow";

interface PageContainerProps {
  children: ReactNode;
  width?: PageWidth;
  className?: string;
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
