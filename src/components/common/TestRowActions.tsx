import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardDocumentCheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import type { Test } from "@/types/test";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useDeleteTest } from "@/hooks/useTests";
import clsx from "clsx";

interface Props {
  test: Test;
}

const iconButtonBase =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export default function TestRowActions({ test }: Props) {
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
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => navigate(`/tests/${test.id}/preview`)}
          className={clsx(iconButtonBase, "bg-primary text-primary-foreground hover:bg-primary/90")}
          aria-label="Preview test"
          title="Preview"
        >
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        </button>

        {isDraft && (
          <button
            type="button"
            onClick={() => navigate(`/tests/${test.id}/edit`)}
            className={clsx(
              iconButtonBase,
              "border border-border bg-card text-foreground hover:bg-muted"
            )}
            aria-label="Edit test"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting}
          className={clsx(
            iconButtonBase,
            "bg-destructive/10 text-destructive hover:bg-destructive/15"
          )}
          aria-label="Delete test"
          title={isDeleting ? "Deleting..." : "Delete"}
        >
          <TrashIcon className="h-4 w-4" aria-hidden="true" />
        </button>

        {isDraft && (
          <button
            type="button"
            onClick={() => navigate(`/tests/${test.id}/questions`)}
            className={clsx(
              iconButtonBase,
              "border border-primary/30 bg-card text-primary hover:bg-primary/10"
            )}
            aria-label="Manage questions"
            title="Manage Questions"
          >
            <ClipboardDocumentCheckIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
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
