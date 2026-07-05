import {
  formFieldSpacing,
  formLabelClassName,
} from "@/components/ui/formFieldStyles";
import { figmaSelectStyles } from "@/components/ui/reactSelectStyles";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import Select from "react-select";
import type { SingleValue } from "react-select";
import type { SelectOption } from "@/constants/testForm.constants";
import type { QuestionFormValues } from "./QuestionOptions";

interface TopicOption {
  id: string;
  name: string;
}

interface QuestionSettingsProps {
  control: Control<QuestionFormValues>;
  topics: TopicOption[];
  subTopics: TopicOption[];
  selectedTopic: string | undefined;
}

const DIFFICULTY_OPTIONS: SelectOption[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Difficult" },
];

const menuPortalTarget =
  typeof document !== "undefined" ? document.body : null;

function renderSelectField({
  inputId,
  options,
  placeholder,
  value,
  onChange,
  onBlur,
  isDisabled = false,
}: {
  inputId: string;
  options: SelectOption[];
  placeholder: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
  isDisabled?: boolean;
}) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <Select<SelectOption, false>
      inputId={inputId}
      options={options}
      value={selectedOption}
      onChange={(option: SingleValue<SelectOption>) => {
        onChange(option?.value ?? "");
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable
      styles={figmaSelectStyles}
      menuPortalTarget={menuPortalTarget}
    />
  );
}

export default function QuestionSettings({
  control,
  topics,
  subTopics,
  selectedTopic,
}: QuestionSettingsProps) {
  const topicOptions: SelectOption[] = topics.map((topic) => ({
    value: topic.id,
    label: topic.name,
  }));

  const subTopicOptions: SelectOption[] = subTopics.map((subTopic) => ({
    value: subTopic.id,
    label: subTopic.name,
  }));

  return (
    <div className="space-y-5 border-t border-border pt-6">
      <h3 className="text-base font-semibold text-foreground">
        Question settings
      </h3>

      <div className="flex flex-col gap-5">
        <div className={formFieldSpacing}>
          <label htmlFor="difficulty-select" className={formLabelClassName}>
            Level of Difficulty
          </label>
          <div className="flex flex-col gap-2 py-1">
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) =>
                renderSelectField({
                  inputId: "difficulty-select",
                  options: DIFFICULTY_OPTIONS,
                  placeholder: "Select Difficulty",
                  value: field.value,
                  onChange: field.onChange,
                  onBlur: field.onBlur,
                })
              }
            />
          </div>
        </div>
        <div className={`${formFieldSpacing} flex flex-col gap-2 py-1`}>
          <label htmlFor="topic-select" className={formLabelClassName}>
            Topic
          </label>
          <Controller
            name="topic_id"
            control={control}
            render={({ field }) =>
              renderSelectField({
                inputId: "topic-select",
                options: topicOptions,
                placeholder: "Select from Drop-down",
                value: field.value,
                onChange: field.onChange,
                onBlur: field.onBlur,
              })
            }
          />
        </div>

        <div className={`${formFieldSpacing} flex flex-col gap-2 py-1`}>
          <label htmlFor="subtopic-select" className={formLabelClassName}>
            Sub-topic
          </label>
          <Controller
            name="sub_topic_id"
            control={control}
            render={({ field }) =>
              renderSelectField({
                inputId: "subtopic-select",
                options: subTopicOptions,
                placeholder: "Select from Drop-down",
                value: field.value,
                onChange: field.onChange,
                onBlur: field.onBlur,
                isDisabled: !selectedTopic,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
