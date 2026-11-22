import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  healthFilter: string;
  onHealthFilterChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  healthFilter,
  onHealthFilterChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const healthOptions = [
    { value: 'all', label: 'All Health Classes' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'poor', label: 'Poor' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest_confidence', label: 'Highest Confidence' },
    { value: 'lowest_confidence', label: 'Lowest Confidence' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-card p-4 shadow-soft">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="h-4.5 w-4.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Analysis ID, Soil type, or Crop..."
          className="w-full pl-11 pr-4 py-2.5 rounded-card border border-slate-200 focus:border-primary-500 focus:ring-primary-100 dark:border-slate-800 dark:focus:border-primary-500 dark:focus:ring-primary-950/45 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 outline-none"
        />
      </div>

      {/* Filter and Sort Dropdowns */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Health Class Filter */}
        <div className="relative flex-1 sm:w-56">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <select
            value={healthFilter}
            onChange={(e) => onHealthFilterChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-card border border-slate-200 focus:border-primary-500 focus:ring-primary-100 dark:border-slate-800 dark:focus:border-primary-500 dark:focus:ring-primary-950/45 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all duration-200 outline-none appearance-none cursor-pointer font-semibold"
          >
            {healthOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="font-sans">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Dropdown Chevron indicator */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:w-56">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
            <ArrowUpDown className="h-4 w-4" />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-card border border-slate-200 focus:border-primary-500 focus:ring-primary-100 dark:border-slate-800 dark:focus:border-primary-500 dark:focus:ring-primary-950/45 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all duration-200 outline-none appearance-none cursor-pointer font-semibold"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="font-sans">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Dropdown Chevron indicator */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
