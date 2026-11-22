import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, WifiOff, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SplashAndOfflineProvider = ({ children }) => {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash once per browser session
    return !sessionStorage.getItem('agroai_splash_shown');
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('agroai_splash_shown', 'true');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* INITIAL LAUNCH SPLASH SCREEN */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="p-4 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl shadow-2xl shadow-emerald-500/30 ring-8 ring-emerald-500/10">
                <BrainCircuit className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Agro<span className="text-emerald-400">AI</span>
                </h1>
                <p className="text-xs font-bold text-emerald-400/90 uppercase tracking-widest mt-1">
                  Enterprise Soil & Crop Intelligence
                </p>
              </div>
              <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFFLINE NETWORK BANNER */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[9990] bg-amber-500 text-slate-950 py-2.5 px-4 flex items-center justify-center space-x-3 text-xs font-black shadow-lg"
          >
            <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
            <span>{t('You are currently offline. Displaying cached agricultural records.')}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-1 bg-slate-950 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-slate-900 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
};

export default SplashAndOfflineProvider;
