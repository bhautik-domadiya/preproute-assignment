import type { Question } from "@/types/question";
import clsx from "clsx";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";

interface QuestionSidebarProps {
  questions: Question[];
  totalQuestions: number;
  activeIndex: number | null;
  onSelect: (index: number) => void;
  onAddNew?: () => void;
  addDisabled?: boolean;
  readOnly?: boolean;
}

export default function QuestionSidebar({
  questions,
  totalQuestions,
  activeIndex,
  onSelect,
  onAddNew,
  addDisabled = false,
  readOnly = false,
}: QuestionSidebarProps) {
  const isAddingNew =
    !readOnly && activeIndex === null && questions.length < totalQuestions;

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-xl border border-border bg-card lg:w-56 xl:w-64">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-sm font-semibold text-foreground">Question Creation</h2>
        <p className="mt-1 text-xs text-muted-foreground">Total Questions: {totalQuestions}</p>
      </div>

      <div className="max-h-[520px] flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {questions.map((question, index) => {
            const isActive = activeIndex === index;
            const isCompleted =
              readOnly || Boolean(question.question?.trim());

            return (
              <li key={question.id ?? `question-${index}`}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={clsx(
                    "flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : isCompleted
                        ? "border-success bg-success/10 text-success hover:bg-success/15"
                        : "border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {isCompleted && (
                    <CheckIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span className="font-medium">Question {index + 1}</span>
                </button>
              </li>
            );
          })}

          {isAddingNew && questions.length < totalQuestions && (
            <li>
              <div
                className="flex w-full items-center gap-2 rounded-lg border border-primary bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
                aria-current="true"
              >
                Question {questions.length + 1}
              </div>
            </li>
          )}
        </ul>
      </div>

      {!readOnly && onAddNew && (
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={onAddNew}
            disabled={addDisabled}
            className={clsx(
              "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              isAddingNew
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            )}
          >
            <PlusIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Add Another Question
          </button>
        </div>
      )}
    </aside>
  );
}
