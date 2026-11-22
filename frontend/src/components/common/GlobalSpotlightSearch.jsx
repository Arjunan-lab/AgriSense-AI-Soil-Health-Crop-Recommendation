import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Sprout,
  History,
  Activity,
  ShieldCheck,
  User,
  Settings,
  Info,
  CloudSun,
  Bot,
  ArrowRight,
  Command,
  FileText,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const GlobalSpotlightSearch = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items = [
    { id: 'p-1', title: 'Dashboard Overview', category: 'Pages', icon: LayoutDashboard, path: '/dashboard', keywords: ['home', 'overview', 'stats'] },
    { id: 'p-2', title: 'New Soil & Crop Analysis', category: 'Pages', icon: Sprout, path: '/analysis', keywords: ['npk', 'image', 'predict', 'recommend'] },
    { id: 'p-3', title: 'Analytical History Records', category: 'Pages', icon: History, path: '/history', keywords: ['past', 'history', 'records', 'pdf'] },
    { id: 'p-4', title: 'System Status & Service Health', category: 'Pages', icon: Activity, path: '/system', keywords: ['server', 'models', 'api', 'health'] },
    { id: 'p-5', title: 'Admin Portal & User Management', category: 'Pages', icon: ShieldCheck, path: '/admin', keywords: ['users', 'reports', 'analytics', 'feedback'] },
    { id: 'p-6', title: 'My Profile & Account', category: 'Pages', icon: User, path: '/profile', keywords: ['account', 'username', 'email'] },
    { id: 'p-7', title: 'Settings & Appearance', category: 'Pages', icon: Settings, path: '/settings', keywords: ['dark', 'light', 'language', 'theme'] },
    { id: 'p-8', title: 'About AgroAI Platform', category: 'Pages', icon: Info, path: '/about', keywords: ['info', 'version', 'help'] },
    { id: 'c-1', title: 'Wheat (Triticum aestivum)', category: 'Crops', icon: Sprout, path: '/analysis', keywords: ['rabi', 'grain'] },
    { id: 'c-2', title: 'Rice / Paddy (Oryza sativa)', category: 'Crops', icon: Sprout, path: '/analysis', keywords: ['kharif', 'water'] },
    { id: 'c-3', title: 'Maize / Corn (Zea mays)', category: 'Crops', icon: Sprout, path: '/analysis', keywords: ['grain', 'feed'] },
    { id: 'c-4', title: 'Cotton (Gossypium)', category: 'Crops', icon: Sprout, path: '/analysis', keywords: ['fiber', 'cash crop'] },
  ];

  const filtered = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[520px]"
        >
          {/* Top Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <Search className="h-5 w-5 text-emerald-500 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('Type a page, crop name, setting, or command... (e.g. rice, admin)')}
              className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-emerald-500'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black">{item.title}</p>
                        <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {item.category} • {item.path || 'Action Command'}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No matching results found for "{query}".
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Footer */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3" /> Navigation Shortcut
            </span>
            <div className="flex items-center space-x-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSpotlightSearch;
