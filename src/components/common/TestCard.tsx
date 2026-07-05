import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Test } from "@/types/test";
import Badge, { type TestStatus } from "../ui/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useDeleteTest } from "@/hooks/useTests";
import { formatTestType } from "@/utils/format";
import toast from "react-hot-toast";
import { btnPrimary, btnSecondary, btnDanger } from "@/components/ui/buttonStyles";

interface Props {
  test: Test;
}

export default function TestCard({ test }: Props) {
  const navigate = useNavigate();
  const { mutateAsync: deleteTest, isPending: isDeleting } = useDeleteTest();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isDraft = test.status === "draft";

  const handleDelete = async () => {
    try {
      await deleteTest(test.id);
      toast.success("Test deleted successfully");
      setShowDeleteConfirm(false);
    } catch {
      toast.error("Failed to delete test");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
        <div>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-lg font-semibold text-foreground">
              {test.name}
            </h2>
            <Badge status={test.status as TestStatus} />
          </div>

          <p className="text-sm font-medium text-muted-foreground">{test.subject}</p>

          {test.type && (
            <p className="mt-1 text-xs text-muted-foreground">{formatTestType(test.type)}</p>
          )}

          <p className="mt-3 text-xs text-muted-foreground/60">
            Created{" "}
            {new Date(test.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate(`/tests/${test.id}/preview`)}
            className={`${btnPrimary} w-full py-2`}
          >
            Preview
          </button>

          <div className="flex gap-2">
            {isDraft && (
              <button
                type="button"
                onClick={() => navigate(`/tests/${test.id}/edit`)}
                className={`${btnSecondary} flex-1 py-2`}
              >
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className={`${btnDanger} ${isDraft ? "flex-1" : "w-full"} py-2`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          {isDraft && (
            <button
              type="button"
              onClick={() => navigate(`/tests/${test.id}/questions`)}
              className={`${btnSecondary} w-full border-primary/30 py-2 text-primary hover:bg-primary/10`}
            >
              Manage Questions
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete test?"
        message={`Are you sure you want to delete "${test.name}"? This action cannot be undone.`}
        confirmLabel="Delete Test"
        cancelLabel="Keep Test"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
