/**
 * fieldLabels.ts
 * ---------------
 * Static i18n map for all API field label keys across all 23 supported Indian languages.
 *
 * The backend always returns canonical English JSON keys (e.g. "predicted_soil", "confidence").
 * This file provides the localized display label for each key based on the user preferred language.
 *
 * Usage:
 *   import { getFieldLabel } from '@/i18n/fieldLabels';
 *   const label = getFieldLabel('predicted_soil', 'Punjabi'); // → "ਅਨੁਮਾਨਿਤ ਮਿੱਟੀ"
 *
 * Or use the hook:
 *   const label = useFieldLabel('predicted_soil'); // auto-resolves current language
 *
 * Sources: Derived from backend app/localization/*.py FIELD_LABELS dictionaries.
 */

export type SupportedLanguage =
  | 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Bengali' | 'Marathi'
  | 'Gujarati' | 'Kannada' | 'Malayalam' | 'Punjabi' | 'Odia' | 'Assamese'
  | 'Urdu' | 'Sanskrit' | 'Konkani' | 'Maithili' | 'Nepali' | 'Kashmiri'
  | 'Dogri' | 'Sindhi' | 'Manipuri' | 'Bodo' | 'Santali';

export type FieldLabelKey =
  | 'predicted_soil' | 'confidence' | 'probabilities' | 'recommended_crop'
  | 'recommended_crops' | 'rank' | 'crop' | 'suitability' | 'soil_health_score'
  | 'soil_health_class' | 'soil_fertility' | 'nutrient_deficiency' | 'recommendations'
  | 'crop_reason' | 'confidence_level' | 'weather_data' | 'temperature' | 'humidity'
  | 'rainfall' | 'location_name' | 'city' | 'district' | 'state' | 'country'
  | 'weather_condition' | 'analysis_time' | 'analysis_id' | 'processing_time_ms';

type LabelMap = Partial<Record<SupportedLanguage, string>>;

