import React from 'react';
import { ShieldCheck, Lock, Cpu, CloudCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TrustBadges = ({ className = '' }) => {
  const { t } = useLanguage();

  const badges = [
    { label: t('Secure JWT Auth'), icon: Lock },
    { label: t('256-Bit Encrypted Data'), icon: ShieldCheck },
    { label: t('Verified Weather Sync'), icon: CloudCheck },
    { label: t('CatBoost v2.4 AI Engine'), icon: Cpu },
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {badges.map((b, i) => (
        <div
          key={i}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 shadow-2xs"
        >
          <b.icon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
