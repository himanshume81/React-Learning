import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { memo } from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Memoized: page/totalPages only change once the debounced search/filter
// fetch resolves, so this should bail out while the parent re-renders on
// every keystroke of the (unrelated) search input.
export const Pagination = memo(function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <Text className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {page} of {totalPages}
      </Text>
      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
});
