import clsx from "clsx";

export interface SegmentOption {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel = "Segmented control",
}: SegmentedControlProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-input p-1"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={clsx(
              "cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar text-primary shadow-none"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
