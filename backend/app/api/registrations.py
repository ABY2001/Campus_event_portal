import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.models import Registration, Event, User, RegistrationStatus, EventStatus
from app.schemas.schemas import RegistrationResponse
from app.api.auth import get_current_user, require_admin
from app.api.events import build_event_response

router = APIRouter(prefix="/registrations", tags=["Registrations"])

@router.post("/events/{event_id}", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_for_event(
    event_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.status != EventStatus.PUBLISHED:
        raise HTTPException(status_code=400, detail="Event is not accepting registrations")

    # Check capacity
    active_regs = db.query(func.count(Registration.id)).filter(
        Registration.event_id == event.id,
        Registration.status == RegistrationStatus.REGISTERED
    ).scalar() or 0

    target_status = RegistrationStatus.REGISTERED
    if active_regs >= event.capacity:
        target_status = RegistrationStatus.WAITLISTED

    # Check existing registration
    existing = db.query(Registration).filter(
        Registration.event_id == event.id,
        Registration.user_id == current_user.id
    ).first()

    if existing:
        if existing.status == RegistrationStatus.REGISTERED:
            raise HTTPException(status_code=400, detail="You are already registered for this event")
        elif existing.status == RegistrationStatus.CANCELLED:
            existing.status = target_status
            db.commit()
            db.refresh(existing)
            return RegistrationResponse(
                id=existing.id,
                event_id=existing.event_id,
                user_id=existing.user_id,
                status=existing.status,
                registered_at=existing.registered_at,
                event=build_event_response(event, db)
            )

    new_reg = Registration(
        event_id=event.id,
        user_id=current_user.id,
        status=target_status
    )
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)

    return RegistrationResponse(
        id=new_reg.id,
        event_id=new_reg.event_id,
        user_id=new_reg.user_id,
        status=new_reg.status,
        registered_at=new_reg.registered_at,
        event=build_event_response(event, db)
    )

@router.delete("/events/{event_id}", response_model=RegistrationResponse)
def cancel_registration(
    event_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reg = db.query(Registration).filter(
        Registration.event_id == event_id,
        Registration.user_id == current_user.id
    ).first()

    if not reg or reg.status == RegistrationStatus.CANCELLED:
        raise HTTPException(status_code=404, detail="Active registration not found")

    reg.status = RegistrationStatus.CANCELLED
    db.commit()
    db.refresh(reg)

    event = db.query(Event).filter(Event.id == event_id).first()
    return RegistrationResponse(
        id=reg.id,
        event_id=reg.event_id,
        user_id=reg.user_id,
        status=reg.status,
        registered_at=reg.registered_at,
        event=build_event_response(event, db) if event else None
    )

@router.get("/my", response_model=List[RegistrationResponse])
def list_my_registrations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    regs = db.query(Registration).filter(
        Registration.user_id == current_user.id
    ).order_by(Registration.registered_at.desc()).all()

    res = []
    for r in regs:
        event_resp = build_event_response(r.event, db) if r.event else None
        res.append(RegistrationResponse(
            id=r.id,
            event_id=r.event_id,
            user_id=r.user_id,
            status=r.status,
            registered_at=r.registered_at,
            event=event_resp
        ))
    return res

@router.get("/events/{event_id}/participants", response_model=List[RegistrationResponse])
def list_event_participants(
    event_id: uuid.UUID,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    regs = db.query(Registration).filter(
        Registration.event_id == event_id
    ).order_by(Registration.registered_at.asc()).all()

    res = []
    for r in regs:
        res.append(RegistrationResponse(
            id=r.id,
            event_id=r.event_id,
            user_id=r.user_id,
            status=r.status,
            registered_at=r.registered_at,
            user=r.user
        ))
    return res
