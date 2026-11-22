"""Seed script for Multilingual static UI text entries."""

from app.database import SessionLocal
from app.models import Multilingual

STATIC_UI_TRANSLATIONS = [
    {
        "key": "nav_dashboard",
        "english": "Dashboard",
        "hindi": "डैशबोर्ड",
        "telugu": "డాష్‌బోర్డ్",
        "tamil": "டாஷ்போர்டு",
    },
    {
        "key": "nav_weather",
        "english": "Weather",
        "hindi": "मौसम",
        "telugu": "వాతావరణం",
        "tamil": "வானிலை",
    },
    {
        "key": "nav_soil_analysis",
        "english": "Soil Analysis",
        "hindi": "मृदा विश्लेषण",
        "telugu": "నేల విశ్లేషణ",
        "tamil": "மண் பகுப்பாய்வு",
    },
    {
        "key": "nav_profile",
        "english": "Profile",
        "hindi": "प्रोफ़ाइल",
        "telugu": "ప్రొఫైల్",
        "tamil": "சுயவிவரம்",
    },
    {
        "key": "btn_login",
        "english": "Login",
        "hindi": "लॉग इन करें",
        "telugu": "లాగిన్ చేయండి",
        "tamil": "உள்நுழையவும்",
    },
    {
        "key": "btn_logout",
        "english": "Logout",
        "hindi": "लॉग आउट करें",
        "telugu": "లాగ్ అవుట్ చేయండి",
        "tamil": "வெளியేறவும்",
    },
    {
        "key": "lbl_submit",
        "english": "Submit",
        "hindi": "जमा करें",
        "telugu": "సమర్పించు",
        "tamil": "சமர்ப்பிக்கவும்",
    },
    {
        "key": "lbl_cancel",
        "english": "Cancel",
        "hindi": "रद्द करें",
        "telugu": "రద్దు చేయి",
        "tamil": "ரத்து செய்யுபவும்",
    },
    {
        "key": "lbl_search_location",
        "english": "Search Location",
        "hindi": "स्थान खोजें",
        "telugu": "స్థానాన్ని శోధించండి",
        "tamil": "இடத்தைத் தேடுங்கள்",
    },
    {
        "key": "lbl_5day_forecast",
        "english": "5-Day Forecast",
        "hindi": "5-दिवसीय पूर्वानुमान",
        "telugu": "5-రోజుల వాతావరణ అంచనా",
        "tamil": "5 நாள் வானிலை முன்னறிவிப்பு",
    },
]

def seed_multilingual():
    db = SessionLocal()
    try:
        for item in STATIC_UI_TRANSLATIONS:
            entry = db.query(Multilingual).filter(Multilingual.key == item["key"]).first()
            if not entry:
                db.add(Multilingual(**item))
        db.commit()
        print("[OK] Multilingual static UI text entries successfully seeded!")
    except Exception as exc:
        db.rollback()
        print(f"[X] Failed to seed multilingual table: {exc}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_multilingual()
