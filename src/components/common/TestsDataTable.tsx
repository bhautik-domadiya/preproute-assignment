import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Test } from "@/types/test";
import Badge, { type TestStatus } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Pagination from "@/components/common/Pagination";
import TestRowActions from "@/components/common/TestRowActions";
import { formatTopics } from "@/utils/format";

const DEFAULT_PAGE_SIZE = 10;

interface TestsDataTableProps {
  data: Test[];
  resetPageKey?: string;
}

export default function TestsDataTable({ data, resetPageKey }: TestsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Test>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Test Name",
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        id: "topics",
        accessorFn: (row) => formatTopics(row.topics),
        header: "Topic",
        cell: ({ getValue }) => (
          <span className="max-w-[200px] truncate">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        sortingFn: (rowA, rowB) =>
          new Date(rowA.original.created_at).getTime() -
          new Date(rowB.original.created_at).getTime(),
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          if (!status) {
            return <span className="text-muted-foreground/60">—</span>;
          }
          return <Badge status={status as TestStatus} />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => <TestRowActions test={row.original} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  });

  useEffect(() => {
    table.setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset pagination when filters change
  }, [resetPageKey]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-foreground"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ArrowUpIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : sorted === "desc" ? (
                            <ArrowDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowsUpDownIcon
                              className="h-3.5 w-3.5 text-muted-foreground/60"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={clsx("hover:bg-muted")}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-4 py-3 text-sm text-foreground"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination table={table} />
    </Card>
  );
}
