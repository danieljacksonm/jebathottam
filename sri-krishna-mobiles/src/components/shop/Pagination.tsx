"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the edges
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] transition-colors",
          currentPage === 1
            ? "cursor-not-allowed bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
            : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={cn(
              "h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-[var(--primary)] text-white"
                : page === "..."
                ? "cursor-default text-[var(--foreground-muted)]"
                : "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] transition-colors",
          currentPage === totalPages
            ? "cursor-not-allowed bg-[var(--background-secondary)] text-[var(--foreground-muted)]"
            : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
