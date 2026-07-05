import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { useTest, useUpdateTest } from "@/hooks/useTests";
import { useTopics } from "@/hooks/useTopics";
import { useSubTopics } from "@/hooks/useSubTopics";
import { useQuestions, useBulkSubmitQuestions } from "@/hooks/useQuestions";
import Loader from "@/components/common/Loader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import TestSummaryCard from "@/components/questions/TestSummaryCard";
import QuestionSidebar from "@/components/questions/QuestionSidebar";
import QuestionEditorForm from "@/components/questions/QuestionEditorForm";
import FooterActions from "@/components/questions/FooterActions";
import type { BulkQuestionCreatePayload, Question } from "@/types/question";
import type { TestDetail } from "@/types/test";
import { useSubjects } from "@/hooks/useSubjects";
import { resolveSubTopicId, resolveTopicId } from "@/utils/masterData";
import { formatTestType } from "@/utils/format";
import { getPlainTextFromMarkdown } from "@/utils/richTextEditor";

const EMPTY_QUESTION_IDS: string[] = [];

const questionFormSchema = z.object({
  question: z.string().refine(
    (val) => getPlainTextFromMarkdown(val).trim().length >= 5,
    "Question text must be at least 5 characters"
  ),
  option1: z.string().min(1, "Option A is required"),
  option2: z.string().min(1, "Option B is required"),
  option3: z.string().min(1, "Option C is required"),
  option4: z.string().min(1, "Option D is required"),
  correct_option: z.enum(["option1", "option2", "option3", "option4"], {
    message: "Please select the correct option",
  }),
  explanation: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  topic_id: z.string().optional(),
  sub_topic_id: z.string().optional(),
  media_url: z
    .string()
    .optional()
    .refine(
      (val) => !val?.trim() || z.string().url().safeParse(val.trim()).success,
      "Please enter a valid URL"
    ),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

const defaultFormValues: QuestionFormValues = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "option1",
  explanation: "",
  difficulty: "easy",
  topic_id: "",
  sub_topic_id: "",
  media_url: "",
};

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: test, isLoading: testLoading } = useTest(id || "");
  const questionIds = test?.questions ?? EMPTY_QUESTION_IDS;
  const { data: existingQuestions = [], isLoading: questionsLoading } =
    useQuestions(questionIds);
  const bulkSubmitMutation = useBulkSubmitQuestions();
  const updateTestMutation = useUpdateTest();

  const [localQuestions, setLocalQuestions] = useState<Question[] | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [prevTestId, setPrevTestId] = useState(id);
  const [subTopicRestoreName, setSubTopicRestoreName] = useState<string | null>(
    null
  );
  const [manualLeavePrompt, setManualLeavePrompt] = useState(false);
  const pendingNavigateRef = useRef<(() => void) | null>(null);
  const prevTopicRef = useRef<string>("");
  const hasAutoInitializedRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: defaultFormValues,
  });

  const selectedTopic = useWatch({ control, name: "topic_id" });
  const difficulty = useWatch({ control, name: "difficulty" });
  const { data: subjects = [] } = useSubjects();

  const subjectId = useMemo(() => {
    if (!test) return "";
    return (
      subjects.find((s) => s.name === test.subject)?.id ?? test.subject
    );
  }, [subjects, test]);

  const { data: topics = [] } = useTopics(subjectId);
  const { data: formSubTopics = [] } = useSubTopics(
    selectedTopic ? [selectedTopic] : []
  );

  const isPersisting =
    bulkSubmitMutation.isPending || updateTestMutation.isPending;

  const hasUnsavedChanges = isDirty || localQuestions !== null;

  if (id !== prevTestId) {
    setPrevTestId(id);
    setLocalQuestions(null);
    setEditingIndex(null);
    setSubTopicRestoreName(null);
  }

  const questionsList = localQuestions ?? existingQuestions;

  useEffect(() => {
    hasAutoInitializedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    queryClient.invalidateQueries({ queryKey: ["test", id] });
    queryClient.invalidateQueries({ queryKey: ["questions"] });
  }, [id, queryClient]);

  useEffect(() => {
    if (prevTopicRef.current && prevTopicRef.current !== selectedTopic) {
      setValue("sub_topic_id", "");
    }
    prevTopicRef.current = selectedTopic ?? "";
  }, [selectedTopic, setValue]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!subTopicRestoreName || !formSubTopics.length) return;

    const subTopicId = resolveSubTopicId(subTopicRestoreName, formSubTopics);
    if (subTopicId) {
      setValue("sub_topic_id", subTopicId);
    }
  }, [subTopicRestoreName, formSubTopics, setValue]);

  const buildBulkCreatePayload = useCallback(
    (q: Question): BulkQuestionCreatePayload => {
      const payloadTopic =
        topics.find((t) => t.id === q.topic || t.name === q.topic)?.name ??
        q.topic ??
        "";

      return {
        test_id: q.test_id || id || "",
        subject: q.subject || subjectId,
        type: "mcq",
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correct_option: q.correct_option,
        explanation: q.explanation ?? "",
        difficulty: q.difficulty,
        topic: payloadTopic,
        sub_topic: q.sub_topic ?? "",
        paragraph: q.paragraph ?? "",
        media_url: q.media_url ?? "",
        category: q.category ?? "",
      };
    },
    [id, subjectId, topics]
  );

  const persistQuestions = useCallback(
    async (
      questions: Question[],
      options?: { navigateToPreview?: boolean }
    ): Promise<Question[] | undefined> => {
      if (!id || !test) return undefined;

      if (questions.length === 0) {
        toast.error("Please add at least one question to the test");
        return undefined;
      }

      const newQuestions = questions.filter((q) => !q.id);
      let savedNew: Question[] = [];

      if (newQuestions.length > 0) {
        savedNew = await bulkSubmitMutation.mutateAsync({
          testId: id,
          questions: newQuestions.map(buildBulkCreatePayload),
        });
      }

      let newIndex = 0;
      const savedQuestionIds = questions
        .map((q) => {
          if (q.id) return q.id;
          const saved = savedNew[newIndex++];
          return saved?.id;
        })
        .filter((qid): qid is string => Boolean(qid));

      newIndex = 0;
      const mergedQuestions = questions.map((q) => {
        if (q.id) return q;
        const saved = savedNew[newIndex++];
        return saved ?? q;
      });

      await updateTestMutation.mutateAsync({
        id,
        payload: {
          questions: savedQuestionIds,
          total_questions: savedQuestionIds.length,
        },
      });

      queryClient.setQueryData(["test", id], (old) =>
        old
          ? {
              ...old,
              questions: savedQuestionIds,
              total_questions: savedQuestionIds.length,
            }
          : old
      );
      queryClient.setQueryData(["questions", savedQuestionIds], mergedQuestions);

      setLocalQuestions(null);

      if (options?.navigateToPreview) {
        toast.success("Questions saved and linked successfully!");
        navigate(`/tests/${id}/preview`);
      }

      return mergedQuestions;
    },
    [
      id,
      test,
      bulkSubmitMutation,
      buildBulkCreatePayload,
      updateTestMutation,
      navigate,
      queryClient,
    ]
  );

  const populateFormFromQuestion = useCallback(
    (q: Question, index: number) => {
      const topicId = resolveTopicId(q.topic, topics);

      setEditingIndex(index);
      reset({
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correct_option: q.correct_option,
        explanation: q.explanation || "",
        difficulty: q.difficulty,
        topic_id: topicId,
        sub_topic_id: "",
        media_url: q.media_url || "",
      });

      if (q.sub_topic && topicId) {
        setSubTopicRestoreName(q.sub_topic);
      } else {
        setSubTopicRestoreName(null);
      }
    },
    [reset, topics]
  );

  useEffect(() => {
    if (
      hasAutoInitializedRef.current ||
      localQuestions !== null ||
      existingQuestions.length === 0 ||
      editingIndex !== null ||
      isDirty
    ) {
      return;
    }

    hasAutoInitializedRef.current = true;
    populateFormFromQuestion(existingQuestions[0], 0);
  }, [
    existingQuestions,
    localQuestions,
    editingIndex,
    isDirty,
    populateFormFromQuestion,
  ]);

  const confirmLeave = () => {
    setManualLeavePrompt(false);
    setLocalQuestions(null);
    pendingNavigateRef.current?.();
    pendingNavigateRef.current = null;
  };

  const cancelLeave = () => {
    setManualLeavePrompt(false);
    pendingNavigateRef.current = null;
  };

  const requestLeave = (action: () => void) => {
    if (!hasUnsavedChanges) {
      action();
      return;
    }
    pendingNavigateRef.current = action;
    setManualLeavePrompt(true);
  };

  const handleAddNew = () => {
    const limit = test?.total_questions ?? questionsList.length;
    if (questionsList.length >= limit) return;

    const hasUnsubmittedChanges = isDirty || editingIndex !== null;

    if (hasUnsubmittedChanges) {
      toast.error("Please submit the current question before adding another one.");
      return;
    }

    setEditingIndex(null);
    setSubTopicRestoreName(null);
    reset(defaultFormValues);
    prevTopicRef.current = "";
  };

  const handleAddOrUpdate = async (values: QuestionFormValues) => {
    const currentList = localQuestions ?? existingQuestions;
    const wasEditing = editingIndex !== null;

    const payloadTopic = values.topic_id
      ? (topics.find((t) => t.id === values.topic_id)?.name ?? "")
      : "";
    const payloadSubTopic = values.sub_topic_id
      ? (formSubTopics.find((st) => st.id === values.sub_topic_id)?.name ?? "")
      : "";

    const newQuestion: Question = {
      test_id: id || "",
      subject: subjectId,
      type: "mcq",
      question: values.question,
      option1: values.option1,
      option2: values.option2,
      option3: values.option3,
      option4: values.option4,
      correct_option: values.correct_option,
      explanation: values.explanation || "",
      difficulty: values.difficulty ?? "easy",
      topic: payloadTopic,
      sub_topic: payloadSubTopic,
      paragraph: "",
      media_url: values.media_url || "",
      category: "",
    };

    let updatedList: Question[];

    if (wasEditing && editingIndex !== null) {
      updatedList = [...currentList];
      updatedList[editingIndex] = { ...newQuestion, id: undefined };
    } else {
      updatedList = [...currentList, newQuestion];
    }

    try {
      const limit = test?.total_questions ?? updatedList.length;
      const savedIndex =
        wasEditing && editingIndex !== null
          ? editingIndex
          : updatedList.length - 1;
      const merged = await persistQuestions(updatedList);

      if (merged && merged.length >= limit) {
        populateFormFromQuestion(merged[savedIndex], savedIndex);
      } else {
        setEditingIndex(null);
        setSubTopicRestoreName(null);
        reset(defaultFormValues);
        prevTopicRef.current = "";
      }

      toast.success(
        wasEditing ? "Question updated successfully" : "Question saved successfully"
      );
    } catch {
      toast.error("Failed to save question");
    }
  };

  const handleEditLocal = (index: number) => {
    populateFormFromQuestion(questionsList[index], index);
  };

  const handleDeleteLocal = (index: number) => {
    const currentList = localQuestions ?? existingQuestions;

    if (editingIndex === index) {
      setEditingIndex(null);
      reset(defaultFormValues);
    }
    setLocalQuestions(currentList.filter((_, i) => i !== index));
    toast.success("Question removed");
  };

  const handleBulkSubmit = async () => {
    try {
      await persistQuestions(questionsList, { navigateToPreview: true });
    } catch {
      toast.error("Failed to save questions");
    }
  };

  const onQuestionFormSubmit = handleSubmit(handleAddOrUpdate); // eslint-disable-line react-hooks/refs -- RHF handleSubmit uses internal refs

  const totalQuestionSlots = test?.total_questions ?? questionsList.length;
  const isAtQuestionLimit = questionsList.length >= totalQuestionSlots;
  const currentQuestionNumber =
    editingIndex !== null
      ? editingIndex + 1
      : isAtQuestionLimit
        ? questionsList.length
        : questionsList.length + 1;
  const displayTotal = Math.max(totalQuestionSlots, questionsList.length, 1);

  const isInitialLoading =
    (testLoading && !test) ||
    (questionIds.length > 0 &&
      questionsLoading &&
      existingQuestions.length === 0 &&
      !localQuestions);

  if (isInitialLoading) {
    return <Loader message="Loading questions..." />;
  }

  if (!test) {
    return (
      <PageContainer>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error</h3>
          <p className="mt-2 text-muted-foreground">Test details could not be found.</p>
        </Card>
      </PageContainer>
    );
  }

  const testDetail = test as TestDetail;

  return (
    <PageContainer>
      <PageBreadcrumb
        steps={[
          { label: "Test Creation" },
          { label: "Create Test" },
          { label: formatTestType(test.type) },
        ]}
        current={2}
      />

      {hasUnsavedChanges && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
          <strong>Unsaved changes.</strong> Save the current question or discard
          your edits before leaving this page.
        </div>
      )}

      <TestSummaryCard
        test={testDetail}
        testId={id || ""}
        questionCount={questionsList.length}
      />

      {questionsList.length === 0 && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          At least one question is required before continuing.
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <QuestionSidebar
          questions={questionsList}
          totalQuestions={totalQuestionSlots}
          activeIndex={editingIndex}
          onSelect={handleEditLocal}
          onAddNew={handleAddNew}
          addDisabled={isAtQuestionLimit}
        />

        <Card className="min-w-0 flex-1 p-5 sm:p-6">
          <form onSubmit={onQuestionFormSubmit}>
            <QuestionEditorForm
              register={register}
              control={control}
              errors={errors}
              topics={topics}
              subTopics={formSubTopics}
              selectedTopic={selectedTopic}
              difficulty={difficulty}
              onDifficultyChange={(value) =>
                setValue("difficulty", value as QuestionFormValues["difficulty"], {
                  shouldValidate: true,
                })
              }
              onClearOption={(field) => setValue(field, "")}
              currentNumber={currentQuestionNumber}
              totalNumber={displayTotal}
              isEditing={editingIndex !== null}
              isSubmitting={isPersisting}
              onDeleteQuestion={
                editingIndex !== null
                  ? () => handleDeleteLocal(editingIndex)
                  : undefined
              }
              submitLabel={
                editingIndex !== null ? "Update Question" : "Save Question"
              }
            />
          </form>
        </Card>
      </div>

      <FooterActions
        onExit={() => requestLeave(() => navigate("/dashboard"))}
        onNext={handleBulkSubmit}
        nextDisabled={questionsList.length === 0}
        nextLoading={isPersisting}
      />

      <ConfirmDialog
        open={manualLeavePrompt}
        title="Leave without saving?"
        message="You have unsaved question changes. If you leave now, your updates will be lost."
        confirmLabel="Leave Without Saving"
        cancelLabel="Stay on Page"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </PageContainer>
  );
}
