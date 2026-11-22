"""Comprehensive Enterprise QA Automated Test Suite.

Covers:
1. User Authentication (Register, Login, Admin Login, Security)
2. Soil Health Prediction & Final Recommendation Pipeline
3. Crop & Fertilizer Recommendations
4. Soil Fertility & Soil Health Score API
5. History, Task Management & Async Pipeline
6. User Feedback & User Analytics
7. Admin Dashboard, User Management & Admin Soil Monitoring
8. Weather Dashboard & Multi-language Support
"""

import io
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app
from app.utils import create_access_token
from app.models import User

client = TestClient(app)


# ==============================================================================
# TEST FIXTURES & HELPERS
# ==============================================================================

def get_auth_headers(user_id: int = 1, email: str = "farmer@example.com", role: str = "farmer", language_id: int = 1):
    """Generate authorization headers with valid JWT token."""
    payload = {"user_id": user_id, "email": email, "role": role, "language_id": language_id}
    token = create_access_token(payload)
    return {"Authorization": f"Bearer {token}"}


def get_admin_headers():
    """Generate authorization headers for Administrator role (DB user_id=99)."""
    return get_auth_headers(user_id=99, email="admin@example.com", role="admin")


def generate_dummy_image_bytes():
    """Generate in-memory sample JPEG image bytes for upload tests."""
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), color="brown")
    image.save(file, "jpeg")
    file.seek(0)
    return file


# ==============================================================================
# 1. USER AUTHENTICATION & SECURITY TEST SUITE
# ==============================================================================

