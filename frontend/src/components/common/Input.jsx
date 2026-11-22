import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  placeholder = '',
  className = '',
  icon: Icon = null,
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
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 rounded-card border text-sm transition-all duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400
            ${Icon ? 'pl-11' : ''}
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-900/50 dark:focus:ring-red-900/20' 
              : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 dark:border-slate-800 dark:focus:border-primary-500 dark:focus:ring-primary-950/45'}
            disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/40
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
