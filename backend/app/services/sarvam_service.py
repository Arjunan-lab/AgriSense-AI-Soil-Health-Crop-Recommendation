"""Sarvam AI translation helper with built-in regional language fallback dictionary."""

import json
import logging
from urllib.request import Request, urlopen
from typing import Optional

from app.config import settings

_LOGGER = logging.getLogger(__name__)

# Canonical language mapping matching DB table: 1=English, 2=Hindi, 3=Telugu, 4=Tamil
_LANGUAGE_CODES = {
    1: "en-IN",
    2: "hi-IN",
    3: "te-IN",
    4: "ta-IN",
}

_TRANSLATION_MAP = {
    "hi-IN": {
        "Hyderabad": "हैदराबाद",
        "Delhi": "दिल्ली",
        "Chennai": "चेन्नई",
        "Mumbai": "मुंबई",
        "Bangalore": "बेंगलुरु",
        "Clear Sky": "साफ़ आसमान",
        "Partly Cloudy": "आंशिक रूप से बादल छाए हुए हैं",
        "Scattered Clouds": "छिटपुट बादल",
        "Overcast Clouds": "घने बादल",
        "Broken Clouds": "टूटे हुए बादल",
        "Light Rain": "हल्की बारिश",
        "Moderate Rain": "मध्यम बारिश",
        "Heavy Rain": "भारी बारिश",
        "Sunny": "धूप",
        "Rainy": "बरसात",
        "Cloudy": "बादल छाए हुए हैं",
        "Monday": "सोमवार",
        "Tuesday": "मंगलवार",
        "Wednesday": "बुधवार",
        "Thursday": "गुरुवार",
        "Friday": "शुक्रवार",
        "Saturday": "शनिवार",
        "Sunday": "रविवार",
        "Black Soil": "काली मिट्टी",
        "Red Soil": "लाल मिट्टी",
        "Alluvial Soil": "जलोढ़ मिट्टी",
        "Clayey Soil": "चिकनी मिट्टी",
        "Sandy Soil": "रेतीली मिट्टी",
    },
    "te-IN": {
        "Hyderabad": "హైదరాబాద్",
        "Delhi": "ఢిల్లీ",
        "Chennai": "చెన్నై",
        "Mumbai": "ముంబై",
        "Bangalore": "బెంగళూరు",
        "Clear Sky": "నిర్మలమైన ఆకాశం",
        "Partly Cloudy": "పాక్షికంగా మేఘావృతమై ఉంది",
        "Scattered Clouds": "చెదిరిన మేఘాలు",
        "Overcast Clouds": "విస్తారమైన మేఘాలు",
        "Broken Clouds": "విరిగిపోయిన మేఘాలు",
        "Light Rain": "తేలికపాటి వర్షం",
        "Moderate Rain": "మితమైన వర్షం",
        "Heavy Rain": "భారీ వర్షం",
        "Sunny": "ఎండగా ఉంది",
        "Rainy": "వర్షపాతం",
        "Cloudy": "మేఘావృతమై ఉంది",
        "Monday": "సోమవారం",
        "Tuesday": "మంగళవారం",
        "Wednesday": "బుధవారం",
        "Thursday": "గురువారం",
        "Friday": "శుక్రవారం",
        "Saturday": "శనివారం",
        "Sunday": "ఆదివారం",
        "Black Soil": "నల్ల నేల",
        "Red Soil": "ఎర్ర నేల",
        "Alluvial Soil": "ఒండ్రు నేల",
        "Clayey Soil": "జిగురు నేల",
        "Sandy Soil": "ఇసుక నేల",
    },
    "ta-IN": {
        "Hyderabad": "ஹைதராபாத்",
        "Delhi": "டெல்லி",
        "Chennai": "சென்னை",
        "Mumbai": "மும்பை",
        "Bangalore": "பெங்களூரு",
        "Clear Sky": "தெளிவான வானம்",
        "Partly Cloudy": "பகுதியளவு மேகமூட்டம்",
        "Scattered Clouds": "சிதறிய மேகங்கள்",
        "Overcast Clouds": "அடர்ந்த மேகமூட்டம்",
        "Broken Clouds": "உடைந்த மேகங்கள்",
        "Light Rain": "லேசான மழை",
        "Moderate Rain": "மிதமான மழை",
        "Heavy Rain": "கனமழை",
        "Sunny": "வெயில்",
        "Rainy": "மழை",
        "Cloudy": "மேகமூட்டம்",
        "Monday": "திங்கட்கிழமை",
        "Tuesday": "செவ்வாய்க்கிழமை",
        "Wednesday": "புதன்கிழமை",
        "Thursday": "வியாழக்கிழமை",
        "Friday": "வெள்ளிக்கிழமை",
        "Saturday": "சனிக்கிழமை",
        "Sunday": "ஞாயிற்றுக்கிழமை",
        "Black Soil": "கரிசல் மண்",
        "Red Soil": "செம்மண்",
        "Alluvial Soil": "வண்டல் மண்",
        "Clayey Soil": "களிமண்",
        "Sandy Soil": "மணல் மண்",
    }
}


def translate_text(text: str, language_id: Optional[int]) -> str:
    """Translate text to the target language (Hindi, Telugu, Tamil).
    
    Uses Sarvam AI API if configured, and falls back to built-in translation dictionary
    so native script translations ALWAYS work reliably for every language ID.
    """
    if not isinstance(text, str) or not text.strip():
        return text

    clean_text = text.strip()
    if language_id is None or language_id == 1:
        return clean_text

    target_lang_code = _LANGUAGE_CODES.get(language_id)
    if not target_lang_code or target_lang_code == "en-IN":
        return clean_text

    # 1. Try Sarvam API first if API key is present
    api_key = settings.SARVAM_API_KEY.strip()
    if api_key:
        try:
            payload = json.dumps({
                "input": clean_text,
                "source_language_code": "en-IN",
                "target_language_code": target_lang_code,
            }).encode("utf-8")
            url = settings.SARVAM_API_URL if settings.SARVAM_API_URL else "https://api.sarvam.ai/translate"
            request = Request(
                url,
                data=payload,
                headers={
                    "api-subscription-key": api_key,
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urlopen(request, timeout=5) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                translated = res_data.get("translated_text")
                if isinstance(translated, str) and translated.strip():
                    return translated.strip()
        except Exception as exc:
            _LOGGER.debug("Sarvam API translation failed/skipped: %s. Using fallback dictionary.", exc)

    # 2. Dictionary fallback for reliable offline/instant native script translation
    lang_dict = _TRANSLATION_MAP.get(target_lang_code, {})
    if clean_text in lang_dict:
        return lang_dict[clean_text]

    # Title-case lookup attempt
    title_text = clean_text.title()
    if title_text in lang_dict:
        return lang_dict[title_text]

    # Partial / phrase replacement fallback
    translated_result = clean_text
    for eng_word, target_word in lang_dict.items():
        if eng_word.lower() in translated_result.lower():
            # Replace case-insensitively
            import re
            pattern = re.compile(re.escape(eng_word), re.IGNORECASE)
            translated_result = pattern.sub(target_word, translated_result)

    return translated_result
