import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dropdown = ({
  trigger,
  children,
  align = 'right',
  width = 'w-56',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${alignmentClasses} mt-2 ${width} z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 p-1.5 focus:outline-none`}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  className = '',
}) => {
  const baseClasses =
    'flex items-center w-full px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer gap-2.5';
  const variantClasses =
    variant === 'danger'
      ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:text-rose-400'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export default Dropdown;
