/**
 * translationService.ts
 * ----------------------
 * Centralized translation service.
 * Caching: Memory → localStorage → Backend (PostgreSQL / Sarvam AI pipeline).
 */
import { translationsAPI } from '../api/translations';
import { OFFLINE_TRANSLATIONS } from './offlineTranslations';

export interface LanguageOption {
  id: number;
  code: string;
  english_name: string;
  native_name: string;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 1,  code: 'en',  english_name: 'English',   native_name: 'English',    name: 'English',   native: 'English' },
  { id: 2,  code: 'hi',  english_name: 'Hindi',     native_name: 'हिन्दी',     name: 'Hindi',     native: 'हिन्दी' },
  { id: 3,  code: 'pa',  english_name: 'Punjabi',   native_name: 'ਪੰਜਾਬੀ',     name: 'Punjabi',   native: 'ਪੰਜਾਬੀ' },
  { id: 4,  code: 'bn',  english_name: 'Bengali',   native_name: 'বাংলা',       name: 'Bengali',   native: 'বাংলা' },
  { id: 5,  code: 'te',  english_name: 'Telugu',    native_name: 'తెలుగు',     name: 'Telugu',    native: 'తెలుగు' },
  { id: 6,  code: 'mr',  english_name: 'Marathi',   native_name: 'मराठी',      name: 'Marathi',   native: 'मराठी' },
  { id: 7,  code: 'ta',  english_name: 'Tamil',     native_name: 'தமிழ்',      name: 'Tamil',     native: 'தமிழ்' },
  { id: 8,  code: 'ur',  english_name: 'Urdu',      native_name: 'اردو',       name: 'Urdu',      native: 'اردو' },
  { id: 9,  code: 'gu',  english_name: 'Gujarati',  native_name: 'ગુજરાતી',   name: 'Gujarati',  native: 'ગુજરાતી' },
  { id: 10, code: 'kn',  english_name: 'Kannada',   native_name: 'ಕನ್ನಡ',     name: 'Kannada',   native: 'ಕನ್ನಡ' },
  { id: 11, code: 'ml',  english_name: 'Malayalam', native_name: 'മലയാളം',   name: 'Malayalam', native: 'മലയാളം' },
  { id: 12, code: 'or',  english_name: 'Odia',      native_name: 'ଓଡ଼ିଆ',     name: 'Odia',      native: 'ଓଡ଼ିଆ' },
  { id: 13, code: 'as',  english_name: 'Assamese',  native_name: 'অসমীয়া',    name: 'Assamese',  native: 'অসমীয়া' },
  { id: 14, code: 'mai', english_name: 'Maithili',  native_name: 'मैथिली',    name: 'Maithili',  native: 'मैथिली' },
  { id: 15, code: 'sat', english_name: 'Santali',   native_name: 'ᱥᱟᱱᱛᱟᱲᱤ',   name: 'Santali',   native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { id: 16, code: 'ks',  english_name: 'Kashmiri',  native_name: 'कॉशुर',     name: 'Kashmiri',  native: 'कॉशुर' },
  { id: 17, code: 'ne',  english_name: 'Nepali',    native_name: 'नेपाली',    name: 'Nepali',    native: 'नेपाली' },
  { id: 18, code: 'sd',  english_name: 'Sindhi',    native_name: 'सिन्धी',    name: 'Sindhi',    native: 'सिन्धी' },
  { id: 19, code: 'sa',  english_name: 'Sanskrit',  native_name: 'संस्कृतम्',  name: 'Sanskrit',  native: 'संस्कृतम्' },
  { id: 20, code: 'kok', english_name: 'Konkani',   native_name: 'कोंकणी',    name: 'Konkani',   native: 'कोंकणी' },
  { id: 21, code: 'doi', english_name: 'Dogri',     native_name: 'डोगरी',     name: 'Dogri',     native: 'डोगरी' },
  { id: 22, code: 'mni', english_name: 'Manipuri',  native_name: 'ꯃꯩꯇꯩꯂꯣꯟ',  name: 'Manipuri',  native: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  { id: 23, code: 'bo',  english_name: 'Bodo',      native_name: 'बोडो',      name: 'Bodo',      native: 'बोडो' },
];

export function normalizeLangCode(lang: any): string {
  if (lang === null || lang === undefined) return 'en';
  if (typeof lang === 'number') {
    const idMap: Record<number, string> = {
      1: 'en', 2: 'hi', 3: 'pa', 4: 'bn', 5: 'te', 6: 'mr', 7: 'ta', 8: 'ur', 9: 'gu', 10: 'kn',
      11: 'ml', 12: 'or', 13: 'as', 14: 'mai', 15: 'sat', 16: 'ks', 17: 'ne', 18: 'sd', 19: 'sa', 20: 'kok',
      21: 'doi', 22: 'mni', 23: 'bo'
    };
    return idMap[lang] || 'en';
  }
  const str = String(lang).trim();
  if (!str) return 'en';

  // Handle "-IN" suffixes
  const lc = str.toLowerCase();
  const base = lc.replace(/-in$/, '');
  const map: Record<string, string> = {
    '1': 'en', '2': 'hi', '3': 'pa', '4': 'bn', '5': 'te', '6': 'mr', '7': 'ta', '8': 'ur', '9': 'gu', '10': 'kn',
    '11': 'ml', '12': 'or', '13': 'as', '14': 'mai', '15': 'sat', '16': 'ks', '17': 'ne', '18': 'sd', '19': 'sa', '20': 'kok',
    '21': 'doi', '22': 'mni', '23': 'bo',
    en: 'en', english: 'en',
    hi: 'hi', hindi: 'hi',
    pa: 'pa', punjabi: 'pa',
    bn: 'bn', bengali: 'bn',
    te: 'te', telugu: 'te',
    mr: 'mr', marathi: 'mr',
    ta: 'ta', tamil: 'ta',
    ur: 'ur', urdu: 'ur',
    gu: 'gu', gujarati: 'gu',
    kn: 'kn', kannada: 'kn',
    ml: 'ml', malayalam: 'ml',
    or: 'or', odia: 'or',
    bn: 'bn', bengali: 'bn',
    as: 'as', assamese: 'as',
    sa: 'sa', sanskrit: 'sa',
    kok: 'kok', konkani: 'kok',
    mai: 'mai', maithili: 'mai',
    ne: 'ne', nepali: 'ne',
    ks: 'ks', kashmiri: 'ks',
    doi: 'doi', dogri: 'doi',
    sd: 'sd', sindhi: 'sd',
    mni: 'mni', manipuri: 'mni',
    brx: 'brx', bodo: 'brx',
    sat: 'sat', santali: 'sat',
  };
  return map[base] || map[lc] || base;
}

// ─────────────────────────────────────────────────────────────────────────────
// Master English dictionary – ALL translatable UI keys in one place.
// These are the canonical keys used by t("key") throughout the app.
// ─────────────────────────────────────────────────────────────────────────────
export const ENGLISH_DICTIONARY: Record<string, string> = {
  // ── Navigation / Sidebar ──────────────────────────────────────────────────
  dashboard:            'Dashboard',
  farmer_dashboard:     'Farmer Dashboard',
  admin_dashboard:      'Admin Dashboard',
  soil:                 'Soil Classification',
  soil_classification:  'Soil Classification',
  crop:                 'Crop Recommendation',
  crop_recommendation:  'Crop Recommendation',
  fertilizer:           'Fertilizer Recommendation',
  disease:              'Disease Detection',
  disease_detection:    'Disease Detection',
  chatbot:              'AI Chatbot',
  weather:              'Weather Forecast',
  community:            'Farmer Community',
  history:              'Prediction History',
  notifications:        'Notifications',
  feedback:             'Feedback',
  profile:              'My Profile',
  settings:             'Settings',
  about:                'About AgroAI',
  admin:                'Admin Console',
  logout:               'Sign Out',
  login:                'Sign In',
  register:             'Create Account',
  get_started:          'Get Started',

  // ── Auth Pages ────────────────────────────────────────────────────────────
  sign_in:              'Sign In',
  sign_in_to_account:   'Sign in to your account',
  dont_have_account:    'Don\'t have an account?',
  already_have_account: 'Already have an account?',
  forgot_password:      'Forgot Password?',
  back_to_login:        'Back to Sign In',
  create_account:       'Create Account',
  email_address:        'Email Address',
  password:             'Password',
  confirm_password:     'Confirm Password',
  full_name:            'Full Name',
  phone_number:         'Phone Number',
  state:                'State',
  district:             'District',
  city:                 'City / Village',
  postal_code:          'Postal Code',
  farming_type:         'Farming Type',
  i_agree_terms:        'I agree to Terms & Privacy Policy',

  // ── Validation ────────────────────────────────────────────────────────────
  required_field:       'This field is required',
  invalid_email:        'Invalid email address',
  password_too_short:   'Password must be at least 8 characters',
  passwords_dont_match: 'Passwords do not match',
  invalid_phone:        'Invalid phone number',
  field_required:       'This field is required',

  // ── Dashboard ─────────────────────────────────────────────────────────────
  total_predictions:    'Total Predictions',
  average_confidence:   'Average Confidence',
  weather_alerts:       'Weather Alerts',
  quick_actions:        'Quick Actions',
  soil_analysis:        'Soil Analysis',
  crop_advice:          'Crop Advice',
  prediction_trends:    'Prediction Trends',
  crop_distribution:    'Crop Distribution',
  recent_activity:      'Recent Activity',
  good_morning:         'Good Morning',
  good_afternoon:       'Good Afternoon',
  good_evening:         'Good Evening',
  ai_insights:          'AI insights available',
  fields_healthy:       'fields are looking healthy',

  // ── Weather ───────────────────────────────────────────────────────────────
  current_weather:      'Current Weather',
  humidity:             'Humidity',
  rainfall:             'Rainfall',
  temperature:          'Temperature',
  wind_speed:           'Wind Speed',
  wind:                 'Wind',
  pressure:             'Pressure',
  forecast:             '7-Day Forecast',
  location:             'Location',
  search_location:      'Search city or village...',
  permission_denied:    'Location permission denied',
  feels_like:           'Feels Like',
  sunrise:              'Sunrise',
  sunset:               'Sunset',
  uv_index:             'UV Index',
  visibility:           'Visibility',
  use_gps:              'Use My Location (GPS)',
  change_city:          'Change city...',
  fetch:                'Fetch',

  // ── AI Chatbot ────────────────────────────────────────────────────────────
  agrisarthi_ai:        'AgriSarthi AI Assistant',
  online:               'Online · Agricultural AI Specialist',
  ask_anything:         'Ask AgriSarthi about crops, soil health, fertilizers, or diseases...',
  send:                 'Send',
  new_chat:             'New Chat',
  clear_chat:           'Clear Chat',
  voice_message:        'Voice Message',
  upload_image:         'Upload Image',
  copy:                 'Copy',
  loading:              'Loading, please wait...',
  agrisarthi_typing:    'AgriSarthi is thinking...',
  suggested_questions:  'Suggested Questions',
  chatbot_disclaimer:   'AgriSarthi AI offers agricultural recommendations. Verify critical decisions with local agricultural experts.',
  choose_language:      'Choose Response Language',
  recent_conversations: 'Recent Conversations',

  // ── Soil & Crop Analysis ──────────────────────────────────────────────────
  upload_soil_image:    'Upload Soil Image',
  analyze_soil:         'Analyze Soil & Recommend Crops',
  predicted_soil_type:  'Predicted Soil Type',
  confidence:           'Model Confidence',
  recommendations:      'Recommended Crops',
  soil_health:          'Soil Health',
  health_rating:        'Health Rating',
  fertility_class:      'Fertility Class',
  nutrient_deficiency:  'Nutrient Deficiency',
  npk_nitrogen:         'Nitrogen (N)',
  npk_phosphorus:       'Phosphorus (P)',
  npk_potassium:        'Potassium (K)',
  ph_level:             'Soil pH Level',
  organic_carbon:       'Organic Carbon',
  complete_analysis:    'Complete Analysis',
  start_new_analysis:   'Start New Analysis',
  analysis_id:          'Analysis ID',
  confidence_score:     'Confidence Score',

  // ── History ───────────────────────────────────────────────────────────────
  prediction_history:   'Prediction History',
  no_history:           'No analysis records found',
  view_details:         'View Details',
  download_pdf:         'Download PDF',
  delete_record:        'Delete Record',
  filter:               'Filter',
  sort_by:              'Sort By',
  newest:               'Newest First',
  oldest:               'Oldest First',
  search_history:       'Search history...',
  date:                 'Date',
  status:               'Status',
  actions:              'Actions',
  rank:                 'Rank',
  suitability:          'Suitability',

  // ── Profile & Settings ────────────────────────────────────────────────────
  my_profile:           'My Profile',
  edit_profile:         'Edit Profile',
  preferred_language:   'Preferred Language',
  display_language:     'Display Language',
  appearance:           'Appearance',
  dark_mode:            'Dark Mode',
  light_mode:           'Light Mode',
  system_theme:         'System',
  account_settings:     'Account Settings',
  change_password:      'Change Password',
  current_password:     'Current Password',
  new_password:         'New Password',
  save_changes:         'Save Changes',
  upload_photo:         'Upload Photo',
  joined:               'Member Since',
  total_analyses:       'Total Analyses',

  // ── Notifications ─────────────────────────────────────────────────────────
  no_notifications:     'No unread notifications',
  mark_all_read:        'Mark all as read',
  notification_settings:'Notification Settings',

  // ── Admin ─────────────────────────────────────────────────────────────────
  user_management:      'User Management',
  analytics:            'Analytics',
  reports:              'Reports',
  chatbot_monitoring:   'Chatbot Monitoring',
  users:                'Users',
  total_users:          'Total Users',
  active_users:         'Active Users',
  new_today:            'New Today',
  user_role:            'Role',
  user_status:          'Status',
  joined_date:          'Joined',
  region:               'Region',
  active:               'Active',
  inactive:             'Inactive',
  pending:              'Pending',
  blocked:              'Blocked',

  // ── Feedback ─────────────────────────────────────────────────────────────
  submit_feedback:      'Submit Feedback',
  your_feedback:        'Your Feedback',
  feedback_submitted:   'Feedback Submitted!',
  thank_you:            'Thank you for your feedback.',
  rate_experience:      'Rate Your Experience',

  // ── Common Controls ───────────────────────────────────────────────────────
  submit:               'Submit',
  cancel:               'Cancel',
  save:                 'Save',
  edit:                 'Edit',
  delete:               'Delete',
  search:               'Search...',
  close:                'Close',
  confirm:              'Confirm',
  retry:                'Retry',
  view_all:             'View All',
  back:                 'Back',
  next:                 'Next',
  previous:             'Previous',
  refresh:              'Refresh',
  yes:                  'Yes',
  no:                   'No',
  ok:                   'OK',
  select:               'Select',

  // ── Status / Error Messages ───────────────────────────────────────────────
  success:              'Success',
  error:                'Error',
  warning:              'Warning',
  network_error:        'Network connection error',
  unauthorized:         'Unauthorized access',
  server_error:         'Server error, please try again',
  no_data_found:        'No data available',
  page_not_found:       'Page Not Found',
  something_went_wrong: 'Something went wrong',
  try_again:            'Try Again',
  no_internet:          'No internet connection',

  // ── Landing Page ──────────────────────────────────────────────────────────
  hero_title:           'AI-Powered Smart Farming',
  hero_subtitle:        'Transform your agricultural practices with advanced AI soil analysis, crop recommendations, and multilingual support.',
  farmers_served:       'Farmers Served',
  ai_accuracy:          'AI Accuracy',
  crop_types:           'Crop Types',
  ai_support:           '24/7 AI Support',

  // ── Crops & Soil types ────────────────────────────────────────────────────
  wheat:                'Wheat',
  rice:                 'Rice',
  maize:                'Maize',
  cotton:               'Cotton',
  sugarcane:            'Sugarcane',
  black_soil:           'Black Soil',
  clay_soil:            'Clay Soil',
  sandy_soil:           'Sandy Soil',
  alluvial_soil:        'Alluvial Soil',

  // ── Numeric quality labels ────────────────────────────────────────────────
  excellent:            'Excellent',
  very_good:            'Very Good',
  good:                 'Good',
  fair:                 'Fair',
  poor:                 'Poor',

  // ── Phrase-based keys (used by History.tsx, FeedbackStates etc.) ──────────
  // These allow t('Analysis History') style calls to resolve correctly
  'Analysis History':   'Analysis History',
  'Browse, search, and manage all your previous soil analyses.': 'Browse, search, and manage all your previous soil analyses.',
  'No analysis records found': 'No analysis records found',
  'Run your first soil analysis to build a history of crop recommendations.': 'Run your first soil analysis to build a history of crop recommendations.',
  'Analyze Soil': 'Analyze Soil',
  'Unable to load history.': 'Unable to load history.',
  'There was an error retrieving your analysis records. Check your connection and try again.': 'There was an error retrieving your analysis records. Check your connection and try again.',
  'Analysis deleted successfully.': 'Analysis deleted successfully.',
  'Failed to delete. Please try again.': 'Failed to delete. Please try again.',
  'Report downloaded successfully!': 'Report downloaded successfully!',
  'Failed to download report. Please try again.': 'Failed to download report. Please try again.',
  'Retry': 'Retry',
  'Close': 'Close',
  'Confirm Delete': 'Confirm Delete',
  'View Details': 'View Details',
  'Download PDF': 'Download PDF',
  'Delete': 'Delete',
  'Save Changes': 'Save Changes',
  'Cancel': 'Cancel',
  'Search': 'Search',
};

// ── Session-level memory cache ────────────────────────────────────────────────
const memoryCache: Record<string, Record<string, string>> = {
  en: ENGLISH_DICTIONARY,
};

class TranslationService {
  async getTranslations(lang: string): Promise<Record<string, string>> {
    const code = normalizeLangCode(lang);

    if (code === 'en') return ENGLISH_DICTIONARY;

    // 1. Memory cache
    if (memoryCache[code] && Object.keys(memoryCache[code]).length > 5) {
      return memoryCache[code];
    }

    // 2. LocalStorage cache
    try {
      const stored = localStorage.getItem(`agroai_tr_${code}`);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>;
        if (parsed && Object.keys(parsed).length > 5) {
          memoryCache[code] = { ...ENGLISH_DICTIONARY, ...parsed };
          return memoryCache[code];
        }
      }
    } catch (_) {}

    // 2.5 Offline built-in dictionary (works even without Sarvam AI API key)
    const offline = OFFLINE_TRANSLATIONS[code] || {};

    // 3. Backend (PostgreSQL → Sarvam AI pipeline)
    try {
      const backendData = await translationsAPI.getTranslations(code);
      const dict: Record<string, string> = {};

      if (backendData && typeof backendData === 'object') {
        const src = (backendData as any).translations || backendData;
        Object.entries(src).forEach(([k, v]) => {
          if (typeof v === 'string' && v.trim()) {
            // Only use backend value if it differs from English (i.e., it's actually translated)
            const englishValue = ENGLISH_DICTIONARY[k];
            if (!englishValue || v !== englishValue) {
              dict[k] = v;
            }
          }
        });
      }

      // Merge: ENGLISH_DICTIONARY < offline < backend (non-English) translations
      const merged = { ...ENGLISH_DICTIONARY, ...offline, ...dict };
      memoryCache[code] = merged;
      // Cache if we have real translations (either offline or backend)
      const hasTranslations = Object.keys(offline).length > 0 || Object.keys(dict).length > 0;
      if (hasTranslations) {
        try { localStorage.setItem(`agroai_tr_${code}`, JSON.stringify(merged)); } catch (_) {}
      }
      return merged;
    } catch (err) {
      console.warn(`[i18n] Backend fetch failed for "${code}", using offline dictionary.`, err);
      const merged = { ...ENGLISH_DICTIONARY, ...offline };
      memoryCache[code] = merged;
      return merged;
    }
  }

  /** Invalidate cached translations for a given language so next request re-fetches */
  invalidateCache(code: string): void {
    delete memoryCache[code];
    try { localStorage.removeItem(`agroai_tr_${code}`); } catch (_) {}
  }

  /** Humanize a translation key as last-resort fallback */
  humanizeKey(key: string): string {
    if (!key) return '';
    if (ENGLISH_DICTIONARY[key]) return ENGLISH_DICTIONARY[key];
    return key
      .replace(/[_\-.]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}

export const translationService = new TranslationService();
