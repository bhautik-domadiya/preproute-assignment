import clsx from "clsx";

export type TestStatus =
  | "draft"
  | "live"
  | "scheduled"
  | "expired"
  | "unpublished";

const STATUS_LABELS: Record<TestStatus, string> = {
  draft: "Draft",
  live: "Published",
  scheduled: "Scheduled",
  expired: "Expired",
  unpublished: "Unpublished",
};

const STATUS_STYLES: Record<TestStatus, string> = {
  draft: "bg-warning/15 text-warning-foreground",
  live: "bg-success/15 text-success",
  scheduled: "bg-primary/15 text-primary",
  expired: "bg-muted text-muted-foreground",
  unpublished: "bg-secondary/15 text-secondary",
};

export interface BadgeProps {
  status: TestStatus;
}

export default function Badge({ status }: BadgeProps) {
  const label = STATUS_LABELS[status] ?? status;
  const styles = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={clsx(
        "shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize",
        styles
      )}
    >
      {label}
    </span>
  );
}
