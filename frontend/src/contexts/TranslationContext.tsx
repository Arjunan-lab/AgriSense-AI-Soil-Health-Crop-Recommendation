/**
 * TranslationContext.tsx
 * ----------------------
 * Primary Translation Context for the AgriSarthi platform.
 * Sources: English dictionary (built-in) → Backend PostgreSQL → Sarvam AI (first time)
 *
 * Used by: Navbar, Sidebar, Dashboard, Chatbot, AuthPages and all new components
 * via: useTranslation() hook
 *
 * NOTE: LanguageContext.jsx is a sibling context for legacy components (History, etc.)
 * Both contexts share the same localStorage key ("preferred_language") for sync.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translationService, ENGLISH_DICTIONARY, normalizeLangCode, SUPPORTED_LANGUAGES, LanguageOption } from '../services/translationService';

import { profileAPI } from '../api/profile';

interface TranslationContextType {
  language: string;
  languageOption: LanguageOption;
  setLanguage: (lang: string, langId?: number) => Promise<void>;
  t: (key: string, defaultText?: string) => string;
  isLoading: boolean;
  supportedLanguages: LanguageOption[];
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem('preferred_language') || 'en';
  });

  const [translations, setTranslations] = useState<Record<string, string>>(ENGLISH_DICTIONARY);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadTranslations = useCallback(async (langCode: string) => {
    const code = normalizeLangCode(langCode);
    setIsLoading(true);
    try {
      const data = await translationService.getTranslations(code);
      setTranslations(data);
    } catch (err) {
      console.error('Failed to load translations in TranslationProvider:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on initial mount
  useEffect(() => {
    loadTranslations(language);
  }, []); // eslint-disable-line

  // Listen for localStorage changes from LanguageContext sync
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('preferred_language') || 'en';
      const code = normalizeLangCode(stored);
      if (code !== normalizeLangCode(language)) {
        setLanguageState(code);
        loadTranslations(code);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [language, loadTranslations]);

  const setLanguage = async (newLang: string, langId?: number) => {
    const code = normalizeLangCode(newLang);
    localStorage.setItem('preferred_language', code);
    setLanguageState(code);
    await loadTranslations(code);

    const targetOption = SUPPORTED_LANGUAGES.find(l => l.code === code || l.id === langId);
    if (targetOption && localStorage.getItem('access_token')) {
      try {
        await profileAPI.updateLanguage(targetOption.id);
      } catch (err) {
        console.warn('Backend language sync warning:', err);
      }
    }

    // Dispatch a storage event so LanguageContext can sync too
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'preferred_language',
      newValue: code,
    }));
  };

  const t = useCallback((key: string, defaultText?: string): string => {
    if (!key) return defaultText || '';

    if (translations[key]) return translations[key];
    if (ENGLISH_DICTIONARY[key]) return ENGLISH_DICTIONARY[key];
    if (defaultText) return defaultText;

    return translationService.humanizeKey(key);
  }, [translations]);

  const code = normalizeLangCode(language);
  const currentLangOption = SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];

  return (
    <TranslationContext.Provider
      value={{
        language: code,
        languageOption: currentLangOption,
        setLanguage,
        t,
        isLoading,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      <div
        className={`transition-opacity duration-200 ${isLoading ? 'opacity-80 pointer-events-none' : 'opacity-100'}`}
        style={{ minHeight: '100%' }}
      >
        {children}
      </div>
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
