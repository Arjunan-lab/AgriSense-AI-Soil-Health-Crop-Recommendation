import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const pageRange = [];
  const maxButtons = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card px-6 py-4 shadow-soft">
      {/* Items per Page Select */}
      <div className="flex items-center space-x-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <span>Show</span>
        <div className="relative">
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold outline-none appearance-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
            <svg className="h-3 w-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        <span>items per page</span>
      </div>

      {/* Page Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-1.5">
          {/* Previous Page Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              p-2 rounded-lg border transition-all duration-200 cursor-pointer
              ${currentPage === 1
                ? 'border-slate-150 text-slate-300 dark:border-slate-800/80 dark:text-slate-700 cursor-not-allowed'
                : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'}
            `}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                  currentPage === 1
                    ? 'bg-primary-500 border-primary-500 text-white shadow-soft'
                    : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'
                }`}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="text-slate-450 dark:text-slate-550 text-xs px-1">...</span>
              )}
            </>
          )}

          {pageRange.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer
                ${currentPage === page
                  ? 'bg-primary-500 border-primary-500 text-white shadow-soft font-extrabold'
                  : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'}
              `}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-slate-450 dark:text-slate-550 text-xs px-1">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-primary-500 border-primary-500 text-white shadow-soft'
                    : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Page Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              p-2 rounded-lg border transition-all duration-200 cursor-pointer
              ${currentPage === totalPages
                ? 'border-slate-150 text-slate-300 dark:border-slate-800/80 dark:text-slate-700 cursor-not-allowed'
                : 'border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800'}
            `}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
