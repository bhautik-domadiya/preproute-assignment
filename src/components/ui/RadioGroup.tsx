import clsx from "clsx";

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  ariaLabel?: string;
}

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  ariaLabel,
}: RadioGroupProps) {
  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-6"
        role="radiogroup"
        aria-label={ariaLabel}
        aria-invalid={!!error}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">{option.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className={clsx("mt-2 text-sm text-destructive")}>{error}</p>
      )}
    </div>
  );
}
