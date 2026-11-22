import React from 'react';
import { CheckCircle2, Circle, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AiReadinessChecklistProps {
  hasImage: boolean;
  hasLocation: boolean;
  nitrogen: number | undefined;
  phosphorus: number | undefined;
  potassium: number | undefined;
  ph: number | undefined;
  weatherReady: boolean;
}

export const AiReadinessChecklist: React.FC<AiReadinessChecklistProps> = ({
  hasImage,
  hasLocation,
  nitrogen,
  phosphorus,
  potassium,
  ph,
  weatherReady,
}) => {
  const { t } = useLanguage();

  const items = [
    { label: t('Soil Image Sample Uploaded'), isDone: hasImage },
    { label: t('Location & Coordinates Selected'), isDone: hasLocation },
    { label: t('Nitrogen (N) Content Entered'), isDone: typeof nitrogen === 'number' && !isNaN(nitrogen) && nitrogen >= 0 },
    { label: t('Phosphorus (P) Content Entered'), isDone: typeof phosphorus === 'number' && !isNaN(phosphorus) && phosphorus >= 0 },
    { label: t('Potassium (K) Content Entered'), isDone: typeof potassium === 'number' && !isNaN(potassium) && potassium >= 0 },
    { label: t('Soil pH Level Specified'), isDone: typeof ph === 'number' && !isNaN(ph) && ph >= 0 && ph <= 14 },
    { label: t('Live Weather Parameters Synced'), isDone: weatherReady },
  ];

  const completedCount = items.filter((i) => i.isDone).length;
  const isAllReady = completedCount === items.length;

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isAllReady
        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-md shadow-emerald-500/5'
        : 'bg-slate-50/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${isAllReady ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
            {isAllReady ? <ShieldCheck className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
              {t('AI Analysis Readiness Checklist')}
            </h4>
            <p className="text-[10px] text-slate-400">
              {completedCount} of {items.length} requirements met
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
          isAllReady
            ? 'bg-emerald-500 text-white shadow-xs'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {isAllReady ? t('100% Ready') : `${Math.round((completedCount / items.length) * 100)}%`}
        </span>
      </div>

      {/* Grid checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/80">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-[11px] font-semibold">
            {item.isDone ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
            )}
            <span className={item.isDone ? 'text-slate-700 dark:text-slate-200 font-bold' : 'text-slate-400 dark:text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiReadinessChecklist;
