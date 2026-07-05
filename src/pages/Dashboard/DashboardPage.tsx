import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import type { SingleValue } from "react-select";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TestsDataTable from "@/components/common/TestsDataTable";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { figmaSelectStyles } from "@/components/ui/reactSelectStyles";
import { useTests } from "@/hooks/useTests";
import { useSubjects } from "@/hooks/useSubjects";
import { btnPrimary } from "@/components/ui/buttonStyles";

interface FilterOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: "draft", label: "Draft" },
  { value: "live", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "unpublished", label: "Unpublished" },
];

const TYPE_OPTIONS: FilterOption[] = [
  { value: "chapterwise", label: "Chapter Wise" },
  { value: "pyq", label: "Practice Test" },
  { value: "mock", label: "Mock Test" },
];

const menuPortalTarget =
  typeof document !== "undefined" ? document.body : null;

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data = [], isLoading, isError, refetch, isFetching } = useTests();
  const { data: subjects = [] } = useSubjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const subjectOptions = useMemo<FilterOption[]>(
    () => subjects.map((sub) => ({ value: sub.name, label: sub.name })),
    [subjects]
  );

  const filteredTests = useMemo(() => {
    return data.filter((test) => {
      const matchesSearch = test.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSubject = !selectedSubject || test.subject === selectedSubject;
      const matchesStatus = !selectedStatus || test.status === selectedStatus;
      const matchesType = !selectedType || test.type === selectedType;

      return matchesSearch && matchesSubject && matchesStatus && matchesType;
    });
  }, [data, searchTerm, selectedSubject, selectedStatus, selectedType]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedStatus("");
    setSelectedType("");
  };

  if (isLoading) {
    return (
      <PageContainer className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader message="Loading your tests..." />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load tests"
        message="There was a problem fetching your test list. Check your connection and try again."
        onRetry={() => refetch()}
        retryLabel={isFetching ? "Retrying..." : "Try Again"}
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Tests Dashboard"
        subtitle="Manage and publish your examinations"
        actions={
          <button
            type="button"
            onClick={() => navigate("/tests/new")}
            className={`${btnPrimary} px-6 py-3`}
          >
            Create New Test
          </button>
        }
      />

      <Card className="mb-6" padding>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-input px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex md:gap-3">
            <div>
              <Select<FilterOption, false>
                inputId="dashboard-subject-filter"
                options={subjectOptions}
                value={
                  subjectOptions.find(
                    (option) => option.value === selectedSubject
                  ) ?? null
                }
                onChange={(option: SingleValue<FilterOption>) =>
                  setSelectedSubject(option?.value ?? "")
                }
                placeholder="All Subjects"
                isClearable
                styles={figmaSelectStyles}
                menuPortalTarget={menuPortalTarget}
              />
            </div>

            <div>
              <Select<FilterOption, false>
                inputId="dashboard-status-filter"
                options={STATUS_OPTIONS}
                value={
                  STATUS_OPTIONS.find(
                    (option) => option.value === selectedStatus
                  ) ?? null
                }
                onChange={(option: SingleValue<FilterOption>) =>
                  setSelectedStatus(option?.value ?? "")
                }
                placeholder="All Statuses"
                isClearable
                styles={figmaSelectStyles}
                menuPortalTarget={menuPortalTarget}
              />
            </div>

            <div>
              <Select<FilterOption, false>
                inputId="dashboard-type-filter"
                options={TYPE_OPTIONS}
                value={
                  TYPE_OPTIONS.find((option) => option.value === selectedType) ??
                  null
                }
                onChange={(option: SingleValue<FilterOption>) =>
                  setSelectedType(option?.value ?? "")
                }
                placeholder="All Types"
                isClearable
                styles={figmaSelectStyles}
                menuPortalTarget={menuPortalTarget}
              />
            </div>
          </div>

          {(searchTerm || selectedSubject || selectedStatus || selectedType) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="cursor-pointer whitespace-nowrap text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {filteredTests.length === 0 ? (
        <EmptyState
          title={
            data.length === 0 ? "No tests yet" : "No tests match your filters"
          }
          description={
            data.length === 0
              ? "Create your first test to start adding questions and publishing."
              : "Try adjusting your search or filter criteria."
          }
          actionLabel={data.length === 0 ? "Create New Test" : undefined}
          onAction={data.length === 0 ? () => navigate("/tests/new") : undefined}
        />
      ) : (
        <TestsDataTable
          data={filteredTests}
          resetPageKey={`${searchTerm}-${selectedSubject}-${selectedStatus}-${selectedType}`}
        />
      )}
    </PageContainer>
  );
}
