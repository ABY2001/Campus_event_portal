import enum
import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, Enum as SQLEnum, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"

class EventStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class RegistrationStatus(str, enum.Enum):
    REGISTERED = "REGISTERED"
    CANCELLED = "CANCELLED"
    ATTENDED = "ATTENDED"
    WAITLISTED = "WAITLISTED"

class AnnouncementPriority(str, enum.Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole, name="user_role"), default=UserRole.STUDENT, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    student_profile: Mapped[Optional["StudentProfile"]] = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    events: Mapped[List["Event"]] = relationship("Event", back_populates="organizer")
    registrations: Mapped[List["Registration"]] = relationship("Registration", back_populates="user")
    announcements: Mapped[List["Announcement"]] = relationship("Announcement", back_populates="creator")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    student_id_number: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    year_of_study: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="student_profile")

class Event(Base):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    registration_deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    banner_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[EventStatus] = mapped_column(SQLEnum(EventStatus, name="event_status"), default=EventStatus.PUBLISHED, nullable=False, index=True)
    organizer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    organizer: Mapped["User"] = relationship("User", back_populates="events")
    registrations: Mapped[List["Registration"]] = relationship("Registration", back_populates="event", cascade="all, delete-orphan")
    announcements: Mapped[List["Announcement"]] = relationship("Announcement", back_populates="event", cascade="all, delete-orphan")

class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (UniqueConstraint("event_id", "user_id", name="unique_event_user"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[RegistrationStatus] = mapped_column(SQLEnum(RegistrationStatus, name="registration_status"), default=RegistrationStatus.REGISTERED, nullable=False)
    registered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    event: Mapped["Event"] = relationship("Event", back_populates="registrations")
    user: Mapped["User"] = relationship("User", back_populates="registrations")

class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    event_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=True)
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    priority: Mapped[AnnouncementPriority] = mapped_column(SQLEnum(AnnouncementPriority, name="announcement_priority"), default=AnnouncementPriority.NORMAL, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    event: Mapped[Optional["Event"]] = relationship("Event", back_populates="announcements")
    creator: Mapped["User"] = relationship("User", back_populates="announcements")
