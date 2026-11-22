from sqlalchemy.orm import Session

from app.models import Language, Translation, TranslationKey


def get_translations(db: Session, language_code: str) -> dict:
    language = (
        db.query(Language)
        .filter(
            Language.language_code == language_code,
            Language.is_active == True,
        )
        .first()
    )

    if language is None:
        return {}

    translations = (
        db.query(Translation)
        .join(TranslationKey)
        .filter(Translation.language_id == language.id)
        .all()
    )

    response = {}

    for item in translations:
        response[item.translation_key.key] = item.translated_text

    return response