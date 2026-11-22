import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Cpu, GitBranch, Sprout, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STEPS = [
  {
    id: 1,
    title: 'Scanning Soil Image',
    desc: 'Extracting texture, color tone, and physical soil structure using EfficientNetB2...',
    icon: Scan,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 2,
    title: 'Neural Network Synapse Pulse',
    desc: 'Computing NPK ratio embeddings and CatBoost model feature vectors...',
    icon: Cpu,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 3,
    title: 'Root Growth & Soil Diagnostics',
    desc: 'Evaluating soil health score, moisture retention, and pH balance...',
    icon: GitBranch,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 4,
    title: 'Synthesizing Crop Recommendations',
    desc: 'Calculating yield expectations, market demand, and suitability metrics...',
    icon: Sprout,
    color: 'from-emerald-400 to-green-600',
  },
];

export const PredictionSequenceAnimation: React.FC = () => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-xl shadow-emerald-500/5 relative overflow-hidden min-h-[360px]">
      {/* Background glowing aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

      {/* Center Animated Icon Stage */}
      <div className="relative flex items-center justify-center h-28 w-28 my-2">
        {/* Pulsing Outer Ring */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-md"
        />

        {/* Rotating Synapse Border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-2 rounded-full border-2 border-dashed border-emerald-500/40"
        />

        {/* Step Icon Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`h-20 w-20 rounded-2xl bg-gradient-to-tr ${currentStep.color} flex items-center justify-center text-white shadow-xl shadow-emerald-500/20`}
          >
            <currentStep.icon className="h-10 w-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Info Header */}
      <div className="space-y-2 max-w-md z-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          <span>Step {currentStepIndex + 1} of {STEPS.length}: {t(currentStep.title)}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium"
          >
            {t(currentStep.desc)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Step Progress Dots */}
      <div className="flex items-center space-x-2 pt-2 z-10">
        {STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx <= currentStepIndex
                ? 'w-8 bg-emerald-500'
                : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PredictionSequenceAnimation;
