import { Select } from "@/components/atoms/Select";
import { Text } from "@/components/atoms/Text";
import { memo } from "react";

export type PageSize = number | "all";

export const PAGE_SIZE_OPTIONS: { label: string; value: PageSize }[] = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "All", value: "all" },
];

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: PageSize;
  onPageSizeChange: (pageSize: PageSize) => void;
  rangeStart: number;
  rangeEnd: number;
  total: number;
};

const arrowButtonClassName =
  "flex h-8 w-8 items-center justify-center rounded-md text-lg leading-none text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:disabled:text-zinc-700";

// Memoized: page/totalPages/pageSize/range only change once the debounced
// search/filter fetch resolves, so this should bail out while the parent
// re-renders on every keystroke of the (unrelated) search input.
export const Pagination = memo(function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  rangeStart,
  rangeEnd,
  total,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 rounded-xl border border-zinc-200 px-4 py-3 sm:gap-6 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <Text className="text-sm text-zinc-600 dark:text-zinc-400">
          Items per page:
        </Text>
        <div className="w-20">
          <Select
            value={String(pageSize)}
            onChange={(event) =>
              onPageSizeChange(
                event.target.value === "all" ? "all" : Number(event.target.value)
              )
            }
            aria-label="Items per page"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Text className="whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
        {total === 0 ? 0 : rangeStart}–{rangeEnd} of {total}
      </Text>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={arrowButtonClassName}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={arrowButtonClassName}
        >
          ›
        </button>
      </div>
    </div>
  );
});
