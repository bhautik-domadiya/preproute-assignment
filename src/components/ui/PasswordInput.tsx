import clsx from "clsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, className, containerClassName, labelClassName, id, ...props },
    ref
  ) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={clsx("flex flex-col gap-5 space-y-1", containerClassName)}>
        {label && (
          <label htmlFor={id} className={clsx("font-medium", labelClassName)}>
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={clsx(
              "w-full rounded-lg border p-3 pr-10",
              error ? "border-destructive" : "border-input",
              className,
              error &&
                "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
