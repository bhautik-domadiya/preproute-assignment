import { btnDanger, btnPrimary } from "@/components/ui/buttonStyles";

interface FooterActionsProps {
  onExit: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextLoading: boolean;
}

export default function FooterActions({
  onExit,
  onNext,
  nextDisabled,
  nextLoading,
}: FooterActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
      <button type="button" onClick={onExit} className={btnDanger}>
        Exit Test Creation
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        className={`${btnPrimary} min-w-[160px] disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {nextLoading ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  );
}
