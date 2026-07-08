import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import QuestionEditorHeader from "./QuestionEditorHeader";
import QuestionOptions, { type QuestionFormValues } from "./QuestionOptions";
import QuestionSettings from "./QuestionSettings";
import Input from "@/components/ui/Input";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { btnPrimary } from "@/components/ui/buttonStyles";
import {
  formFieldSpacing,
  formLabelClassName,
} from "@/components/ui/formFieldStyles";

interface TopicOption {
  id: string;
  name: string;
}

interface QuestionEditorFormProps {
  register: UseFormRegister<QuestionFormValues>;
  control: Control<QuestionFormValues>;
  errors: FieldErrors<QuestionFormValues>;
  topics: TopicOption[];
  subTopics: TopicOption[];
  selectedTopic: string | undefined;
  difficulty: string | undefined;
  onDifficultyChange: (value: string) => void;
  onClearOption: (field: "option1" | "option2" | "option3" | "option4") => void;
  currentNumber: number;
  totalNumber: number;
  isEditing: boolean;
  onDeleteQuestion?: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export default function QuestionEditorForm({
  register,
  control,
  errors,
  topics,
  subTopics,
  selectedTopic,
  onClearOption,
  currentNumber,
  totalNumber,
  isEditing,
  onDeleteQuestion,
  submitLabel,
  isSubmitting = false,
}: QuestionEditorFormProps) {
  return (
    <>
      <QuestionEditorHeader
        currentNumber={currentNumber}
        totalNumber={totalNumber}
        isEditing={isEditing}
        onDelete={onDeleteQuestion}
      />

      <div className="space-y-6">
        <div className={formFieldSpacing}>
          <Controller
            name="question"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                id="question-text"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Type here"
                error={errors.question?.message}
              />
            )}
          />
        </div>

        <QuestionOptions
          register={register}
          errors={errors}
          onClearOption={onClearOption}
        />

        <div className={formFieldSpacing}>
          <label htmlFor="explanation" className={formLabelClassName}>
            Add Explanation (Optional)
          </label>
          <div className="overflow-hidden rounded-lg border border-input">
            <textarea
              id="explanation"
              {...register("explanation")}
              rows={3}
              placeholder="Type here..."
              className="w-full resize-none border-0 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>

        <Input
          id="media-url"
          label="Media URL (Optional)"
          type="url"
          placeholder="https://example.com/image.png"
          containerClassName={formFieldSpacing}
          labelClassName={formLabelClassName}
          error={errors.media_url?.message}
          {...register("media_url")}
        />

        <QuestionSettings
          control={control}
          topics={topics}
          subTopics={subTopics}
          selectedTopic={selectedTopic}
        />

        <div className="flex justify-end border-t border-border pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${btnPrimary} min-w-[160px] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </>
  );
}

export type { QuestionFormValues };
