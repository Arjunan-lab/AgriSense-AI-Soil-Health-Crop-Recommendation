/**
 * LanguageContext.jsx
 * -------------------
 * Unified Language Context that bridges the existing useLanguage() API (used by
 * older components) with the new PostgreSQL/Sarvam AI translation backend.
 *
 * Translation resolution order:
 *  1. Backend PostgreSQL cache (fetched via translationService)
 *  2. Built-in static offline dictionary (UI_TRANSLATIONS)
 *  3. Return original text unchanged (never blank)
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { normalizeDigits } from '../utils/formatters';
import { translationService, normalizeLangCode, ENGLISH_DICTIONARY } from '../services/translationService';

// ── Language code normalisation map ─────────────────────────────────────────
const LANG_MAP = {
  'en-IN': 'en', 'en': 'en', 'English': 'en',
  'hi-IN': 'hi', 'hi': 'hi', 'Hindi': 'hi',
  'pa-IN': 'pa', 'pa': 'pa', 'Punjabi': 'pa',
  'ta-IN': 'ta', 'ta': 'ta', 'Tamil': 'ta',
  'te-IN': 'te', 'te': 'te', 'Telugu': 'te',
  'bn-IN': 'bn', 'bn': 'bn', 'Bengali': 'bn',
  'mr-IN': 'mr', 'mr': 'mr', 'Marathi': 'mr',
  'gu-IN': 'gu', 'gu': 'gu', 'Gujarati': 'gu',
  'kn-IN': 'kn', 'kn': 'kn', 'Kannada': 'kn',
  'ml-IN': 'ml', 'ml': 'ml', 'Malayalam': 'ml',
  'or-IN': 'or', 'or': 'or', 'Odia': 'or',
  'as-IN': 'as', 'as': 'as', 'Assamese': 'as',
  'ur-IN': 'ur', 'ur': 'ur', 'Urdu': 'ur',
  'sa-IN': 'sa', 'sa': 'sa', 'Sanskrit': 'sa',
  'kok-IN': 'kok', 'kok': 'kok', 'Konkani': 'kok',
  'mai-IN': 'mai', 'mai': 'mai', 'Maithili': 'mai',
  'ne-IN': 'ne', 'ne': 'ne', 'Nepali': 'ne',
  'ks-IN': 'ks', 'ks': 'ks', 'Kashmiri': 'ks',
  'doi-IN': 'doi', 'doi': 'doi', 'Dogri': 'doi',
  'sd-IN': 'sd', 'sd': 'sd', 'Sindhi': 'sd',
  'mni-IN': 'mni', 'mni': 'mni', 'Manipuri': 'mni',
  'brx-IN': 'brx', 'brx': 'brx', 'Bodo': 'brx',
  'sat-IN': 'sat', 'sat': 'sat', 'Santali': 'sat',
};

// ── Human-readable display names for ISO codes ───────────────────────────────
const LANG_DISPLAY = {
  en: 'English', hi: 'Hindi', pa: 'Punjabi', ta: 'Tamil', te: 'Telugu',
  bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam',
  or: 'Odia', as: 'Assamese', ur: 'Urdu', sa: 'Sanskrit', kok: 'Konkani',
  mai: 'Maithili', ne: 'Nepali', ks: 'Kashmiri', doi: 'Dogri', sd: 'Sindhi',
  mni: 'Manipuri', brx: 'Bodo', sat: 'Santali',
};

// ── Built-in offline static translations (fallback only) ─────────────────────
const UI_TRANSLATIONS = {
  "Odia": {
    "Dashboard": "ଡ୍ୟାସବୋର୍ଡ", "Complete Analysis": "ସମ୍ପୂର୍ଣ୍ଣ ବିଶ୍ଳେଷଣ", "History": "ଇତିହାସ",
    "Profile": "ପ୍ରୋଫାଇଲ୍", "Settings": "ସେଟିଙ୍ଗ୍ସ", "Logout": "ଲଗ୍ ଆଉଟ୍",
    "Weather": "ପାଣିପାଗ", "Notifications": "ବିଜ୍ଞପ୍ତି",
  },
  "Hindi": {
    "Dashboard": "डैशबोर्ड", "Complete Analysis": "पूर्ण विश्लेषण", "History": "इतिहास",
    "Profile": "प्रोफ़ाइल", "Settings": "सेटिंग्स", "Logout": "लॉग आउट",
    "Weather": "मौसम", "Notifications": "सूचनाएं", "Submit": "जमा करें",
    "Cancel": "रद्द करें", "Save Changes": "परिवर्तन सहेजें", "Search": "खोजें",
  },
  "Punjabi": {
    "Dashboard": "ਡੈਸ਼ਬੋਰਡ", "Complete Analysis": "ਸੰਪੂਰਨ ਵਿਸ਼ਲੇਸ਼ਣ", "History": "ਇਤਿਹਾਸ",
    "Profile": "ਪ੍ਰੋਫਾਈਲ", "Settings": "ਸੈਟਿੰਗਾਂ", "Logout": "ਲੌਗ ਆਉਟ",
    "Weather": "ਮੌਸਮ", "Notifications": "ਸੂਚਨਾਵਾਂ", "Submit": "ਜਮ੍ਹਾਂ ਕਰੋ",
  },
  "Tamil": {
    "Dashboard": "டாஷ்போர்டு", "History": "வரலாறு", "Profile": "சுயவிவரம்",
    "Settings": "அமைப்புகள்", "Logout": "வெளியேறு", "Weather": "வானிலை",
  },
  "Telugu": {
    "Dashboard": "డాష్‌బోర్డ్", "History": "చరిత్ర", "Profile": "ప్రొఫైల్",
    "Settings": "సెట్టింగ్‌లు", "Logout": "లాగ్ అవుట్", "Weather": "వాతావరణం",
  },
};

const LanguageContext = createContext({
  currentLanguage: 'en',
  setCurrentLanguage: (lang) => {},
  translate: (text) => text,
  t: (text) => text,
  language: 'en',
  setLanguage: (lang) => {},
});

export const LanguageProvider = ({ children }) => {
  const { user } = useAuth();

  const getInitialLang = useCallback(() => {
    const stored = localStorage.getItem('preferred_language');
    if (stored) return normalizeLangCode(stored);
    if (user?.preferred_language != null) {
      const raw = user.preferred_language;
      return LANG_MAP[raw] || normalizeLangCode(raw) || 'en';
    }
    return 'en';
  }, [user?.preferred_language]);

  const [currentLangCode, setCurrentLangCode] = useState(getInitialLang);
  const [backendTranslations, setBackendTranslations] = useState({});
  const loadingRef = useRef(false);

  // Sync with user profile language
  useEffect(() => {
    if (!user) {
      setCurrentLangCode('en');
      setBackendTranslations({});
      return;
    }
    if (user.preferred_language != null) {
      const code = LANG_MAP[user.preferred_language] || normalizeLangCode(user.preferred_language) || 'en';
      setCurrentLangCode(code);
    }
  }, [user?.id, user?.preferred_language]);

  // Load backend translations when language changes
  useEffect(() => {
    if (currentLangCode === 'en') {
      setBackendTranslations(ENGLISH_DICTIONARY);
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;

    translationService.getTranslations(currentLangCode)
      .then((data) => {
        setBackendTranslations(data || {});
      })
      .catch(() => {
        setBackendTranslations({});
      })
      .finally(() => {
        loadingRef.current = false;
      });
  }, [currentLangCode]);

  // RTL support for Urdu/Kashmiri/Sindhi
  useEffect(() => {
    const isRtl = ['ur', 'ks', 'sd'].includes(currentLangCode);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLangCode || 'en';
  }, [currentLangCode]);

  const setCurrentLanguage = useCallback(async (newLang) => {
    const code = LANG_MAP[newLang] || normalizeLangCode(newLang) || 'en';
    localStorage.setItem('preferred_language', code);
    setCurrentLangCode(code);
  }, []);

  // Translation resolver — backend first, static dict second, original text third
  const translate = useCallback((text) => {
    if (!text || typeof text !== 'string') return text || '';
    if (currentLangCode === 'en') return text;

    // 1. Check backend translations by matching English value or key
    if (Object.keys(backendTranslations).length > 0) {
      // Check if text is a key directly
      if (backendTranslations[text]) return normalizeDigits(backendTranslations[text]);

      // Check by matching English value in ENGLISH_DICTIONARY
      const keyForText = Object.entries(ENGLISH_DICTIONARY).find(([, v]) => v === text)?.[0];
      if (keyForText && backendTranslations[keyForText]) {
        return normalizeDigits(backendTranslations[keyForText]);
      }
    }

    // 2. Check static offline dictionary (using display name)
    const displayLang = LANG_DISPLAY[currentLangCode] || currentLangCode;
    const staticDict = UI_TRANSLATIONS[displayLang];
    if (staticDict && staticDict[text]) {
      return normalizeDigits(staticDict[text]);
    }

    // 3. Return original text as fallback (never blank)
    return text;
  }, [currentLangCode, backendTranslations]);

  // Return both old API (currentLanguage/translate) and new API (language/t) for compatibility
  const displayLang = LANG_DISPLAY[currentLangCode] || currentLangCode;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: displayLang,
        setCurrentLanguage,
        translate,
        t: translate,
        language: currentLangCode,
        setLanguage: setCurrentLanguage,
        langCode: currentLangCode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
