import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useCallback } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, className, containerClassName, labelClassName, id, type, ...props },
    ref
  ) => {
    const isNumberInput = type === "number";

    const handleIncrement = useCallback(() => {
      const input = (ref as React.RefObject<HTMLInputElement>)?.current;
      if (!input) return;

      const step = Number(props.step || 1);
      const max = props.max !== undefined ? Number(props.max) : Infinity;
      const currentValue = input.value ? Number(input.value) : 0;
      const newValue = Math.min(currentValue + step, max);

      input.value = String(newValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, [ref, props.step, props.max]);

    const handleDecrement = useCallback(() => {
      const input = (ref as React.RefObject<HTMLInputElement>)?.current;
      if (!input) return;

      const step = Number(props.step || 1);
      const min = props.min !== undefined ? Number(props.min) : -Infinity;
      const currentValue = input.value ? Number(input.value) : 0;
      const newValue = Math.max(currentValue - step, min);

      input.value = String(newValue);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, [ref, props.step, props.min]);

    return (
      <div className={clsx("flex flex-col gap-4 space-y-1", containerClassName)}>
        {label && (
          <label htmlFor={id} className={clsx("font-medium", labelClassName)}>
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={type}
            className={clsx(
              "w-full rounded-lg border p-3",
              error ? "border-destructive" : "border-input",
              isNumberInput && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              isNumberInput && "pr-10",
              className,
              error &&
                "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
            )}
            {...props}
          />

          {isNumberInput && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={handleIncrement}
                className="flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors hover:bg-muted"
                tabIndex={-1}
              >
                <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={handleDecrement}
                className="flex cursor-pointer items-center justify-center rounded p-0.5 transition-colors hover:bg-muted"
                tabIndex={-1}
              >
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;