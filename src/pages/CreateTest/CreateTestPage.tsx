import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import type { UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

import TestForm from "@/components/forms/TestForm";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import { useCreateTest } from "@/hooks/useCreateTest";
import type { TestFormData } from "@/features/tests/test.schema";

const DUPLICATE_TEST_NAME_MESSAGE =
  "A test with this name already exists for the selected subject. Please choose a different name.";

function isDuplicateTestNameError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;

  const data = error.response?.data as
    | {
        message?: string;
        errors?: Array<{ path?: string; msg?: string }>;
      }
    | undefined;

  if (data?.message !== "Validation failed" || !Array.isArray(data.errors)) {
    return false;
  }

  return data.errors.some(
    (entry) =>
      entry.path === "subject" &&
      entry.msg === "A test with this name already exists for this subject"
  );
}

export default function CreateTestPage() {
  const navigate = useNavigate();
  const mutation = useCreateTest();
  const [typeBreadcrumb, setTypeBreadcrumb] = useState("Chapter Wise");

  async function handleSubmit(
    values: TestFormData,
    helpers?: { setError: UseFormSetError<TestFormData> }
  ) {
    try {
      const test = await mutation.mutateAsync({
        ...values,
        status: "draft",
      });

      toast.success("Test saved as draft");
      navigate(`/tests/${test.id}/questions`);
    } catch (error) {
      if (isDuplicateTestNameError(error)) {
        helpers?.setError("name", {
          type: "server",
          message: DUPLICATE_TEST_NAME_MESSAGE,
        });
        return;
      }

      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to create test")
          : "Failed to create test"
      );
    }
  }

  return (
    <PageContainer>
      <PageBreadcrumb
        steps={[
          { label: "Test Creation" },
          { label: "Create Test" },
          { label: typeBreadcrumb },
        ]}
        current={2}
      />

      <Card className="p-6 sm:p-8">
        <TestForm
          mode="create"
          loading={mutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard")}
          onTypeTabChange={setTypeBreadcrumb}
        />
      </Card>
    </PageContainer>
  );
}
