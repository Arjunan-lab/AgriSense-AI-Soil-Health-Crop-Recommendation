import React from 'react';

const Select = React.forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col w-full space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-card border text-sm transition-all duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-900/50 dark:focus:ring-red-900/20' 
            : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 dark:border-slate-800 dark:focus:border-primary-500 dark:focus:ring-primary-950/45'}
          disabled:opacity-50 disabled:bg-slate-50
        `}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
