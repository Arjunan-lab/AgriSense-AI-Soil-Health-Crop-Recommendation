from collections.abc import Generator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.dependencies import get_current_user, get_db
from app.models import ChatHistory, Feedback, Language, PredictionHistory, User, UserRole
from app.routes.admin_users import router as admin_users_router


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(dbapi_connection, _connection_record):
        dbapi_connection.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def admin_user(db_session: Session) -> User:
    language = Language(language_name="English", language_code="en", is_default=True)
    admin = User(
        username="Admin",
        email="admin@example.com",
        hashed_password="hashed",
        role=UserRole.ADMIN.value,
        status="active",
        language=language,
    )
    db_session.add_all([language, admin])
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture()
def client(db_session: Session, admin_user: User) -> Generator[TestClient, None, None]:
    app = FastAPI()
    app.include_router(admin_users_router)

    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    def override_get_current_user() -> User:
        return admin_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    with TestClient(app) as test_client:
        yield test_client


def create_farmer(db: Session, email: str = "farmer@example.com") -> User:
    language = db.query(Language).filter(Language.language_code == "en").first()
    user = User(
        username="Farmer",
        email=email,
        hashed_password="hashed",
        role=UserRole.FARMER.value,
        status="active",
        language=language,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_admin_update_role_api_updates_role(client: TestClient, db_session: Session):
    user = create_farmer(db_session)

    response = client.patch(f"/admin/users/{user.id}/role", json={"role": " Admin "})

    assert response.status_code == 200
    assert response.json()["role"] == UserRole.ADMIN.value
    assert db_session.get(User, user.id).role == UserRole.ADMIN.value


def test_admin_delete_user_api_removes_user_and_dependents(
    client: TestClient,
    db_session: Session,
):
    user = create_farmer(db_session)
    prediction = PredictionHistory(
        user_id=user.id,
        soil_image_path="uploads/test.jpg",
        soil_type="Loamy",
        soil_confidence=0.95,
        nitrogen=80,
        phosphorus=40,
        potassium=30,
        ph=6.5,
        organic_carbon=0.7,
        electrical_conductivity=0.4,
        temperature=26,
        humidity=70,
        soil_health="Good",
        soil_health_score=82,
        soil_fertility_status="Fertile",
        nutrient_deficiencies=[],
        recommended_crops=[],
        recommended_fertilizers=[],
    )
    db_session.add(prediction)
    db_session.commit()
    db_session.refresh(prediction)

    db_session.add_all(
        [
            ChatHistory(
                user_id=user.id,
                prediction_history_id=prediction.id,
                user_message="What should I grow?",
                assistant_response="Rice",
            ),
            Feedback(user_id=user.id, rating=5, comment="Helpful"),
        ]
    )
    db_session.commit()

    response = client.delete(f"/admin/users/{user.id}")

    assert response.status_code == 200
    assert response.json() == {"message": "User deleted successfully"}
    assert db_session.get(User, user.id) is None
    assert db_session.query(ChatHistory).filter(ChatHistory.user_id == user.id).count() == 0
    assert db_session.query(Feedback).filter(Feedback.user_id == user.id).count() == 0
    assert db_session.query(PredictionHistory).filter(PredictionHistory.user_id == user.id).count() == 0
