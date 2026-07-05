import { useParams, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import TestForm from "@/components/forms/TestForm";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import { useTest, useUpdateTest } from "@/hooks/useTests";
import toast from "react-hot-toast";
import type { TestFormData } from "@/features/tests/test.schema";
import { formatTestType } from "@/utils/format";
import { useMemo } from "react";

export default function EditTestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useTest(id || "");
  const updateMutation = useUpdateTest();

  const handleUpdate = async (values: TestFormData) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({
        id,
        payload: {
          ...values,
          total_questions: data?.total_questions,
        },
      });
      toast.success("Test updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to update test")
          : "Failed to update test"
      );
    }
  };

  const formValues: TestFormData | undefined = useMemo(() => {
    if (!data) return undefined;

    return {
      name: data.name,
      type: data.type,
      subject: data.subject,
      topics: data.topics ?? [],
      sub_topics: data.sub_topics ?? [],
      difficulty: data.difficulty,
      correct_marks: data.correct_marks,
      wrong_marks: data.wrong_marks,
      unattempt_marks: data.unattempt_marks,
      total_time: data.total_time,
      total_marks: data.total_marks,
      total_questions: data.total_questions,
    };
  }, [data]);

  if (isLoading) return <Loader message="Loading test details..." />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load test"
        message="This test may have been deleted or is temporarily unavailable."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <PageContainer>
      <PageBreadcrumb
        steps={[
          { label: "Test Creation" },
          { label: "Create Test" },
          { label: formatTestType(data.type) },
        ]}
        current={2}
      />

      <Card className="p-6 sm:p-8">
        <TestForm
          mode="edit"
          defaultValues={formValues}
          loading={updateMutation.isPending}
          onSubmit={handleUpdate}
          onCancel={() => navigate("/dashboard")}
        />
      </Card>
    </PageContainer>
  );
}
