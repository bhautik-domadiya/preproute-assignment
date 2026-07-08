import {
  testSchema,
  type TestFormData,
} from "@/features/tests/test.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FieldValues, Path, Resolver, UseFormReturn } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { MultiValue, SingleValue } from "react-select";
import Select from "react-select";

import { useSubTopics } from "@/hooks/useSubTopics";
import { useSubjects } from "@/hooks/useSubjects";
import { useTopics } from "@/hooks/useTopics";

import type { SelectOption } from "@/constants/testForm.constants";

import {
  isUuid,
  resolveSubjectId,
  resolveSubTopicIds,
  resolveTopicIds,
} from "@/utils/masterData";

import Input from "@/components/ui/Input";
import RadioGroup from "@/components/ui/RadioGroup";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { btnCancel, btnPrimary } from "@/components/ui/buttonStyles";
import {
  formFieldSpacing,
  formInputClassName,
  formLabelClassName,
} from "@/components/ui/formFieldStyles";
import { figmaSelectStyles } from "@/components/ui/reactSelectStyles";

const CREATE_DEFAULT_VALUES: Partial<TestFormData> = {
  type: "chapterwise",
  subject: "",
  difficulty: "easy",
  wrong_marks: 0,
  unattempt_marks: 0,
  correct_marks: 5,
  topics: [],
  sub_topics: [],
};

const TYPE_TABS = [
  { id: "chapterwise", label: "Chapter Wise" },
  { id: "pyq", label: "PYQ" },
  { id: "mock", label: "Mock Test" },
] as const;

type TypeTabId = (typeof TYPE_TABS)[number]["id"];

const TYPE_BREADCRUMB_LABELS: Record<TypeTabId, string> = {
  chapterwise: "Chapter Wise",
  pyq: "PYQ",
  mock: "Mock Test",
};

const DIFFICULTY_RADIO_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Difficult" },
];

function resolveTypeTab(type?: string): TypeTabId {
  if (type === "mock") return "mock";
  if (type === "pyq") return "pyq";
  return "chapterwise";
}

