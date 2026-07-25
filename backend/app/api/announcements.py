import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Announcement, User
from app.schemas.schemas import AnnouncementCreateRequest, AnnouncementResponse
from app.api.auth import get_current_user, require_admin

router = APIRouter(prefix="/announcements", tags=["Announcements"])

@router.get("", response_model=List[AnnouncementResponse])
def list_announcements(
    event_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Announcement)
    if event_id:
        query = query.filter(Announcement.event_id == event_id)
    
    announcements = query.order_by(Announcement.created_at.desc()).all()
    return announcements

@router.post("", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    announcement_in: AnnouncementCreateRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    new_announcement = Announcement(
        title=announcement_in.title,
        content=announcement_in.content,
        event_id=announcement_in.event_id,
        created_by=current_admin.id,
        priority=announcement_in.priority
    )
    db.add(new_announcement)
    db.commit()
    db.refresh(new_announcement)
    return new_announcement
