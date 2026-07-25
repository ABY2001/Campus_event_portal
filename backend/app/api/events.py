import os
import uuid
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.db.session import get_db
from app.models.models import Event, Registration, RegistrationStatus, EventStatus, User
from app.schemas.schemas import EventCreateRequest, EventUpdateRequest, EventResponse, EventListResponse
from app.api.auth import get_current_user, require_admin
from app.core.config import settings

router = APIRouter(prefix="/events", tags=["Events"])

def build_event_response(event: Event, db: Session) -> EventResponse:
    reg_count = db.query(func.count(Registration.id)).filter(
        Registration.event_id == event.id,
        Registration.status == RegistrationStatus.REGISTERED
    ).scalar() or 0
    
    avail_seats = max(0, event.capacity - reg_count)
    org_name = event.organizer.full_name if event.organizer else None

    return EventResponse(
        id=event.id,
        title=event.title,
        description=event.description,
        category=event.category,
        location=event.location,
        start_time=event.start_time,
        end_time=event.end_time,
        registration_deadline=event.registration_deadline,
        capacity=event.capacity,
        banner_url=event.banner_url,
        status=event.status,
        organizer_id=event.organizer_id,
        organizer_name=org_name,
        registered_count=reg_count,
        available_seats=avail_seats,
        created_at=event.created_at,
        updated_at=event.updated_at
    )

@router.get("", response_model=EventListResponse)
def list_events(
    search: Optional[str] = Query(None, description="Search term for title, description, or location"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[EventStatus] = Query(EventStatus.PUBLISHED, description="Filter by event status"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Event)

    if status:
        query = query.filter(Event.status == status)

    if category:
        query = query.filter(Event.category.ilike(f"%{category}%"))

    if search:
        search_filter = or_(
            Event.title.ilike(f"%{search}%"),
            Event.description.ilike(f"%{search}%"),
            Event.location.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    total = query.count()
    events = query.order_by(Event.start_time.asc()).offset((page - 1) * size).limit(size).all()

    items = [build_event_response(ev, db) for ev in events]
    return EventListResponse(total=total, page=page, size=size, items=items)

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return build_event_response(event, db)

@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: EventCreateRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    new_event = Event(
        title=event_in.title,
        description=event_in.description,
        category=event_in.category,
        location=event_in.location,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        registration_deadline=event_in.registration_deadline,
        capacity=event_in.capacity,
        status=event_in.status,
        organizer_id=current_admin.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return build_event_response(new_event, db)

@router.post("/{event_id}/banner", response_model=EventResponse)
def upload_banner(
    event_id: uuid.UUID,
    file: UploadFile = File(...),
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    ext = os.path.splitext(file.filename)[1]
    filename = f"event_{event.id}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    event.banner_url = f"/static/uploads/{filename}"
    db.commit()
    db.refresh(event)
    return build_event_response(event, db)

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: uuid.UUID,
    event_in: EventUpdateRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return build_event_response(event, db)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: uuid.UUID,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return None
