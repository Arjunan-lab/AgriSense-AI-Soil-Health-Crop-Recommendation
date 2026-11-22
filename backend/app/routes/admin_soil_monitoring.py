"""Administrator route for Soil Analysis Monitoring."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models import PredictionHistory, User, UserRole
from app.schemas import SoilAnalysisMonitoringResponse, SoilAnalysisRecordItem

router = APIRouter(prefix="/admin", tags=["Admin Soil Monitoring"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Allow access only to authenticated administrators."""
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access is required.",
        )
    return current_user


@router.get(
    "/soil-analysis-monitoring",
    response_model=SoilAnalysisMonitoringResponse,
    summary="Get Admin Soil Analysis Monitoring & Analytics",
    description="Returns aggregate soil analysis metrics, breakdown distributions (soil type & health status), and recent soil analysis records.",
)
def get_soil_analysis_monitoring(
    limit: int = Query(default=10, ge=1, le=100, description="Limit for recent analysis records"),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> SoilAnalysisMonitoringResponse:
    """
    Admin monitoring endpoint to audit and track all soil analyses conducted across the system.
    Calculates total records, average health score, distribution breakdowns, and retrieves recent logs.
    """
    total_analyses = db.query(func.count(PredictionHistory.id)).scalar() or 0
    avg_score = db.query(func.avg(PredictionHistory.soil_health_score)).scalar() or 0.0

    # Soil type breakdown
    soil_types = (
        db.query(PredictionHistory.soil_type, func.count(PredictionHistory.id))
        .group_by(PredictionHistory.soil_type)
        .all()
    )
    soil_type_dist = {st: count for st, count in soil_types if st}

    # Health status breakdown
    health_statuses = (
        db.query(PredictionHistory.soil_health, func.count(PredictionHistory.id))
        .group_by(PredictionHistory.soil_health)
        .all()
    )
    health_status_dist = {hs: count for hs, count in health_statuses if hs}

    # Fetch recent analyses with farmer info
    recent_records = (
        db.query(PredictionHistory, User.username, User.region)
        .join(User, PredictionHistory.user_id == User.id)
        .order_by(PredictionHistory.created_at.desc())
        .limit(limit)
        .all()
    )

    recent_items = [
        SoilAnalysisRecordItem(
            id=pred.id,
            user_id=pred.user_id,
            farmer_name=username,
            region=region,
            soil_type=pred.soil_type,
            soil_health=pred.soil_health,
            soil_health_score=round(pred.soil_health_score, 2),
            soil_fertility_status=pred.soil_fertility_status,
            nitrogen=pred.nitrogen,
            phosphorus=pred.phosphorus,
            potassium=pred.potassium,
            ph=pred.ph,
            created_at=pred.created_at,
        )
        for pred, username, region in recent_records
    ]

    return SoilAnalysisMonitoringResponse(
        total_analyses=total_analyses,
        average_health_score=round(float(avg_score), 2),
        soil_type_distribution=soil_type_dist,
        health_status_distribution=health_status_dist,
        recent_analyses=recent_items,
    )