export const FIELD_LABELS: Record<FieldLabelKey, LabelMap> = {
  predicted_soil: {
    English: 'Predicted Soil', Hindi: 'अनुमानित मिट्टी', Telugu: 'అంచనా వేసిన నేల',
    Tamil: 'கணிக்கப்பட்ட மண்', Bengali: 'পূর্বানুমানিত মাটি', Marathi: 'अंदाजित माती',
    Gujarati: 'અનુમાનિત જમીન', Kannada: 'ಅಂದಾಜು ಮಣ್ಣು', Malayalam: 'കണ്ടുപിടിക്കപ്പെട്ട മണ്ണ്',
    Punjabi: 'ਅਨੁਮਾਨਿਤ ਮਿੱਟੀ', Odia: 'ଅନୁମାନିତ ମାଟି', Assamese: 'অনুমানিত মাটি',
    Urdu: 'متوقع مٹی', Sanskrit: 'अनुमानिता मृत्तिका', Konkani: 'अंदाजिलेली माती',
    Maithili: 'अनुमानित माटि', Nepali: 'अनुमानित माटो', Kashmiri: 'اندازیا مٹی',
    Dogri: 'अनुमानत मिट्टी', Sindhi: 'اندازي مٽي', Manipuri: 'ꯀꯔꯤꯕ ꯃꯌꯥꯏ',
    Bodo: 'फोरनाय माटि', Santali: 'ᱯᱷᱮᱨᱟᱜ ᱢᱤᱫ',
  },
  confidence: {
    English: 'Confidence (%)', Hindi: 'विश्वास (%)', Telugu: 'విశ్వసనీయత (%)',
    Tamil: 'நம்பகத்தன்மை (%)', Bengali: 'আস্থা (%)', Marathi: 'विश्वसनीयता (%)',
    Gujarati: 'વિશ્વાસ (%)', Kannada: 'ವಿಶ್ವಾಸಾರ್ಹತೆ (%)', Malayalam: 'ആത്മവിശ്വാസം (%)',
    Punjabi: 'ਭਰੋਸੇਯੋਗਤਾ (%)', Odia: 'ବିଶ୍ୱାସ (%)', Assamese: 'বিশ্বাসযোগ্যতা (%)',
    Urdu: 'اعتماد (%)', Sanskrit: 'विश्वसनीयता (%)', Konkani: 'विश्वासार्हता (%)',
    Maithili: 'विश्वसनीयता (%)', Nepali: 'विश्वसनीयता (%)', Kashmiri: 'اعتماد (%)',
    Dogri: 'भरोसेमंदी (%)', Sindhi: 'اعتماد (%)', Manipuri: 'ꯆꯤꯟꯒꯕ (%)',
    Bodo: 'बिसायखि (%)', Santali: 'ᱵᱤᱥᱣᱟᱥ (%)',
  },
  probabilities: {
    English: 'Probabilities', Hindi: 'संभावनाएं', Telugu: 'సంభావ్యతలు',
    Tamil: 'சாத்தியக்கூறுகள்', Bengali: 'সম্ভাবনাগুলি', Marathi: 'संभाव्यता',
    Gujarati: 'સંભાવ્યતા', Kannada: 'ಸಂಭಾವ್ಯತೆಗಳು', Malayalam: 'സാധ്യതകൾ',
    Punjabi: 'ਸੰਭਾਵਨਾਵਾਂ', Odia: 'ସଂଭାବ୍ୟତା', Assamese: 'সম্ভাৱনা',
    Urdu: 'احتمالات', Sanskrit: 'संभावनाः', Konkani: 'संभाव्यता',
    Maithili: 'संभावना', Nepali: 'सम्भाव्यताहरू', Kashmiri: 'امکانات',
    Dogri: 'संभावनाएं', Sindhi: 'امڪان', Manipuri: 'ꯑꯣꯏꯕꯒꯤ ꯆꯥꯟꯁ',
    Bodo: 'सम्भाव्यता', Santali: 'ᱦᱩᱠᱩᱢ',
  },
  recommended_crop: {
    English: 'Recommended Crop', Hindi: 'अनुशंसित फसल', Telugu: 'సిఫార్సు చేసిన పంట',
    Tamil: 'பரிந்துரைக்கப்பட்ட பயிர்', Bengali: 'প্রস্তাবিত ফসল', Marathi: 'शिफारस केलेले पीक',
    Gujarati: 'ભલામણ કરેલ પાક', Kannada: 'ಶಿಫಾರಸು ಬೆಳೆ', Malayalam: 'ശുപാർശ ചെയ്ത വിള',
    Punjabi: 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਫਸਲ', Odia: 'ସୁପାରିଶ ଫସଲ', Assamese: 'পৰামৰ্শিত শস্য',
    Urdu: 'تجویز کردہ فصل', Sanskrit: 'अनुशंसितः सस्यः', Konkani: 'शिफारस केलेलें पीक',
    Maithili: 'अनुशंसित फसल', Nepali: 'सिफारिस गरिएको बाली', Kashmiri: 'تجویز کردہ فصل',
    Dogri: 'सिफारश कीती फसल', Sindhi: 'سفارش ڪيل فصل', Manipuri: 'ꯄꯣꯛꯄꯥ ꯐꯥꯎꯕꯥ ꯑꯣꯕꯥ',
    Bodo: 'सुपारिस फसल', Santali: 'ᱥᱟᱯᱷᱟᱭ ᱜᱚᱬ',
  },
  recommended_crops: {
    English: 'Recommended Crops', Hindi: 'अनुशंसित फसलें', Telugu: 'సిఫార్సు చేసిన పంటలు',
    Tamil: 'பரிந்துரைக்கப்பட்ட பயிர்கள்', Bengali: 'প্রস্তাবিত ফসলসমূহ', Marathi: 'शिफारस केलेली पिके',
    Gujarati: 'ભલામણ કરેલ પાક', Kannada: 'ಶಿಫಾರಸು ಬೆಳೆಗಳು', Malayalam: 'ശുപാർശ ചെയ്ത വിളകൾ',
    Punjabi: 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀਆਂ ਫਸਲਾਂ', Odia: 'ସୁପାରିଶ ଫସଲ ତାଲିକା', Assamese: 'পৰামৰ্শিত শস্যসমূহ',
    Urdu: 'تجویز کردہ فصلیں', Sanskrit: 'अनुशंसिताः सस्याः', Konkani: 'शिफारस केलेलीं पिकां',
    Maithili: 'अनुशंसित फसलें', Nepali: 'सिफारिस गरिएका बालीहरू', Kashmiri: 'تجویز کردہ فصلیں',
    Dogri: 'सिफारश फसलां', Sindhi: 'سفارش ڪيل فصلون', Manipuri: 'ꯑꯣꯕꯥ ꯐꯥꯎꯕꯥꯁꯤꯡ',
    Bodo: 'सुपारिस फसलफोर', Santali: 'ᱥᱟᱯᱷᱟᱭ ᱜᱚᱬᱠꯛᱟ',
  },
  rank: {
    English: 'Rank', Hindi: 'श्रेणी (रैंक)', Telugu: 'ర్యాంకు',
    Tamil: 'தரவரிசை', Bengali: 'ক্রম', Marathi: 'क्रमांक',
    Gujarati: 'ક્રમ', Kannada: 'ಶ್ರೇಣಿ', Malayalam: 'റാങ്ക്',
    Punjabi: 'ਦਰਜਾ (ਰੈਂਕ)', Odia: 'ଶ୍ରେଣୀ', Assamese: 'ক্ৰম',
    Urdu: 'درجہ', Sanskrit: 'क्रमः', Konkani: 'क्रमांक',
    Maithili: 'क्रम', Nepali: 'दर्जा', Kashmiri: 'درجہ',
    Dogri: 'दर्जा', Sindhi: 'درجو', Manipuri: 'ꯅꯝꯕꯒꯤ ꯆꯥꯗꯥ',
    Bodo: 'क्रम', Santali: 'ᱠᱷᱚᱬᱚ',
  },
  crop: {
    English: 'Crop', Hindi: 'फसल', Telugu: 'పంట',
    Tamil: 'பயிர்', Bengali: 'ফসল', Marathi: 'पीक',
    Gujarati: 'પાક', Kannada: 'ಬೆಳೆ', Malayalam: 'വിള',
    Punjabi: 'ਫਸਲ', Odia: 'ଫସଲ', Assamese: 'শস্য',
    Urdu: 'فصل', Sanskrit: 'सस्यः', Konkani: 'पीक',
    Maithili: 'फसल', Nepali: 'बाली', Kashmiri: 'فصل',
    Dogri: 'फसल', Sindhi: 'فصل', Manipuri: 'ꯐꯥꯎꯕꯥ',
    Bodo: 'फसल', Santali: 'ᱜᱚᱬ',
  },
  suitability: {
    English: 'Suitability', Hindi: 'उपयुक्तता', Telugu: 'అనుకూలత',
    Tamil: 'பொருத்தம்', Bengali: 'উপযুক্ততা', Marathi: 'योग्यता',
    Gujarati: 'યોગ્યતા', Kannada: 'ಸೂಕ್ತತೆ', Malayalam: 'അനുയോജ്യത',
    Punjabi: 'ਢੁਕਵਾਂਪਣ', Odia: 'ଉପଯୁକ୍ତତା', Assamese: 'উপযুক্ততা',
    Urdu: 'مناسبت', Sanskrit: 'उपयुक्तता', Konkani: 'उपयुक्तता',
    Maithili: 'उपयुक्तता', Nepali: 'उपयुक्तता', Kashmiri: 'مناسبت',
    Dogri: 'उपयुक्तता', Sindhi: 'مناسبت', Manipuri: 'ꯍꯥꯏꯔꯕꯥ',
    Bodo: 'उपयुक्तता', Santali: 'ᱡᱚᱜᱚ',
  },
  soil_health_score: {
    English: 'Soil Health Score', Hindi: 'मिट्टी स्वास्थ्य स्कोर', Telugu: 'నేల ఆరోగ్యం స్కోరు',
    Tamil: 'மண் வள மதிப்பெண்', Bengali: 'মাটির স্বাস্থ্য স্কোর', Marathi: 'मातीचे आरोग्य स्कोर',
    Gujarati: 'જમીન સ્વાસ્થ્ય સ્કોર', Kannada: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸ್ಕೋರ್', Malayalam: 'മണ്ണ് ആരോഗ്യ സ്കോർ',
    Punjabi: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਦਾ ਸਕੋਰ', Odia: 'ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ସ୍କୋର', Assamese: 'মাটিৰ স্বাস্থ্য স্কোৰ',
    Urdu: 'مٹی صحت اسکور', Sanskrit: 'मृत्तिका स्वास्थ्य अङ्कः', Konkani: 'माती आरोग्य स्कोर',
    Maithili: 'माटि स्वास्थ्य स्कोर', Nepali: 'माटो स्वास्थ्य स्कोर', Kashmiri: 'مٹی صحت سکور',
    Dogri: 'मिट्टी सेहत स्कोर', Sindhi: 'مٽي صحت اسڪور', Manipuri: 'ꯃꯤ ꯍꯦꯜꯊ ꯑꯣꯢꯅꯥ',
    Bodo: 'माटि गुनो स्कोर', Santali: 'ᱢᱤᱫ ᱦᱤᱛᱟᱹ ᱮᱠᱟ',
  },
  soil_health_class: {
    English: 'Soil Health Class', Hindi: 'मिट्टी स्वास्थ्य वर्ग', Telugu: 'నేల ఆరోగ్యం వర్గం',
    Tamil: 'மண் வள வகை', Bengali: 'মাটির স্বাস্থ্য শ্রেণী', Marathi: 'मातीचे आरोग्य वर्ग',
    Gujarati: 'જમીન સ્વાસ્થ્ય વર્ગ', Kannada: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವರ್ಗ', Malayalam: 'മണ്ണ് ആരോഗ്യ വിഭാഗം',
    Punjabi: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਦਾ ਦਰਜਾ', Odia: 'ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ଶ୍ରେଣୀ', Assamese: 'মাটিৰ স্বাস্থ্য শ্ৰেণী',
    Urdu: 'مٹی صحت درجہ', Sanskrit: 'मृत्तिका स्वास्थ्य वर्गः', Konkani: 'माती आरोग्य वर्ग',
    Maithili: 'माटि स्वास्थ्य वर्ग', Nepali: 'माटो स्वास्थ्य वर्ग', Kashmiri: 'مٹی صحت درجہ',
    Dogri: 'मिट्टी सेहत दर्जा', Sindhi: 'مٽي صحت درجو', Manipuri: 'ꯃꯤ ꯍꯦꯜꯊ ꯕꯥꯔꯒ',
    Bodo: 'माटि स्वास्थ्य श्रेणी', Santali: 'ᱢᱤᱫ ᱦᱤᱛᱟᱹ ᱵᱟᱨᱜ',
  },
  soil_fertility: {
    English: 'Soil Fertility', Hindi: 'मिट्टी की उर्वरता', Telugu: 'నేల సారం',
    Tamil: 'மண் வளம்', Bengali: 'মাটির উর্বরতা', Marathi: 'मातीची सुपीकता',
    Gujarati: 'જમીનની ફળદ્રુપતા', Kannada: 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ', Malayalam: 'മണ്ണ് ഫലഭൂയിഷ്ഠത',
    Punjabi: 'ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ', Odia: 'ମାଟି ଉର୍ବରତା', Assamese: 'মাটিৰ উৰ্বৰতা',
    Urdu: 'مٹی کی زرخیزی', Sanskrit: 'मृत्तिका उर्वरता', Konkani: 'माती सुपीकता',
    Maithili: 'माटिक उपजाऊपन', Nepali: 'माटोको उर्वरता', Kashmiri: 'مٹی زرخیزی',
    Dogri: 'मिट्टी उपजाऊपन', Sindhi: 'مٽي زرخيزي', Manipuri: 'ꯃꯤ ꯐꯥꯑꯣꯕꯥ',
    Bodo: 'माटि उर्वरता', Santali: 'ᱢᱤᱫ ᱵᱳᱱᱳᱭ',
  },
  nutrient_deficiency: {
    English: 'Nutrient Deficiency', Hindi: 'पोषक तत्वों की कमी', Telugu: 'పోషకాల లోపం',
    Tamil: 'ஊட்டச்சத்து குறைபாடு', Bengali: 'পুষ্টির ঘাটতি', Marathi: 'पोषक तत्वांची कमतरता',
    Gujarati: 'પોષક તત્ત્વોની ઉણપ', Kannada: 'ಪೋಷಕಾಂಶ ಕೊರತೆ', Malayalam: 'പോഷക ദൗർലഭ്യം',
    Punjabi: 'ਖੁਰਾਕੀ ਤੱਤਾਂ ਦੀ ਘਾਟ', Odia: 'ପୋଷଣ ଅଭାବ', Assamese: 'পুষ্টিৰ ঘাটি',
    Urdu: 'غذائی کمی', Sanskrit: 'पोषकतत्त्वन्यूनता', Konkani: 'पोषकतत्त्वांची उणीव',
    Maithili: 'पोषण न्यूनता', Nepali: 'पोषक तत्व कमी', Kashmiri: 'غذائی کمی',
    Dogri: 'पोशक तत्त्वां दी घाटी', Sindhi: 'غذائي کمي', Manipuri: 'ꯅꯨꯠꯔꯤꯌꯦꯟꯇ ꯈꯩꯑꯣꯕꯥ',
    Bodo: 'पोषण अभाव', Santali: 'ᱡᱚᱜᱚ ᱟᱴᱟᱜ',
  },
  recommendations: {
    English: 'Recommendations', Hindi: 'कृषि सलाह', Telugu: 'వ్యవసాయ సలహాలు',
    Tamil: 'விவசாய ஆலோசனைகள்', Bengali: 'কৃষি পরামর্শ', Marathi: 'शेती सल्ला',
    Gujarati: 'ખેતી સલાહ', Kannada: 'ಕೃಷಿ ಸಲಹೆ', Malayalam: 'കൃഷി ഉപദേശം',
    Punjabi: 'ਖੇਤੀਬਾੜੀ ਸਲਾਹ', Odia: 'ଚାଷ ପରାମର୍ଶ', Assamese: 'কৃষি পৰামৰ্শ',
    Urdu: 'زرعی مشورے', Sanskrit: 'कृषि अनुशंसाः', Konkani: 'शेती सल्ला',
    Maithili: 'कृषि सलाह', Nepali: 'कृषि सल्लाह', Kashmiri: 'زرعی مشورے',
    Dogri: 'खेती सलाह', Sindhi: 'زراعت مشورو', Manipuri: 'ꯐꯥꯕꯤꯗꯥ ꯌꯥꯎꯅꯥ',
    Bodo: 'कृषि सलाह', Santali: 'ᱪᱷᱟᱸᱪ ᱵᱟᱲᱟᱭ',
  },
  crop_reason: {
    English: 'Crop Reason', Hindi: 'सिफारिश का कारण', Telugu: 'సిఫార్సు కారణం',
    Tamil: 'பரிந்துரைக்கான காரணம்', Bengali: 'প্রস্তাবের কারণ', Marathi: 'शिफारशीचे कारण',
    Gujarati: 'ભલામણ કારણ', Kannada: 'ಶಿಫಾರಸು ಕಾರಣ', Malayalam: 'ശുപാർശ കാരണം',
    Punjabi: 'ਸਿਫ਼ਾਰਸ਼ ਦਾ ਕਾਰਨ', Odia: 'ସୁପାରିଶ କାରଣ', Assamese: 'পৰামৰ্শৰ কাৰণ',
    Urdu: 'تجویز کی وجہ', Sanskrit: 'अनुशंसा कारणम्', Konkani: 'शिफारशीचें कारण',
    Maithili: 'सिफारिश के कारण', Nepali: 'सिफारिसको कारण', Kashmiri: 'تجویز کی وجہ',
    Dogri: 'सिफारश दा कारण', Sindhi: 'سفارش جو سبب', Manipuri: 'ꯄꯣꯛꯄꯥ ꯊꯥꯗꯣꯛ',
    Bodo: 'सुपारिस कारण', Santali: 'ᱥᱟᱯᱷᱟᱭ ᱠᱟᱨᱚᱬ',
  },
  confidence_level: {
    English: 'Confidence Level', Hindi: 'विश्वास स्तर', Telugu: 'నమ్మకం స్థాయి',
    Tamil: 'நம்பகத்தன்மை நிலை', Bengali: 'আস্থার মাত্রা', Marathi: 'विश्वसनीयता पातळी',
    Gujarati: 'વિશ્વાસ સ્તર', Kannada: 'ವಿಶ್ವಾಸ ಮಟ್ಟ', Malayalam: 'ആത്മവിശ്വാസ നില',
    Punjabi: 'ਭਰੋਸੇ ਦਾ ਪੱਧਰ', Odia: 'ବିଶ୍ୱାସ ସ୍ତର', Assamese: 'বিশ্বাসযোগ্যতা স্তৰ',
    Urdu: 'اعتماد کی سطح', Sanskrit: 'विश्वसनीयता स्तरः', Konkani: 'विश्वासाची पातळी',
    Maithili: 'विश्वास स्तर', Nepali: 'विश्वास स्तर', Kashmiri: 'اعتماد کی سطح',
    Dogri: 'भरोसे दा पद्धर', Sindhi: 'اعتماد جي سطح', Manipuri: 'ꯆꯤꯟꯒꯕ ꯊꯥꯗꯣꯛ',
    Bodo: 'बिसायखि स्तर', Santali: 'ᱵᱤᱥᱣᱟᱥ ᱛᱮ',
  },
  weather_data: {
    English: 'Weather Data', Hindi: 'मौसम की जानकारी', Telugu: 'వాతావరణ సమాచారం',
    Tamil: 'வானிலை தகவல்', Bengali: 'আবহাওয়া তথ্য', Marathi: 'हवामान माहिती',
    Gujarati: 'હવામાન ડેટા', Kannada: 'ಹವಾಮಾನ ಮಾಹಿತಿ', Malayalam: 'കാലാവസ്ഥ വിവരങ്ങൾ',
    Punjabi: 'ਮੌਸਮ ਜਾਣਕਾਰੀ', Odia: 'ପାଣିପାଗ ତଥ୍ୟ', Assamese: 'বতৰৰ তথ্য',
    Urdu: 'موسمی معلومات', Sanskrit: 'वायुमण्डल सूचना', Konkani: 'हवामान माहिती',
    Maithili: 'मौसम जानकारी', Nepali: 'मौसम तथ्याङ्क', Kashmiri: 'موسمی معلومات',
    Dogri: 'मौसम जानकारी', Sindhi: 'موسم ڊيٽا', Manipuri: 'ꯀꯔꯤꯕꯤꯠ ꯗꯦꯇꯥ',
    Bodo: 'मौसम डाटा', Santali: 'ᱵᱟᱫᱽᱞᱟ ᱗ᱟᱛᱟ',
  },
  temperature: {
    English: 'Temperature (°C)', Hindi: 'तापमान (°C)', Telugu: 'ఉష్ణోగ్రత (°C)',
    Tamil: 'வெப்பநிலை (°C)', Bengali: 'তাপমাত্রা (°C)', Marathi: 'तापमान (°C)',
    Gujarati: 'તાપમાન (°C)', Kannada: 'ತಾಪಮಾನ (°C)', Malayalam: 'താപനില (°C)',
    Punjabi: 'ਤਾਪਮਾਨ (°C)', Odia: 'ତାପମାତ୍ରା (°C)', Assamese: 'তাপমাত্ৰা (°C)',
    Urdu: 'درجہ حرارت (°C)', Sanskrit: 'तापमानम् (°C)', Konkani: 'तापमान (°C)',
    Maithili: 'तापमान (°C)', Nepali: 'तापक्रम (°C)', Kashmiri: 'درجہ حرارت (°C)',
    Dogri: 'तापमान (°C)', Sindhi: 'درجه حرارت (°C)', Manipuri: 'ꯀꯅꯥꯏ ꯔꯤꯟꯕ (°C)',
    Bodo: 'तापमान (°C)', Santali: 'ᱜᱟᱸᱭ (°C)',
  },
  humidity: {
    English: 'Humidity (%)', Hindi: 'नमी (%)', Telugu: 'తేమ (%)',
    Tamil: 'ஈரப்பதம் (%)', Bengali: 'আর্দ্রতা (%)', Marathi: 'आर्द्रता (%)',
    Gujarati: 'ભેજ (%)', Kannada: 'ತೇವಾಂಶ (%)', Malayalam: 'ആർദ്രത (%)',
    Punjabi: 'ਨਮੀ (%)', Odia: 'ଆର୍ଦ୍ରତା (%)', Assamese: 'আৰ্দ্ৰতা (%)',
    Urdu: 'نمی (%)', Sanskrit: 'आर्द्रता (%)', Konkani: 'आर्द्रता (%)',
    Maithili: 'नमी (%)', Nepali: 'आर्द्रता (%)', Kashmiri: 'نمی (%)',
    Dogri: 'नमी (%)', Sindhi: 'نمي (%)', Manipuri: 'ꯅꯨꯡꯒꯔꯕꯥ (%)',
    Bodo: 'आर्द्रता (%)', Santali: 'ᱟᱹᱨᱛ (%)',
  },
  rainfall: {
    English: 'Rainfall (mm)', Hindi: 'वर्षा (मिमी)', Telugu: 'వర్షపాతం (మిమీ)',
    Tamil: 'மழைப்பொழிவு (மிமீ)', Bengali: 'বৃষ্টিপাত (মিমি)', Marathi: 'पाऊस (मिमी)',
    Gujarati: 'વરસાદ (મિ.મી.)', Kannada: 'ಮಳೆ (ಮಿ.ಮೀ.)', Malayalam: 'മഴ (മി.മി.)',
    Punjabi: 'ਮੀਂਹ/ਵਰਖਾ (ਮਿ.ਮੀ.)', Odia: 'ବର୍ଷା (ମି.ମି.)', Assamese: 'বৰষুণ (মি.মি.)',
    Urdu: 'بارش (ملی میٹر)', Sanskrit: 'वर्षा (मि.मी.)', Konkani: 'पाऊस (मिमी)',
    Maithili: 'वर्षा (मिमी)', Nepali: 'वर्षा (मिमी)', Kashmiri: 'بارش (ملی میٹر)',
    Dogri: 'मींह (मि.मी.)', Sindhi: 'مينهن (ملي ميٽر)', Manipuri: 'ꯇꯤꯟꯇ ꯊꯤꯕꯥ (ꯝꯝ)',
    Bodo: 'बोसोर (मि.मि.)', Santali: 'ᱵᱤᱨ (ᱢᱤᱢᱤ)',
  },
  location_name: {
    English: 'Location Name', Hindi: 'स्थान का नाम', Telugu: 'ప్రాంతం పేరు',
    Tamil: 'இடத்தின் பெயர்', Bengali: 'স্থানের নাম', Marathi: 'ठिकाणाचे नाव',
    Gujarati: 'સ્થળ નામ', Kannada: 'ಸ್ಥಳದ ಹೆಸರು', Malayalam: 'സ്ഥലത്തിന്റെ പേര്',
    Punjabi: 'ਇਲਾਕੇ ਦਾ ਨਾਂ', Odia: 'ସ୍ଥାନ ନାମ', Assamese: 'স্থানৰ নাম',
    Urdu: 'مقام کا نام', Sanskrit: 'स्थाननामम्', Konkani: 'जाग्याचें नाव',
    Maithili: 'स्थान नाम', Nepali: 'स्थानको नाम', Kashmiri: 'مقام کا نام',
    Dogri: 'थाँ दा नाँ', Sindhi: 'جاءِ جو نالو', Manipuri: 'ꯍꯧꯔꯕ ꯃꯤꯡ',
    Bodo: 'जायगा नां', Santali: 'ᱯᱚᱛᱚᱢ ᱧᱩᱛᱩᱢ',
  },
  city: {
    English: 'City', Hindi: 'शहर', Telugu: 'పట్టణం/నగరం',
    Tamil: 'நகரம்', Bengali: 'শহর', Marathi: 'शहर',
    Gujarati: 'શહેર', Kannada: 'ನಗರ', Malayalam: 'നഗരം',
    Punjabi: 'ਸ਼ਹਿਰ', Odia: 'ସହର', Assamese: 'চহৰ',
    Urdu: 'شہر', Sanskrit: 'नगरम्', Konkani: 'शहर',
    Maithili: 'शहर', Nepali: 'शहर', Kashmiri: 'شہر',
    Dogri: 'शहर', Sindhi: 'شهر', Manipuri: 'ꯅꯗꯣꯡꯒꯤ ꯐꯥꯑꯣꯅꯥ',
    Bodo: 'सहर', Santali: 'ᱱᱚᱜᱚᱨ',
  },
  district: {
    English: 'District', Hindi: 'जिला', Telugu: 'జిల్లా',
    Tamil: 'மாவட்டம்', Bengali: 'জেলা', Marathi: 'जिल्हा',
    Gujarati: 'જિલ્લો', Kannada: 'ಜಿಲ್ಲೆ', Malayalam: 'ജില്ല',
    Punjabi: 'ਜ਼ਿਲ੍ਹਾ', Odia: 'ଜିଲ୍ଲା', Assamese: 'জিলা',
    Urdu: 'ضلع', Sanskrit: 'जनपदः', Konkani: 'जिल्हो',
    Maithili: 'जिला', Nepali: 'जिल्ला', Kashmiri: 'ضلع',
    Dogri: 'जिला', Sindhi: 'ضلعو', Manipuri: 'ꯗꯤꯁ꯭ꯇ꯭ꯔꯤꯛꯇ',
    Bodo: 'जिला', Santali: 'ᱡᱤᱞᱟ',
  },
  state: {
    English: 'State', Hindi: 'राज्य', Telugu: 'రాష్ట్రం',
    Tamil: 'மாநிலம்', Bengali: 'রাজ্য', Marathi: 'राज्य',
    Gujarati: 'રાજ્ય', Kannada: 'ರಾಜ್ಯ', Malayalam: 'സംസ്ഥാനം',
    Punjabi: 'ਸੂਬਾ/ਰਾਜ', Odia: 'ରାଜ୍ୟ', Assamese: 'ৰাজ্য',
    Urdu: 'ریاست', Sanskrit: 'राज्यम्', Konkani: 'राज्य',
    Maithili: 'राज्य', Nepali: 'राज्य', Kashmiri: 'ریاست',
    Dogri: 'राज्य', Sindhi: 'رياست', Manipuri: 'ꯔꯥꯖꯌꯥ',
    Bodo: 'राज्य', Santali: 'ᱨᱟᱡ',
  },
  country: {
    English: 'Country', Hindi: 'देश', Telugu: 'దేశం',
    Tamil: 'நாடு', Bengali: 'দেশ', Marathi: 'देश',
    Gujarati: 'દેશ', Kannada: 'ದೇಶ', Malayalam: 'രാജ്യം',
    Punjabi: 'ਦੇਸ਼', Odia: 'ଦେଶ', Assamese: 'দেশ',
    Urdu: 'ملک', Sanskrit: 'देशः', Konkani: 'देश',
    Maithili: 'देश', Nepali: 'देश', Kashmiri: 'ملک',
    Dogri: 'देश', Sindhi: 'ملڪ', Manipuri: 'ꯃꯩꯂꯩ',
    Bodo: 'देश', Santali: 'ᱫᱮᱥ',
  },
  weather_condition: {
    English: 'Weather Condition', Hindi: 'मौसम की स्थिति', Telugu: 'వాతావరణ పరిస్థితి',
    Tamil: 'வானிலை நிலை', Bengali: 'আবহাওয়ার অবস্থা', Marathi: 'हवामान स्थिती',
    Gujarati: 'હવામાન સ્થિતિ', Kannada: 'ಹವಾಮಾನ ಸ್ಥಿತಿ', Malayalam: 'കാലാവസ്ഥ അവസ്ഥ',
    Punjabi: 'ਮੌਸਮ ਦਾ ਹਾਲ', Odia: 'ପାଣିପାଗ ଅବସ୍ଥା', Assamese: 'বতৰৰ অৱস্থা',
    Urdu: 'موسمی حالت', Sanskrit: 'वायुमण्डल अवस्था', Konkani: 'हवामान स्थिती',
    Maithili: 'मौसम स्थिति', Nepali: 'मौसम अवस्था', Kashmiri: 'موسمی حالت',
    Dogri: 'मौसम हाल', Sindhi: 'موسمي حالت', Manipuri: 'ꯀꯔꯤꯕ ꯊꯥꯗꯣꯛ',
    Bodo: 'मौसम हाल', Santali: 'ᱵᱟᱫᱽᱞᱟ ᱦᱟᱞ',
  },
  analysis_time: {
    English: 'Analysis Time', Hindi: 'विश्लेषण समय', Telugu: 'విశ్లేషణ సమయం',
    Tamil: 'பகுப்பாய்வு நேரம்', Bengali: 'বিশ্লেষণ সময়', Marathi: 'विश्लेषण वेळ',
    Gujarati: 'વિશ્લેષણ સમય', Kannada: 'ವಿಶ್ಲೇಷಣ ಸಮಯ', Malayalam: 'വിശകലന സമയം',
    Punjabi: 'ਜਾਂਚ ਦਾ ਸਮਾਂ', Odia: 'ବିଶ୍ଲେଷଣ ସମୟ', Assamese: 'বিশ্লেষণৰ সময়',
    Urdu: 'تجزیہ وقت', Sanskrit: 'विश्लेषण कालः', Konkani: 'विश्लेषण वेळ',
    Maithili: 'विश्लेषण समय', Nepali: 'विश्लेषण समय', Kashmiri: 'تجزیہ وقت',
    Dogri: 'जांच समां', Sindhi: 'تجزيو وقت', Manipuri: 'ꯑꯅꯥꯜꯥꯏꯁꯤꯁ ꯊꯝꯗꯣꯛ',
    Bodo: 'विश्लेषण समय', Santali: 'ᱵᱤᱥᱞᱮᱥᱚᱱ ᱯᱷᱮᱨ',
  },
  analysis_id: {
    English: 'Analysis ID', Hindi: 'विश्लेषण आईडी', Telugu: 'విశ్లేషణ ఐడీ',
    Tamil: 'பகுப்பாய்வு ஐடி', Bengali: 'বিশ্লেষণ আইডি', Marathi: 'विश्लेषण आयडी',
    Gujarati: 'વિશ્લેષણ ID', Kannada: 'ವಿಶ್ಲೇಷಣ ಐಡಿ', Malayalam: 'വിശകലന ID',
    Punjabi: 'ਜਾਂਚ ਆਈ.ਡੀ.', Odia: 'ବିଶ୍ଲେଷଣ ଆଇଡ଼ି', Assamese: 'বিশ্লেষণ আইডি',
    Urdu: 'تجزیہ شناخت', Sanskrit: 'विश्लेषण पहचान', Konkani: 'विश्लेषण आयडी',
    Maithili: 'विश्लेषण ID', Nepali: 'विश्लेषण ID', Kashmiri: 'تجزیہ شناخت',
    Dogri: 'जांच पहचान', Sindhi: 'تجزيو سڃاپ', Manipuri: 'ꯑꯅꯥꯜꯥꯏꯁꯤꯁ ID',
    Bodo: 'विश्लेषण ID', Santali: 'ᱵᱤᱥᱞᱮᱥᱚᱱ ID',
  },
  processing_time_ms: {
    English: 'Processing Time (ms)', Hindi: 'प्रसंस्करण समय (ms)', Telugu: 'ప్రాసెసింగ్ సమయం (ms)',
    Tamil: 'செயலாக்க நேரம் (ms)', Bengali: 'প্রক্রিয়াকরণ সময় (ms)', Marathi: 'प्रक्रिया वेळ (ms)',
    Gujarati: 'પ્રક્રિયા સમય (ms)', Kannada: 'ಸಂಸ್ಕರಣ ಸಮಯ (ms)', Malayalam: 'പ്രോസസ്സിംഗ് സമയം (ms)',
    Punjabi: 'ਪ੍ਰੋਸੈਸਿੰਗ ਸਮਾਂ (ms)', Odia: 'ପ୍ରକ୍ରିୟାକରଣ ସମୟ (ms)', Assamese: 'প্ৰক্ৰিয়াকৰণ সময় (ms)',
    Urdu: 'پروسیسنگ وقت (ms)', Sanskrit: 'प्रक्रिया कालः (ms)', Konkani: 'प्रक्रिया वेळ (ms)',
    Maithili: 'प्रसंस्करण समय (ms)', Nepali: 'प्रक्रिया समय (ms)', Kashmiri: 'پروسیسنگ وقت (ms)',
    Dogri: 'प्रोसेसिंग समां (ms)', Sindhi: 'پروسيسنگ وقت (ms)', Manipuri: 'ꯄꯨꯔꯣꯁꯦꯁꯤꯡ ꯊꯝ (ms)',
    Bodo: 'प्रक्रिया समय (ms)', Santali: 'ᱯᱨᱚᱥᱮᱥᱤᱝ ᱯᱷᱮᱨ (ms)',
  },
};

/**
 * Returns the localized label for a given field key and language.
 * Falls back to English label, then to the raw key if not found.
 */
export function getFieldLabel(key: string, language: string): string {
  const labels = FIELD_LABELS[key as FieldLabelKey];
  if (!labels) return key;
  return labels[language as SupportedLanguage] ?? labels['English'] ?? key;
}
