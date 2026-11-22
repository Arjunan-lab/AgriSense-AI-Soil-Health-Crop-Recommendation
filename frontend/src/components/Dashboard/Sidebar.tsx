import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Leaf,
  History,
  HeartPulse,
  Brain,
  LogOut,
  Sprout
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Complete Analysis', path: '/analysis', icon: Leaf },
    { name: 'History', path: '/history', icon: History },
    { name: 'Health', path: '/system', icon: HeartPulse },
    { name: 'Model Info', path: '/system', icon: Brain }, // maps to system page where both health & model info reside
  ];

  const linkClasses = ({ isActive }: { isActive: boolean }) => `
    flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-card transition-all duration-200 border border-transparent
    ${isActive
      ? 'bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/40'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
  `;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/80 w-64">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2 px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
          <Sprout className="h-5 w-5" />
        </div>
        <span className="font-extrabold text-base tracking-tight text-slate-800 dark:text-slate-50">
          Scatter <span className="text-emerald-500">AI</span>
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={linkClasses}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (onClose) onClose();
            handleLogout();
          }}
          className="flex w-full items-center space-x-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-card transition-colors border border-transparent"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 w-64 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />
          <div className="relative z-10 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
