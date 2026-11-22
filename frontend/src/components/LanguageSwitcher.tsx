/**
 * LanguageSwitcher.tsx
 * --------------------
 * Navbar language dropdown. On selection:
 *  1. Updates TranslationContext (backend translations)
 *  2. Dispatches storage event → LanguageContext syncs automatically
 *  3. Shows spinner while loading
 */
import React, { useState } from 'react';
import { Globe, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../services/translationService';

export const LanguageSwitcher: React.FC = () => {
  const { languageOption, setLanguage, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = async (lang: LanguageOption) => {
    setIsOpen(false);
    if (lang.code === languageOption?.code) return;
    await setLanguage(lang.code, lang.id);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-background text-text-primary text-xs font-semibold focus:outline-none transition-all cursor-pointer shadow-sm"
        title="Select Language"
        aria-label="Language selector"
      >
        {isLoading
          ? <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
          : <Globe className="h-4 w-4 text-primary-600" />
        }
        <span className="max-w-[72px] truncate">{languageOption?.native || 'English'}</span>
        <ChevronDown className={`h-3 w-3 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-elevated z-50 py-2 max-h-80 overflow-y-auto animate-fade-in">
            <div className="px-3 py-1.5 border-b border-border text-[10px] uppercase font-extrabold text-text-muted tracking-wider">
              All {SUPPORTED_LANGUAGES.length} Languages
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === languageOption?.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-bold'
                      : 'text-text-primary hover:bg-background'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{lang.native}</span>
                    <span className="text-[10px] text-text-muted">({lang.name})</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
