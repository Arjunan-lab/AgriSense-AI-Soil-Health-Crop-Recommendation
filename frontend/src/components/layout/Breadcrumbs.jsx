import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5">
      <Link
        to="/dashboard"
        className="flex items-center text-slate-400 hover:text-primary-500 transition-colors duration-150"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayValue = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-700" />
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-200 capitalize">
                {displayValue}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary-500 transition-colors duration-150 capitalize"
              >
                {displayValue}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
