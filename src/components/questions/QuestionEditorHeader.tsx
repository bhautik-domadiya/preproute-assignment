import { TrashIcon } from "@heroicons/react/24/outline";

interface QuestionEditorHeaderProps {
  currentNumber: number;
  totalNumber: number;
  isEditing: boolean;
  onDelete?: () => void;
}

export default function QuestionEditorHeader({
  currentNumber,
  totalNumber,
  isEditing,
  onDelete,
}: QuestionEditorHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
      <h2 className="text-lg font-semibold text-foreground">
        Question {currentNumber}/{totalNumber}
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground/60"
          aria-label="MCQ question type"
        >
          MCQ
        </span>

        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete question"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
