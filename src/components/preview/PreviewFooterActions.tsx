import { btnCancel, btnPrimary } from "@/components/ui/buttonStyles";

interface PreviewFooterActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
}

export default function PreviewFooterActions({
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmLoading = false,
}: PreviewFooterActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
      <button
        type="button"
        onClick={onCancel}
        className={`${btnCancel} h-12 min-w-[120px] px-6`}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled || confirmLoading}
        className={`${btnPrimary} h-12 min-w-[120px] px-6 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {confirmLoading ? "Publishing..." : "Confirm"}
      </button>
    </div>
  );
}
