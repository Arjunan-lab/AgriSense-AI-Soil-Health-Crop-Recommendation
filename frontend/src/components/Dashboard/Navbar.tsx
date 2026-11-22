import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onMobileMenuOpen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white border-b border-slate-200/50 dark:bg-slate-900 dark:border-slate-800/80">
      {/* Left controls */}
      <div className="flex items-center">
        {onMobileMenuOpen && (
          <button
            onClick={onMobileMenuOpen}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 lg:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-emerald-500 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none transition-colors"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-emerald-500 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none transition-colors relative"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-card shadow-soft-lg z-40 py-2">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 font-bold text-xs text-slate-700 dark:text-slate-300">
                  Recent Notifications
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Welcome to Scatter AI!
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Start a Complete Analysis to review soil health.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-soft flex items-center justify-center font-extrabold text-[10px]">
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
                  className="flex w-full items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 dark:text-slate-400 dark:hover:text-rose-450 dark:hover:bg-rose-950/15 active:text-rose-700 dark:active:text-rose-500 text-left transition-colors"
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
