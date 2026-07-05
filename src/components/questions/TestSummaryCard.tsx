import Card from "@/components/ui/Card";
import type { TestDetail } from "@/types/test";
import { formatDifficulty, formatTestType } from "@/utils/format";
import {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface TestSummaryCardProps {
  test: TestDetail;
  testId: string;
  questionCount: number;
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-md border border-warning/50 px-2.5 py-0.5 text-sm text-warning">
      {children}
    </span>
  );
}

export default function TestSummaryCard({
  test,
  testId,
  questionCount,
}: TestSummaryCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="mb-6 rounded-xl border-border p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          <span className="rounded-lg bg-secondary px-4 py-1 text-sm text-secondary-foreground">
            {formatTestType(test.type)}
          </span>
          <div className="flex flex-wrap items-center gap-2 pt-5">
            <h1 className="font-bold text-foreground">
              {test.name}
            </h1>
            <span className="rounded-md bg-chart-3 px-4 py-1 text-sm text-primary-foreground">
              {formatDifficulty(test.difficulty)}
            </span>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Subject:</p>
              <p className="font-medium text-muted-foreground">{test.subject}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Topic:</p>
              <div className="flex flex-wrap gap-1.5">
                {(test.topics?.length ?? 0) > 0 ? (
                  test.topics.map((topic) => <Pill key={topic}>{topic}</Pill>)
                ) : (
                  <span className="text-muted-foreground/60">—</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Sub Topic:</p>
              <div className="flex flex-wrap gap-1.5">
                {(test.sub_topics?.length ?? 0) > 0 ? (
                  test.sub_topics.map((st) => <Pill key={st}>{st}</Pill>)
                ) : (
                  <span className="text-muted-foreground/60">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[stretch] flex-col items-end justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(`/tests/${testId}/edit`)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-primary transition-colors hover:bg-primary/10"
              aria-label="Edit test configuration"
            >
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-end rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 px-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
              {test.total_time} Min
            </span>
            <span
              className="hidden h-4 w-px bg-border sm:block"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 px-2">
              <DocumentTextIcon className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
              {questionCount} Q&apos;s
            </span>
            <span
              className="hidden h-4 w-px bg-border sm:block"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 px-2">
              <ChartBarIcon className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
              {test.total_marks} Marks
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
