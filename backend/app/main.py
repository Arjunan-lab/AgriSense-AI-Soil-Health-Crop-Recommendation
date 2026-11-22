from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.crop_routes import router as crop_router
from app.routes.nutrient_routes import router as nutrient_router
from app.routes.soil_fertility_routes import router as soil_fertility_router
from app.routes.soil_health_routes import router as soil_health_router
from app.routes.soil_health_score_routes import router as soil_health_score_router
from app.routes.final_recommendation_routes import router as final_recommendation_router
from app.routes.history_routes import router as history_router
from app.routes.task_routes import router as task_router
from app.routes.chat_routes import router as chat_router
from app.routes.analytics import router as analytics_router
from app.routes.admin_dashboard import router as admin_dashboard_router
from app.routes.admin_users import router as admin_users_router
from app.database import engine, Base
from app.routes.admin_soil_monitoring import router as admin_soil_monitoring_router
from app.routes.feedback_routes import router as feedback_router
from app.routes.language_routes import router as language_router
from app.routes.weather_routes import router as weather_router

# Dynamic table creation fallback (useful for dev/test before running migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="User Authentication API",
    description="Production-ready FastAPI backend with PostgreSQL, security best-practices, Alembic support, image prediction, and crop recommendation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# CORS configuration (useful for frontend consumption)
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication endpoints
app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(crop_router)
app.include_router(nutrient_router)
app.include_router(soil_fertility_router)
app.include_router(soil_health_router)
app.include_router(soil_health_score_router)
app.include_router(final_recommendation_router)
app.include_router(history_router)
app.include_router(task_router)
app.include_router(chat_router)
app.include_router(analytics_router)

app.include_router(admin_dashboard_router)
app.include_router(admin_users_router)
app.include_router(admin_soil_monitoring_router)

app.include_router(feedback_router)
app.include_router(language_router)
app.include_router(weather_router)




# Mount dual-route support for Vercel multi-service routing
api_router = APIRouter(prefix="/api")

routers_list = [
    auth_router, prediction_router, crop_router, nutrient_router,
    soil_fertility_router, soil_health_router, soil_health_score_router,
    final_recommendation_router, history_router, task_router, chat_router,
    analytics_router, admin_dashboard_router, admin_users_router,
    admin_soil_monitoring_router, feedback_router, language_router, weather_router
]

for r in routers_list:
    api_router.include_router(r)

app.include_router(api_router)

@app.get("/", tags=["Root"])
def root():
    """
    Root endpoint serving basic status checks.
    """
    return {
        "status": "online",
        "api_name": "User Authentication API",
        "docs_url": "/docs"
    }
