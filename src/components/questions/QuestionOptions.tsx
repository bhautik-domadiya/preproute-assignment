import type { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/components/ui/Input";
import {
  formFieldSpacing,
  formInputClassName,
} from "@/components/ui/formFieldStyles";

type OptionField = "option1" | "option2" | "option3" | "option4";

export interface QuestionFormValues {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: "option1" | "option2" | "option3" | "option4";
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  topic_id?: string;
  sub_topic_id?: string;
  media_url?: string;
}

interface QuestionOptionsProps {
  register: UseFormRegister<QuestionFormValues>;
  errors: FieldErrors<QuestionFormValues>;
  onClearOption: (field: OptionField) => void;
}

const OPTION_KEYS: OptionField[] = ["option1", "option2", "option3", "option4"];

export default function QuestionOptions({
  register,
  errors,
  onClearOption,
}: QuestionOptionsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Type the options below</p>

      {OPTION_KEYS.map((optKey, oIdx) => (
        <div key={optKey} className="flex items-center gap-3">
          <input
            id={`correct-${optKey}`}
            type="radio"
            value={optKey}
            aria-label={`Mark option ${String.fromCharCode(65 + oIdx)} as correct`}
            {...register("correct_option")}
            className="h-4 w-4 shrink-0 cursor-pointer border-input text-primary focus:ring-primary"
          />

          <div className="min-w-0 flex-1">
            <Input
              id={`${optKey}-input`}
              type="text"
              placeholder="Type Option here"
              containerClassName={formFieldSpacing}
              className={formInputClassName}
              error={errors[optKey]?.message}
              {...register(optKey)}
            />
          </div>

          <button
            type="button"
            onClick={() => onClearOption(optKey)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Clear option ${String.fromCharCode(65 + oIdx)}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      ))}

      {errors.correct_option?.message && (
        <p className="text-sm text-destructive">{errors.correct_option.message}</p>
      )}
    </div>
  );
}
