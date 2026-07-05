interface Step {
  label: string;
}

interface Props {
  steps: Step[];
  current: number;
}

export default function PageBreadcrumb({ steps, current }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {steps.map((step, index) => {
          const isCurrent = index === current;

          return (
            <li key={`${step.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-border" aria-hidden="true">
                  /
                </span>
              )}
              <span
                className={
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
