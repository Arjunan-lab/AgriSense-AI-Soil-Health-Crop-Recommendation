import React from 'react';

/** Line-art spinner — two 120° arcs rotating, no solid circle. Replaces Loader2 everywhere. */
export function LineSpinner({ size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="-8 -8 16 16" className="animate-line-art-spin flex-shrink-0" role="status" aria-label="Loading">
      <path d="M 0 -6.5 A 6.5 6.5 0 0 1 5.63 3.25"
        stroke={color} fill="none" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M 0 6.5 A 6.5 6.5 0 0 1 -5.63 -3.25"
        stroke={color} fill="none" strokeWidth={strokeWidth} strokeLinecap="round" style={{ opacity: 0.3 }} />
    </svg>
  );
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'bg-primary-700 text-white shadow-sm hover:bg-primary-800 hover:shadow active:scale-[0.98]',
    secondary: 'bg-secondary-600 text-white shadow-sm hover:bg-secondary-700 hover:shadow active:scale-[0.98]',
    ghost: 'bg-transparent text-text-secondary hover:bg-gray-100 hover:text-text-primary active:scale-[0.98]',
    outlined: 'bg-white border border-border text-text-primary hover:bg-gray-50 active:scale-[0.98]',
    danger: 'bg-error text-white shadow-sm hover:opacity-90 active:scale-[0.98]',
    success: 'bg-success text-white shadow-sm hover:opacity-90 active:scale-[0.98]',
    accent: 'bg-warning text-white shadow-sm hover:opacity-90 active:scale-[0.98]',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <LineSpinner size={16} color="currentColor" strokeWidth={2} /> : icon}
      {children}
    </button>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-surface rounded-xl shadow-sm border border-border transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-primary-100' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Badge({ children, color = 'green' }) {
  const colors = {
    green: 'bg-primary-50 text-primary-700 border border-primary-100',
    blue: 'bg-blue-50 text-blue-700 border border-blue-100',
    orange: 'bg-orange-50 text-orange-700 border border-orange-100',
    red: 'bg-red-50 text-red-700 border border-red-100',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${colors[color]}`}>{children}</span>;
}

export function Skeleton({ className = '', variant = 'text' }) {
  const base = "skeleton relative overflow-hidden bg-gray-200";
  const variants = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  };
  return <div className={`${base} ${variants[variant]} ${className}`} />;
}

export function Input({ label, error, hint, icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-semibold text-text-primary">{label}{props.required && <span className="text-error ml-1">*</span>}</label>}
      <div className="relative group">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-600 transition-colors">{icon}</div>}
        <input
          className={`w-full px-3 py-2 rounded-lg border text-sm bg-surface placeholder-text-muted transition-all duration-200 outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-100 ${icon ? 'pl-9' : ''} ${error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border hover:border-gray-300'}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error animate-fade-in">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export function SelectInput({ label, options, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white text-gray-700 transition-all-smooth hover:border-gray-300 appearance-none"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function ProgressBar({ value, color = '#2E7D32', label }) {
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{label}</span><span>{value}%</span></div>}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function StatusDot({ status }) {
  const colors = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />;
}

export function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-1" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-400 select-none">›</span>}
          {item.page && onNavigate ? (
            <button
              onClick={() => onNavigate(item.page)}
              className="text-green-700 hover:text-green-800 font-medium transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-500">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
