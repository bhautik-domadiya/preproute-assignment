import { btnDanger } from "@/components/ui/buttonStyles";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  onRetry,
  retryLabel = "Try Again",
}: Props) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center">
      <h3 className="text-lg font-semibold text-destructive">{title}</h3>
      <p className="mt-2 text-sm text-destructive/80">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`${btnDanger} mt-5 px-5 py-2.5 text-sm`}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
