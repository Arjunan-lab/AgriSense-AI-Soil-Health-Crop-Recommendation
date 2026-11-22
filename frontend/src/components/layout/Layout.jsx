import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../Dashboard/Sidebar';
import Navbar from '../Dashboard/Navbar';
import Breadcrumbs from './Breadcrumbs';

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMobileSidebarClose = () => setMobileSidebarOpen(false);
  const handleMobileSidebarOpen = () => setMobileSidebarOpen(true);

  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Navigation Sidebar */}
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onClose={handleMobileSidebarClose}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation Navbar */}
        <Navbar onMobileMenuOpen={handleMobileSidebarOpen} />

        {/* Main Body */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Breadcrumbs />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Reusable Footer */}
        <footer className="py-5 px-6 border-t border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
          © {new Date().getFullYear()} Scatter AI. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
