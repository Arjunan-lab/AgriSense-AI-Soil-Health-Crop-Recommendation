import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, Sprout, CheckCircle2, Lock, Zap, Camera, FlaskConical,
  MapPin, CloudRain, Download, Sparkles, X, Bot, BarChart3,
  History, ArrowRight,
} from 'lucide-react';

const TRIAL_KEY = 'agroai_guest_trial_used';

export const GuestExperiencePage = () => {
  const navigate = useNavigate();
  const [trialExhausted, setTrialExhausted] = useState(() => {
    return localStorage.getItem(TRIAL_KEY) === 'true';
  });
  const [started, setStarted] = useState(false);

  const trialFeatures = [
    { icon: <Camera size={15} />, label: 'Upload Soil Image' },
    { icon: <FlaskConical size={15} />, label: 'Enter NPK Values' },
    { icon: <MapPin size={15} />, label: 'GPS Location Detection' },
    { icon: <CloudRain size={15} />, label: 'Auto Weather Fetch' },
    { icon: <Sparkles size={15} />, label: 'AI Crop Prediction' },
    { icon: <Download size={15} />, label: 'Preview Report' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Guest Navbar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-xs">
            <Leaf size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">AgroAI</span>
            <span className="px-2 py-0.5 text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-full tracking-wide">
              GUEST USER
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300">
          <Zap size={12} className="text-amber-600" />
          Free Trial · {trialExhausted ? '0' : '1'} / 1 Analysis Remaining
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 px-4 py-2 gradient-primary text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-opacity"
          >
            Create Account <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Guest Welcome Container */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-6">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="gradient-primary px-8 pt-10 pb-8 text-center">
              <div className="relative mx-auto w-20 h-20 mb-5">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shadow-xs">
                  <Sprout size={40} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-xs">
                  <Sparkles size={15} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-white mb-3">Try AgroAI for Free</h1>
              <p className="text-emerald-100 text-sm leading-relaxed max-w-md mx-auto">
                Experience our AI-powered crop recommendation with one complimentary analysis. No registration required.
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                In your free trial you can:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trialFeatures.map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-xs text-white">
                      {f.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{f.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (trialExhausted) {
                    navigate('/register');
                  } else {
                    navigate('/analysis');
                  }
                }}
                className="w-full py-4 gradient-primary text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sprout size={18} />
                {trialExhausted ? 'Trial Complete — Register Free Account' : 'Start Free Crop Analysis'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestExperiencePage;
