import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# Try importing EmailStr; fallback to str if email-validator is not installed
try:
    from pydantic import EmailStr
except Exception:
    EmailStr = str

from app.models.models import UserRole, EventStatus, RegistrationStatus, AnnouncementPriority

# Authentication Schemas
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: UserRole = UserRole.STUDENT
    student_id_number: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[int] = None
    phone_number: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: UserRole

# User & Student Profile Schemas
class StudentProfileResponse(BaseModel):
    id: uuid.UUID
    student_id_number: Optional[str] = None
    department: Optional[str] = None
    year_of_study: Optional[int] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    avatar_url: Optional[str] = None
    student_profile: Optional[StudentProfileResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Event Schemas
class EventCreateRequest(BaseModel):
    title: str
    description: str
    category: str
    location: str
    start_time: datetime
    end_time: datetime
    registration_deadline: datetime
    capacity: int = Field(..., gt=0)
    status: EventStatus = EventStatus.PUBLISHED

class EventUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    capacity: Optional[int] = None
    status: Optional[EventStatus] = None

class EventResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    category: str
    location: str
    start_time: datetime
    end_time: datetime
    registration_deadline: datetime
    capacity: int
    banner_url: Optional[str] = None
    status: EventStatus
    organizer_id: uuid.UUID
    organizer_name: Optional[str] = None
    registered_count: int = 0
    available_seats: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EventListResponse(BaseModel):
    total: int
    page: int
    size: int
    items: List[EventResponse]

# Registration Schemas
class RegistrationResponse(BaseModel):
    id: uuid.UUID
    event_id: uuid.UUID
    user_id: uuid.UUID
    status: RegistrationStatus
    registered_at: datetime
    event: Optional[EventResponse] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# Announcement Schemas
class AnnouncementCreateRequest(BaseModel):
    title: str
    content: str
    event_id: Optional[uuid.UUID] = None
    priority: AnnouncementPriority = AnnouncementPriority.NORMAL

class AnnouncementResponse(BaseModel):
    id: uuid.UUID
    title: str
    content: str
    event_id: Optional[uuid.UUID] = None
    created_by: uuid.UUID
    priority: AnnouncementPriority
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardKPIs(BaseModel):
    total_students: int
    total_admins: int
    total_events: int
    upcoming_events: int
    total_active_registrations: int
