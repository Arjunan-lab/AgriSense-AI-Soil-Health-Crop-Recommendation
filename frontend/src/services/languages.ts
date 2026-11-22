import api from './api';

export interface Language {
  code: string;
  name: string;
  native: string;
}

// Fallback master list matching Sarvam AI registry
export const FALLBACK_LANGUAGES: Language[] = [
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', native: 'கன்னட' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as-IN', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur-IN', name: 'Urdu', native: 'اردو' },
  { code: 'sa-IN', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'kok-IN', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mai-IN', name: 'Maithili', native: 'मैथिली' },
  { code: 'ne-IN', name: 'Nepali', native: 'नेपाली' },
  { code: 'ks-IN', name: 'Kashmiri', native: 'कॉशुर' },
  { code: 'doi-IN', name: 'Dogri', native: 'डोगरी' },
  { code: 'sd-IN', name: 'Sindhi', native: 'سنڌي' },
  { code: 'mni-IN', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'brx-IN', name: 'Bodo', native: 'बर\'' },
  { code: 'sat-IN', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
];

let cachedLanguages: Language[] | null = null;

export const fetchSupportedLanguages = async (): Promise<Language[]> => {
  if (cachedLanguages && cachedLanguages.length > 0) {
    return cachedLanguages;
  }

  try {
    const res = await api.get<{ languages: Language[] }>('/languages');
    if (res.data && Array.isArray(res.data.languages) && res.data.languages.length > 0) {
      cachedLanguages = res.data.languages;
      return cachedLanguages;
    }
  } catch (err) {
    console.warn('Could not fetch languages from /languages, trying /auth/languages fallback');
    try {
      const resAuth = await api.get<{ languages: Language[] }>('/auth/languages');
      if (resAuth.data && Array.isArray(resAuth.data.languages) && resAuth.data.languages.length > 0) {
        cachedLanguages = resAuth.data.languages;
        return cachedLanguages;
      }
    } catch (e) {
      console.warn('Fallback to static Sarvam AI master language registry');
    }
  }

  cachedLanguages = FALLBACK_LANGUAGES;
  return cachedLanguages;
};