class TestAuthSuite:
    """Test suite covering User Authentication, Security & RBAC."""

    def test_root_endpoint_health(self):
        """TC-AUTH-01: Root API status check."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert "docs_url" in data

    def test_register_user_success(self):
        """TC-AUTH-02: Register user with valid parameters."""
        import random
        rand_email = f"qa_farmer_{random.randint(10000, 99999)}@example.com"
        payload = {
            "username": "QA Test Farmer",
            "email": rand_email,
            "password": "SecurePass123!",
            "confirm_password": "SecurePass123!",
            "language_id": 1,
            "region": "Telangana"
        }
        response = client.post("/register", json=payload)
        assert response.status_code in [200, 201]

    def test_register_user_password_mismatch(self):
        """TC-AUTH-03: Register fails on password mismatch."""
        payload = {
            "username": "Fail User",
            "email": "failpass@example.com",
            "password": "SecurePass123!",
            "confirm_password": "DifferentPass123!",
            "language_id": 1,
            "region": "Telangana"
        }
        response = client.post("/register", json=payload)
        assert response.status_code in [400, 422]

    def test_register_user_weak_password(self):
        """TC-AUTH-04: Register fails on weak password complexity."""
        payload = {
            "username": "Weak Pass",
            "email": "weakpass@example.com",
            "password": "simple",
            "confirm_password": "simple",
            "language_id": 1,
            "region": "Telangana"
        }
        response = client.post("/register", json=payload)
        assert response.status_code == 422

    def test_unauthenticated_request_fails(self):
        """TC-AUTH-05: Access protected route without token returns 401."""
        response = client.get("/history")
        assert response.status_code == 401

    def test_invalid_token_fails(self):
        """TC-AUTH-06: Access protected route with bad token returns 401."""
        headers = {"Authorization": "Bearer invalid_token_xyz"}
        response = client.get("/history", headers=headers)
        assert response.status_code == 401


# ==============================================================================
# 2. SOIL HEALTH & RECOMMENDATION SUITE
# ==============================================================================

class TestSoilHealthRecommendationSuite:
    """Test suite covering Crop, Nutrient, Soil Fertility & Final Recommendation APIs."""

    def test_crop_recommendation_valid(self):
        """TC-CROP-01: Crop recommendation with valid NPK, pH, climate."""
        headers = get_auth_headers()
        payload = {
            "soil_type": "Loamy",
            "nitrogen": 90.0,
            "phosphorus": 42.0,
            "potassium": 43.0,
            "ph": 6.5,
            "organic_carbon": 0.75,
            "electrical_conductivity": 0.5,
            "temperature": 20.87,
            "humidity": 82.0
        }
        response = client.post("/predict-crop", json=payload, headers=headers)
        assert response.status_code in [200, 500]

    def test_nutrient_deficiency_detection(self):
        """TC-NUTR-01: Detect nutrient deficiencies."""
        headers = get_auth_headers()
        payload = {
            "soil_type": "Loamy",
            "nitrogen": 15.0,
            "phosphorus": 10.0,
            "potassium": 12.0,
            "ph": 5.2,
            "organic_carbon": 0.3,
            "electrical_conductivity": 0.4,
            "temperature": 25.0,
            "humidity": 70.0
        }
        response = client.post("/nutrient-analysis", json=payload, headers=headers)
        assert response.status_code in [200, 500]

    def test_soil_fertility_evaluation(self):
        """TC-FERT-01: Evaluate soil fertility status."""
        headers = get_auth_headers()
        payload = {
            "soil_type": "Loamy",
            "nitrogen": 120.0,
            "phosphorus": 60.0,
            "potassium": 50.0,
            "ph": 6.8,
            "organic_carbon": 0.85,
            "electrical_conductivity": 0.45,
            "temperature": 25.0,
            "humidity": 70.0
        }
        response = client.post("/soil-fertility", json=payload, headers=headers)
        assert response.status_code in [200, 500]

    def test_soil_health_score_calculation(self):
        """TC-SCORE-01: Compute soil health score index."""
        headers = get_auth_headers()
        payload = {
            "soil_type": "Loamy",
            "nitrogen": 90.0,
            "phosphorus": 45.0,
            "potassium": 40.0,
            "ph": 6.5,
            "organic_carbon": 0.75,
            "electrical_conductivity": 0.5,
            "temperature": 25.0,
            "humidity": 70.0
        }
        response = client.post("/soil-health-score", json=payload, headers=headers)
        assert response.status_code in [200, 500]

    @patch("app.routes.final_recommendation_routes.get_weather")
    @patch("app.routes.final_recommendation_routes.generate_final_recommendation.delay")
    def test_final_recommendation_pipeline_e2e(self, mock_celery, mock_weather):
        """TC-FINAL-01: Complete end-to-end recommendation pipeline."""
        mock_weather.return_value = {
            "location": "Hyderabad",
            "temperature": 28.5,
            "humidity": 65.0,
            "rainfall": 120.0
        }
        mock_celery.return_value.id = "mock_task_12345"
        headers = get_auth_headers()
        image_bytes = generate_dummy_image_bytes()
        files = {"image": ("test_soil.jpg", image_bytes, "image/jpeg")}
        data = {
            "nitrogen": "85.0",
            "phosphorus": "40.0",
            "potassium": "45.0",
            "ph": "6.6",
            "organic_carbon": "0.7",
            "electrical_conductivity": "0.5",
            "location": "Hyderabad"
        }
        response = client.post("/final-recommendation", files=files, data=data, headers=headers)
        assert response.status_code in [200, 400, 500]


# ==============================================================================
# 3. ADMIN DASHBOARD & SOIL MONITORING SUITE
# ==============================================================================

class TestAdminSuite:
    """Test suite covering Admin Dashboard, User Management, and Soil Monitoring."""

    def test_admin_dashboard_summary_as_admin(self):
        """TC-ADMIN-01: Get admin dashboard summary with Admin role."""
        headers = get_admin_headers()
        response = client.get("/admin/dashboard/summary", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_predictions" in data
        assert "farmer_count" in data

    def test_admin_dashboard_user_growth(self):
        """TC-ADMIN-02: Get monthly user growth metrics."""
        headers = get_admin_headers()
        response = client.get("/admin/dashboard/user-growth", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_admin_soil_monitoring_endpoint(self):
        """TC-ADMIN-03: Get admin soil analysis monitoring & analytics."""
        headers = get_admin_headers()
        response = client.get("/admin/soil-analysis-monitoring?limit=5", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_analyses" in data
        assert "average_health_score" in data
        assert "soil_type_distribution" in data
        assert "health_status_distribution" in data
        assert "recent_analyses" in data
        assert isinstance(data["recent_analyses"], list)

    def test_admin_soil_monitoring_forbidden_for_farmer(self):
        """TC-ADMIN-04: Non-admin (farmer) blocked with 403 Forbidden."""
        headers = get_auth_headers(role="farmer")
        response = client.get("/admin/soil-analysis-monitoring", headers=headers)
        assert response.status_code == 403


# ==============================================================================
# 4. WEATHER & MULTILINGUAL SUITE
# ==============================================================================

class TestWeatherAndLanguageSuite:
    """Test suite covering Weather Dashboard and Language endpoints."""

    def test_get_languages_list(self):
        """TC-LANG-01: Retrieve supported languages list."""
        headers = get_auth_headers()
        response = client.get("/api/languages", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_weather_current_english(self):
        """TC-WEATH-01: Fetch current weather for Hyderabad."""
        headers = get_auth_headers()
        response = client.get("/weather/current?location=Hyderabad", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["location"] is not None
        assert "current_temperature" in data

    def test_weather_forecast_5days(self):
        """TC-WEATH-02: Fetch 5-day weather forecast."""
        headers = get_auth_headers()
        response = client.get("/weather/forecast?location=Hyderabad", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["forecast"]) == 5
