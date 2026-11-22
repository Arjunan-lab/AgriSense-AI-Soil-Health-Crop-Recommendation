/**
 * pages/NotFoundPage.jsx
 * ----------------------
 * 404 error page displayed when no route matches.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 max-w-md"
      >
        {/* Animated icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="flex justify-center"
        >
          <div className="p-6 bg-primary-50 dark:bg-primary-950/20 text-primary-400 rounded-full">
            <Sprout className="h-16 w-16" />
          </div>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-8xl font-extrabold text-primary-500 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Looks like this field hasn&apos;t been cultivated yet. The page you&apos;re
            looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-card text-sm shadow-soft transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-card text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
