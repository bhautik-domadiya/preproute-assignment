import clsx from "clsx";
import type { Table } from "@tanstack/react-table";
import { btnSecondary } from "@/components/ui/buttonStyles";

interface PaginationProps<T> {
  table: Table<T>;
}

export default function Pagination<T>({ table }: PaginationProps<T>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;

  if (totalRows === 0) return null;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const windowSize = 2;
    const startPage = Math.max(0, pageIndex - windowSize);
    const endPage = Math.min(pageCount - 1, pageIndex + windowSize);

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {totalRows} tests
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`${btnSecondary} px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => table.setPageIndex(page)}
            className={clsx(
              "min-w-9 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              page === pageIndex
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            )}
            aria-current={page === pageIndex ? "page" : undefined}
          >
            {page + 1}
          </button>
        ))}

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`${btnSecondary} px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
