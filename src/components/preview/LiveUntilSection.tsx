import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import RadioGroup from "@/components/ui/RadioGroup";
import {
  formFieldSpacing,
  formInputClassName,
  formLabelClassName,
} from "@/components/ui/formFieldStyles";

export type LiveUntilOption =
  | "always"
  | "1week"
  | "2weeks"
  | "1month"
  | "3months"
  | "custom";

interface LiveUntilSectionProps {
  value: LiveUntilOption;
  onChange: (value: LiveUntilOption) => void;
  endDate: string;
  endTime: string;
  onEndDateChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const liveUntilOptions = [
  { value: "always", label: "Always Available" },
  { value: "1week", label: "1 Week" },
  { value: "2weeks", label: "2 Weeks" },
  { value: "1month", label: "1 Month" },
  { value: "3months", label: "3 Months" },
  { value: "custom", label: "Custom Duration" },
];

export default function LiveUntilSection({
  value,
  onChange,
  endDate,
  endTime,
  onEndDateChange,
  onEndTimeChange,
}: LiveUntilSectionProps) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Live Until</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how long this test should remain available on the platform.
        </p>
      </div>

      <div className="[&_[role=radiogroup]]:grid [&_[role=radiogroup]]:grid-cols-1 [&_[role=radiogroup]]:gap-x-8 [&_[role=radiogroup]]:gap-y-3 sm:[&_[role=radiogroup]]:grid-cols-2">
        <RadioGroup
          name="live-until"
          options={liveUntilOptions}
          value={value}
          onChange={(next) => onChange(next as LiveUntilOption)}
          ariaLabel="Live until options"
        />
      </div>

      {value === "custom" && (
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <div className={formFieldSpacing}>
            <label htmlFor="end-date" className={formLabelClassName}>
              Select End Date
            </label>
            <div className="relative">
                <CalendarIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(event) => onEndDateChange(event.target.value)}
                className={`${formInputClassName} w-full pl-10`}
              />
            </div>
          </div>
          <div className={formFieldSpacing}>
            <label htmlFor="end-time" className={formLabelClassName}>
              Select End Time
            </label>
            <div className="relative">
                <ClockIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(event) => onEndTimeChange(event.target.value)}
                className={`${formInputClassName} w-full pl-10`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
