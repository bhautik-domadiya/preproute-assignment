interface Props {
  message?: string;
}

export default function Loader({ message = "Loading..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
