import React from 'react';
import { motion } from 'framer-motion';
import {
  Scan,
  Calculator,
  TrendingUp,
  Globe,
  Radio,
  DollarSign,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FUTURE_MODULES = [
  { id: 'm-1', title: 'Plant Disease Diagnosis', desc: 'Computer vision Leaf pathology analysis (28 diseases)', icon: Scan, badge: 'Roadmap Q4' },
  { id: 'm-2', title: 'Precision Fertilizer Calculator', desc: 'NPK dosage optimizer per hectare based on soil deficit', icon: Calculator, badge: 'Roadmap Q4' },
  { id: 'm-3', title: 'Crop Yield Predictor', desc: 'Expected harvest output prediction in quintals/acre', icon: TrendingUp, badge: 'Roadmap 2027' },
  { id: 'm-4', title: 'Satellite Vegetation (NDVI)', desc: 'Sentinel-2 satellite multispectral field health tracking', icon: Globe, badge: 'Roadmap 2027' },
  { id: 'm-5', title: 'IoT Sensor Telemetry', desc: 'Real-time soil moisture & temperature probe integration', icon: Radio, badge: 'Hardware Ready' },
  { id: 'm-6', title: 'Market Crop Price Forecast', desc: 'APMC mandi spot price analytics & sales window suggestion', icon: DollarSign, badge: 'Roadmap 2027' },
];

export const FutureAiModules: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t('Future AI & Agronomy Extensions')}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black">
              Modular Architecture
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('Architecturally supported enterprise extensions for future platform deployment.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FUTURE_MODULES.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-3xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-3 relative opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl">
                <m.icon className="h-5 w-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" /> {m.badge}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{m.title}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 leading-snug">
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureAiModules;
