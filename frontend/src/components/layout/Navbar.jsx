import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ onMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white border-b border-slate-200/50 dark:bg-slate-900 dark:border-slate-800/80">
      {/* Left: Mobile hamburger menu toggle */}
      <div className="flex items-center">
        <button
          onClick={onMobileMenuOpen}
          className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 lg:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-3">
        {/* Sarvam AI Language Switcher */}
        <LanguageSwitcher />

        {/* Dark mode switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-primary-500 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Dynamic Notifications Bell & Drawer */}
        <NotificationBell />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400 flex items-center justify-center font-bold text-xs border border-primary-200 dark:border-primary-900">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>

          {profileDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-card shadow-soft-lg z-40 py-1">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {user?.username || 'User Profile'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || ''}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
