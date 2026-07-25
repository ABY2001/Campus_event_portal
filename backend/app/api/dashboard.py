from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import datetime
from app.db.session import get_db
from app.models.models import User, Event, Registration, UserRole, EventStatus, RegistrationStatus
from app.schemas.schemas import DashboardKPIs
from app.api.auth import require_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/kpis", response_model=DashboardKPIs)
def get_dashboard_kpis(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_students = db.query(func.count(User.id)).filter(User.role == UserRole.STUDENT).scalar() or 0
    total_admins = db.query(func.count(User.id)).filter(User.role == UserRole.ADMIN).scalar() or 0
    total_events = db.query(func.count(Event.id)).scalar() or 0
    upcoming_events = db.query(func.count(Event.id)).filter(
        Event.status == EventStatus.PUBLISHED,
        Event.start_time >= datetime.utcnow()
    ).scalar() or 0
    total_active_regs = db.query(func.count(Registration.id)).filter(
        Registration.status == RegistrationStatus.REGISTERED
    ).scalar() or 0

    return DashboardKPIs(
        total_students=total_students,
        total_admins=total_admins,
        total_events=total_events,
        upcoming_events=upcoming_events,
        total_active_registrations=total_active_regs
    )
