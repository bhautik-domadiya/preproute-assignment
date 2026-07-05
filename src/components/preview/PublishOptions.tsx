import clsx from "clsx";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  formFieldSpacing,
  formInputClassName,
  formLabelClassName,
} from "@/components/ui/formFieldStyles";

export type PublishMode = "now" | "schedule";

interface PublishOptionsProps {
  mode: PublishMode;
  onModeChange: (mode: PublishMode) => void;
  scheduleDate: string;
  scheduleTime: string;
  onScheduleDateChange: (value: string) => void;
  onScheduleTimeChange: (value: string) => void;
}

const tabs: { id: PublishMode; label: string }[] = [
  { id: "now", label: "Publish Now" },
  { id: "schedule", label: "Schedule Publish" },
];

export default function PublishOptions({
  mode,
  onModeChange,
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
}: PublishOptionsProps) {
  return (
    <section className="space-y-6">
      <div className="flex gap-8 border-b border-border">
        {tabs.map((tab) => {
          const isActive = mode === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onModeChange(tab.id)}
              className={clsx(
                "cursor-pointer pb-3 text-sm transition-colors",
                isActive
                  ? "border-b-2 border-primary font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {mode === "schedule" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Select Date and Time
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={formFieldSpacing}>
              <label htmlFor="schedule-date" className={formLabelClassName}>
                Select Date
              </label>
              <div className="relative">
                <CalendarIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(event) => onScheduleDateChange(event.target.value)}
                  className={`${formInputClassName} w-full pl-10`}
                />
              </div>
            </div>
            <div className={formFieldSpacing}>
              <label htmlFor="schedule-time" className={formLabelClassName}>
                Select Time
              </label>
              <div className="relative">
                <ClockIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(event) => onScheduleTimeChange(event.target.value)}
                  className={`${formInputClassName} w-full pl-10`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
