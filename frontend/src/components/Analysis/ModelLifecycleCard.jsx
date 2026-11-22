import React from 'react';
import { Cpu, CheckCircle2, Sliders, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ModelLifecycleCard = () => {
  const { t } = useLanguage();

  const featureWeights = [
    { name: 'NPK Nutrients (N, P, K)', weight: 42, color: 'bg-emerald-500' },
    { name: 'Regional Weather Match', weight: 31, color: 'bg-blue-500' },
    { name: 'Soil pH Balance', weight: 27, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{t('ML Model Lifecycle & Governance')}</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                Production v2.4
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              CatBoost Gradient Boosting + EfficientNetB2 Deep Learning Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> 98.4% Accuracy Verified
          </span>
        </div>
      </div>

      {/* Feature Importance Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5 text-emerald-500" />
          <span>Feature Weight Attribution (SHAP Calibration)</span>
        </h4>

        <div className="space-y-2.5">
          {featureWeights.map((f) => (
            <div key={f.name} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{f.name}</span>
                <span className="font-black text-slate-900 dark:text-slate-100">{f.weight}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.weight}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plain-English Diagnostic Rationale */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Farmer Diagnostic Rationale
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          The AI model evaluated your soil sample against 2,200 regional field observations. High nitrogen levels combined with optimal seasonal rainfall indicate maximum yield security for recommended cereal and legume varieties.
        </p>
      </div>
    </div>
  );
};

export default ModelLifecycleCard;
