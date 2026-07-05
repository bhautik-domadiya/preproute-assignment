import { btnPrimary } from "@/components/ui/buttonStyles";

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`${btnPrimary} mt-6 px-5 py-2.5 text-sm`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