function mapToOptions<T extends { id: string; name: string }>(
  items: T[]
): SelectOption[] {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

interface FormSelectProps<T extends FieldValues> {
  label: string;
  inputId: string;
  name: Path<T>;
  control: UseFormReturn<T>["control"];
  options: SelectOption[];
  placeholder: string;
  isMulti?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string;
  isClearable?: boolean;
  onValueChange?: (val: string | string[]) => void;
}

function FormSelect<T extends FieldValues>({
  label,
  inputId,
  name,
  control,
  options,
  placeholder,
  isMulti = false,
  isDisabled = false,
  isLoading = false,
  error,
  isClearable = true,
  onValueChange,
}: FormSelectProps<T>) {
  return (
    <div className={clsx(formFieldSpacing, 'flex flex-col gap-[15px]')}>
      <label htmlFor={inputId} className={formLabelClassName}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectValue = isMulti
            ? options.filter((o) =>
                (field.value as string[] | undefined)?.includes(o.value)
              )
            : options.find((o) => o.value === field.value) || null;

          return (
            <Select
              ref={field.ref}
              inputId={inputId}
              isMulti={isMulti}
              options={options}
              value={selectValue}
              onChange={(val) => {
                if (isMulti) {
                  const selected = val as MultiValue<SelectOption>;
                  const ids = selected ? selected.map((o) => o.value) : [];

                  field.onChange(ids);
                  onValueChange?.(ids);
                } else {
                  const selected = val as SingleValue<SelectOption>;
                  const id = selected ? selected.value : "";
                  field.onChange(id);
                  onValueChange?.(id);
                }
              }}
              placeholder={placeholder}
              isDisabled={isDisabled}
              isLoading={isLoading}
              isClearable={isClearable}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              styles={figmaSelectStyles}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
            />
          );
        }}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface Props {
  defaultValues?: Partial<TestFormData>;
  loading?: boolean;
  mode?: "create" | "edit";
  onCancel?: () => void;
  onTypeTabChange?: (label: string) => void;
  onSubmit(
    values: TestFormData,
    helpers?: { setError: UseFormReturn<TestFormData>["setError"] }
  ): void | Promise<void>;
}

export default function TestForm({
  defaultValues,
  loading,
  mode = "create",
  onCancel,
  onTypeTabChange,
  onSubmit,
}: Props) {
  const [typeTab, setTypeTab] = useState<TypeTabId>(() =>
    resolveTypeTab(defaultValues?.type)
  );
  const hasInitializedDefaultsRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema) as unknown as Resolver<TestFormData>,
    mode: "onChange",
    defaultValues:
      mode === "create" && !defaultValues ? CREATE_DEFAULT_VALUES : defaultValues,
  });

  const watchedSubject = useWatch({ control, name: "subject" });
  const watchedTopics = useWatch({ control, name: "topics" });
  const difficulty = useWatch({ control, name: "difficulty" });

  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();

  const resolvedSubjectId = useMemo(
    () => resolveSubjectId(watchedSubject, subjects),
    [watchedSubject, subjects]
  );

  const subjectIdForApi = isUuid(resolvedSubjectId) ? resolvedSubjectId : "";

  const { data: topicsData = [], isLoading: topicsLoading } = useTopics(subjectIdForApi);

  const resolvedTopicIds = useMemo(
    () => resolveTopicIds(watchedTopics, topicsData),
    [watchedTopics, topicsData]
  );

  const { data: subTopicsData = [], isLoading: subTopicsLoading } =
    useSubTopics(resolvedTopicIds);

  useEffect(() => {
    hasInitializedDefaultsRef.current = false;
  }, [defaultValues]);

  useEffect(() => {
    if (!defaultValues || !subjects.length) return;
    if (hasInitializedDefaultsRef.current) return;

    const needsTopicData =
      (defaultValues.topics?.length ?? 0) > 0 && topicsData.length === 0;
    const needsSubTopicData =
      (defaultValues.sub_topics?.length ?? 0) > 0 && subTopicsData.length === 0;

    if (needsTopicData || needsSubTopicData) return;

    if (isDirty) {
      hasInitializedDefaultsRef.current = true;
      return;
    }

    const subjectId = resolveSubjectId(defaultValues.subject, subjects);
    const topicIds = resolveTopicIds(defaultValues.topics, topicsData);
    const subTopicIds = resolveSubTopicIds(defaultValues.sub_topics, subTopicsData);

    reset({
      ...defaultValues,
      subject: subjectId,
      topics: topicIds,
      sub_topics: subTopicIds,
    });

    hasInitializedDefaultsRef.current = true;
  }, [defaultValues, subjects, topicsData, subTopicsData, reset, isDirty]);

  const subjectOptions = useMemo(() => mapToOptions(subjects), [subjects]);
  const topicOptions = useMemo(() => mapToOptions(topicsData), [topicsData]);
  const subTopicOptions = useMemo(() => mapToOptions(subTopicsData), [subTopicsData]);

  const handleTypeTabChange = (tabId: string) => {
    const tab = tabId as TypeTabId;
    setTypeTab(tab);

    if (tab === "mock") {
      setValue("type", "mock", { shouldValidate: true });
    } else {
      setValue("type", "chapterwise", { shouldValidate: true });
    }

    onTypeTabChange?.(TYPE_BREADCRUMB_LABELS[tab]);
  };

  const submitLabel =
    mode === "edit"
      ? loading
        ? "Saving..."
        : "Save Changes"
      : loading
        ? "Saving..."
        : "Next";

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, { setError }))}
      className="space-y-6"
    >
      <SegmentedControl
        options={TYPE_TABS.map(({ id, label }) => ({ id, label }))}
        value={typeTab}
        onChange={handleTypeTabChange}
        ariaLabel="Test type"
      />

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <FormSelect<TestFormData>
          label="Subject"
          inputId="subject-select"
          name="subject"
          control={control}
          options={subjectOptions}
          placeholder="Choose from Drop-down"
          isLoading={subjectsLoading}
          error={errors.subject?.message}
          onValueChange={() => {
            setValue("topics", []);
            setValue("sub_topics", []);
          }}
        />

        <Input
          id="test-name-input"
          label="Name of Test"
          type="text"
          placeholder="Enter name of Test"
          containerClassName={formFieldSpacing}
          labelClassName={formLabelClassName}
          className={formInputClassName}
          error={errors.name?.message}
          aria-invalid={!!errors.name}
          {...register("name")}
        />

        <FormSelect<TestFormData>
          label="Topic"
          inputId="topics-select"
          name="topics"
          control={control}
          options={topicOptions}
          placeholder="Choose from Drop-down"
          isMulti
          isDisabled={!subjectIdForApi}
          isLoading={topicsLoading}
          error={errors.topics?.message}
          onValueChange={() => {
            setValue("sub_topics", []);
          }}
        />

        <FormSelect<TestFormData>
          label="Sub Topic"
          inputId="sub-topics-select"
          name="sub_topics"
          control={control}
          options={subTopicOptions}
          placeholder="Choose from Drop-down"
          isMulti
          isDisabled={!watchedTopics || watchedTopics.length === 0}
          isLoading={subTopicsLoading}
          error={errors.sub_topics?.message}
        />

        <Input
          id="total-time-input"
          label="Duration (Minutes)"
          type="number"
          min={1}
          max={180}
          placeholder="Enter duration"
          containerClassName={formFieldSpacing}
          labelClassName={formLabelClassName}
          className={formInputClassName}
          error={errors.total_time?.message}
          aria-invalid={!!errors.total_time}
          {...register("total_time")}
        />

        <div className={clsx('flex flex-col gap-[30px]', formFieldSpacing)}>
          <span className={clsx('mb-0', formLabelClassName)}>Difficulty Level</span>
          <div className="flex h-9 items-center">
            <RadioGroup
              name="difficulty"
              options={DIFFICULTY_RADIO_OPTIONS}
              value={difficulty ?? "easy"}
              onChange={(value) =>
                setValue("difficulty", value as TestFormData["difficulty"], {
                  shouldValidate: true,
                })
              }
              error={errors.difficulty?.message}
              ariaLabel="Difficulty level"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="text-base font-semibold text-foreground">Marking Scheme</h3>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-5">
          <Input
            id="wrong-marks-input"
            label="Wrong Answer"
            type="number"
            min={0}
            max={10}
            step={1}
            placeholder="0"
            containerClassName={formFieldSpacing}
            labelClassName={formLabelClassName}
            className={formInputClassName}
            error={errors.wrong_marks?.message}
            aria-invalid={!!errors.wrong_marks}
            {...register("wrong_marks")}
          />

          <Input
            id="unattempt-marks-input"
            label="Unattempted"
            type="number"
            min={0}
            max={10}
            step={1}
            placeholder="0"
            containerClassName={formFieldSpacing}
            labelClassName={formLabelClassName}
            className={formInputClassName}
            error={errors.unattempt_marks?.message}
            aria-invalid={!!errors.unattempt_marks}
            {...register("unattempt_marks")}
          />

          <Input
            id="correct-marks-input"
            label="Correct Answer"
            type="number"
            min={0}
            max={10}
            step={1}
            placeholder="0"
            containerClassName={formFieldSpacing}
            labelClassName={formLabelClassName}
            className={formInputClassName}
            error={errors.correct_marks?.message}
            aria-invalid={!!errors.correct_marks}
            {...register("correct_marks")}
          />

          <Input
            id="total-questions-input"
            label="No of Questions"
            type="number"
            min={1}
            max={100}
            step={1}
            placeholder="Ex: 50"
            containerClassName={formFieldSpacing}
            labelClassName={formLabelClassName}
            className={formInputClassName}
            error={errors.total_questions?.message}
            aria-invalid={!!errors.total_questions}
            {...register("total_questions")}
          />

          <Input
            id="total-marks-input"
            label="Total Marks"
            type="number"
            min={1}
            max={250}
            step={1}
            placeholder="Ex: 250 Marks"
            containerClassName={formFieldSpacing}
            labelClassName={formLabelClassName}
            className={formInputClassName}
            error={errors.total_marks?.message}
            aria-invalid={!!errors.total_marks}
            {...register("total_marks")}
          />
        </div>
      </div>

      <input type="hidden" {...register("type")} />

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${btnCancel} h-12 min-w-[120px] px-6`}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !isValid}
          className={`${btnPrimary} h-12 min-w-[120px] px-6 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
