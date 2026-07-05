import { useEffect, useRef } from "react";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import QuestionEditorToolbar from "@/components/questions/QuestionEditorToolbar";
import {
  setEditorContent,
  syncEditorChange,
} from "@/utils/richTextEditor";

interface MarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
}

const editorContentClassName = clsx(
  "min-h-[120px] flex-1 px-2 py-2 text-base text-foreground focus:outline-none",
  "empty:before:text-muted-foreground/60 empty:before:content-[attr(data-placeholder)]",
  "[&_strong]:font-bold [&_b]:font-bold",
  "[&_em]:italic [&_i]:italic",
  "[&_u]:underline",
  "[&_del]:line-through [&_s]:line-through [&_strike]:line-through",
  "[&_a]:text-primary [&_a]:underline",
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:my-0.5",
  "[&_table]:my-2 [&_table]:w-full [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-input [&_th]:bg-muted [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
  "[&_td]:border [&_td]:border-input [&_td]:px-2 [&_td]:py-1",
  "[&_img]:my-2 [&_img]:max-w-full [&_img]:rounded",
  "[&_p]:my-1"
);

export default function MarkdownEditor({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Type here",
  error,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmittedMarkdown = useRef(value);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || value === lastEmittedMarkdown.current) return;

    setEditorContent(el, value);
    lastEmittedMarkdown.current = value;
  }, [value]);

  const emitChange = (markdown: string) => {
    lastEmittedMarkdown.current = markdown;
    onChange(markdown);
  };

  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;

    syncEditorChange(el, emitChange);
  };

  const handleClear = () => {
    const el = editorRef.current;
    if (el) {
      el.innerHTML = "";
    }

    emitChange("");
    el?.focus();
  };

  return (
    <div className="space-y-1">
      <div
        className={clsx(
          "overflow-hidden rounded-lg border",
          error ? "border-destructive" : "border-input"
        )}
      >
        <QuestionEditorToolbar editorRef={editorRef} onChange={emitChange} />

        <div className="flex items-start gap-2 px-2 py-2">
          <div
            ref={editorRef}
            id={id}
            contentEditable
            role="textbox"
            aria-multiline="true"
            aria-label="Question text"
            data-placeholder={placeholder}
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={onBlur}
            className={editorContentClassName}
          />

          <button
            type="button"
            onClick={handleClear}
            className="mt-1 shrink-0 cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Clear question text"
            title="Clear"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
