import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckIcon } from "@heroicons/react/24/outline";

import { useTest, useUpdateTest } from "@/hooks/useTests";
import { useQuestions } from "@/hooks/useQuestions";

import Loader from "@/components/common/Loader";
import Card from "@/components/ui/Card";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import PageContainer from "@/components/layout/PageContainer";
import TestSummaryCard from "@/components/questions/TestSummaryCard";
import QuestionSidebar from "@/components/questions/QuestionSidebar";
import PublishOptions, {
  type PublishMode,
} from "@/components/preview/PublishOptions";
import LiveUntilSection, {
  type LiveUntilOption,
} from "@/components/preview/LiveUntilSection";
import PreviewFooterActions from "@/components/preview/PreviewFooterActions";
import { formatTestType } from "@/utils/format";
import { btnPrimary } from "@/components/ui/buttonStyles";
import type { TestDetail } from "@/types/test";

const EMPTY_QUESTION_IDS: string[] = [];

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [publishMode, setPublishMode] = useState<PublishMode>("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [liveUntil, setLiveUntil] = useState<LiveUntilOption>("always");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const { data: test, isLoading: testLoading } = useTest(id || "");
  const questionIds = test?.questions ?? EMPTY_QUESTION_IDS;
  const { data: questions = [], isLoading: questionsLoading } =
    useQuestions(questionIds);
  const updateMutation = useUpdateTest();

  useEffect(() => {
    if (!publishedSuccess) return;

    const timer = window.setTimeout(() => {
      navigate("/dashboard");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [publishedSuccess, navigate]);

  const handlePublish = async () => {
    if (!id || !test) return;
    if (questions.length === 0) {
      toast.error(
        "You cannot publish a test with no questions. Please add questions first."
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        payload: {
          status: "live",
        },
      });

      setPublishedSuccess(true);
    } catch {
      toast.error("Failed to publish the test");
    }
  };

  if (testLoading || questionsLoading) {
    return <Loader message="Loading preview..." />;
  }

  if (!test) {
    return (
      <PageContainer>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error</h3>
          <p className="mt-2 text-muted-foreground">Test not found.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className={`${btnPrimary} mt-4`}
          >
            Back to Dashboard
          </button>
        </Card>
      </PageContainer>
    );
  }

  if (publishedSuccess) {
    return (
      <PageContainer width="narrow">
        <Card className="py-10 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success">
            <svg
              className="h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-foreground">Test is Live!</h1>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            &ldquo;{test.name}&rdquo; has been published successfully.
          </p>
          <p className="text-sm text-muted-foreground/60">Redirecting to dashboard...</p>
          <button
            onClick={() => navigate("/dashboard")}
            className={`${btnPrimary} mt-6 w-full py-3`}
          >
            Return to Dashboard
          </button>
        </Card>
      </PageContainer>
    );
  }

  const testDetail = test as TestDetail;
  const totalQuestionSlots = test.total_questions ?? questions.length;
  const questionCount = questions.length;
  const canPublish = test.status === "draft";
  const sidebarActiveIndex =
    questions.length === 0
      ? 0
      : Math.min(activeQuestionIndex, questions.length - 1);

  return (
    <PageContainer className="space-y-6">
      <PageBreadcrumb
        steps={[
          { label: "Test Creation" },
          { label: "Create Test" },
          { label: formatTestType(test.type) },
        ]}
        current={2}
      />

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-foreground">Test Created</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-sm font-medium text-success">
          <CheckIcon className="h-4 w-4" aria-hidden="true" />
          All {questionCount} Questions Done
        </span>
      </div>

      <TestSummaryCard
        test={testDetail}
        testId={id || ""}
        questionCount={questionCount}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <QuestionSidebar
          questions={questions}
          totalQuestions={totalQuestionSlots}
          activeIndex={sidebarActiveIndex}
          onSelect={setActiveQuestionIndex}
          readOnly
        />

        <Card
          className="min-w-0 flex-1 rounded-xl border-border p-5 shadow-sm sm:p-6"
          padding={false}
        >
          <div className="space-y-6">
            <PublishOptions
              mode={publishMode}
              onModeChange={setPublishMode}
              scheduleDate={scheduleDate}
              scheduleTime={scheduleTime}
              onScheduleDateChange={setScheduleDate}
              onScheduleTimeChange={setScheduleTime}
            />

            <LiveUntilSection
              value={liveUntil}
              onChange={setLiveUntil}
              endDate={endDate}
              endTime={endTime}
              onEndDateChange={setEndDate}
              onEndTimeChange={setEndTime}
            />

            <PreviewFooterActions
              onCancel={() => navigate("/dashboard")}
              onConfirm={handlePublish}
              confirmDisabled={!canPublish}
              confirmLoading={updateMutation.isPending}
            />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
