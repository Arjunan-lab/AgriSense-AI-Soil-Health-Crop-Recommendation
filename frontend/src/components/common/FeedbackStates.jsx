import React from 'react';
import { AlertCircle, Inbox, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';

// Badge Component
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900',
    secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200 dark:bg-secondary-950/20 dark:text-secondary-400 dark:border-secondary-900',
    accent: 'bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-950/20 dark:text-accent-400 dark:border-accent-900',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Progress Bar Component
export const ProgressBar = ({ value, label = '', showPercent = true, className = '', height = 'h-2' }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className={`w-full flex flex-col space-y-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          {showPercent && <span>{clampedValue.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full ${height} overflow-hidden`}>
        <div 
          className="bg-primary-500 rounded-full h-full transition-all duration-300"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

// Status Chip (Health scoring / Quality Rating)
export const StatusChip = ({ status, className = '' }) => {
  const norm = (status || '').toLowerCase().trim();

  let variant = 'primary';
  if (norm === 'excellent') variant = 'success';
  else if (norm === 'good') variant = 'accent';
  else if (norm === 'moderate') variant = 'warning';
  else if (norm === 'poor') variant = 'danger';
  else if (norm === 'high' || norm === 'healthy') variant = 'success';
  else if (norm === 'medium' || norm === 'neutral') variant = 'warning';
  else if (norm === 'low' || norm === 'unhealthy') variant = 'danger';

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};


// Stat Card for dashboards
export const StatCard = ({ title, value, icon: Icon, description, trend, className = '' }) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-50">
            {value}
          </div>
        </div>
        {Icon && (
          <div className="p-3 bg-primary-50 text-primary-500 dark:bg-primary-950/20 dark:text-primary-400 rounded-card">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="flex items-center space-x-1.5 mt-4 text-xs">
          {trend && (
            <span className={`font-bold ${trend.type === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.type === 'up' ? '↑' : '↓'} {trend.value}%
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400">
            {description}
          </span>
        </div>
      )}
    </Card>
  );
};

// Page Header containing title and optional CTA buttons
export const PageHeader = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-slate-200/50 dark:border-slate-800/80 mb-6 ${className}`}>
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center space-x-3">{children}</div>}
    </div>
  );
};

// Custom layout section card
export const SectionCard = ({ title, children, action, className = '' }) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </Card>
  );
};

// Empty State View
export const EmptyState = ({
  title = 'No records found',
  description = 'Your items will appear here once they are generated.',
  icon: Icon = Inbox,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-card bg-white dark:bg-slate-900 shadow-soft ${className}`}>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-full mb-4">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

// Error State View
export const ErrorState = ({
  title = 'Something went wrong',
  description = 'There was an error communicating with the backend. Please try again.',
  icon: Icon = ShieldAlert,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-red-100 dark:border-red-950/20 rounded-card bg-red-50/15 dark:bg-red-950/5 shadow-soft ${className}`}>
      <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-full mb-4">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-base font-bold text-red-800 dark:text-red-300 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-red-600/70 dark:text-red-400/50 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};
