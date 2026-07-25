-- PostgreSQL Schema for Campus Event Management Portal
-- Requirements: PostgreSQL, FastAPI, React.js, JWT Authentication

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom Enum Types
CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE event_status AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE registration_status AS ENUM ('REGISTERED', 'CANCELLED', 'ATTENDED', 'WAITLISTED');
CREATE TYPE announcement_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER set_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    student_id_number VARCHAR(50) UNIQUE NULL,
    department VARCHAR(100) NULL,
    year_of_study INTEGER NULL CHECK (year_of_study BETWEEN 1 AND 7),
    phone_number VARCHAR(20) NULL,
    bio TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER set_student_profiles_updated_at 
BEFORE UPDATE ON student_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    banner_url TEXT NULL,
    status event_status NOT NULL DEFAULT 'PUBLISHED',
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_event_dates CHECK (end_time > start_time AND registration_deadline <= start_time)
);

CREATE OR REPLACE TRIGGER set_events_updated_at 
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status registration_status NOT NULL DEFAULT 'REGISTERED',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_user UNIQUE (event_id, user_id)
);

CREATE OR REPLACE TRIGGER set_registrations_updated_at 
BEFORE UPDATE ON registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    event_id UUID NULL REFERENCES events(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    priority announcement_priority NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER set_announcements_updated_at 
BEFORE UPDATE ON announcements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

--------------------------------------------------------------------------------
-- INDEXES FOR FAST PAGINATION, SEARCH, AND DASHBOARD AGGREGATIONS
--------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);

-- Full-text Search Index for Event title, description, and location
CREATE INDEX IF NOT EXISTS idx_events_fts ON events USING gin(
    to_tsvector('english', title || ' ' || description || ' ' || location)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_registrations_user_status ON registrations(user_id, status);

CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);

--------------------------------------------------------------------------------
-- DASHBOARD ANALYTICS VIEWS
--------------------------------------------------------------------------------

CREATE OR REPLACE VIEW vw_event_registration_stats AS
SELECT 
    e.id AS event_id,
    e.title,
    e.capacity,
    COUNT(CASE WHEN r.status = 'REGISTERED' THEN 1 END) AS active_registrations,
    COUNT(CASE WHEN r.status = 'WAITLISTED' THEN 1 END) AS waitlisted_count,
    (e.capacity - COUNT(CASE WHEN r.status = 'REGISTERED' THEN 1 END)) AS available_seats,
    e.status AS event_status,
    e.start_time
FROM events e
LEFT JOIN registrations r ON e.id = r.event_id
GROUP BY e.id, e.title, e.capacity, e.status, e.start_time;

CREATE OR REPLACE VIEW vw_admin_dashboard_kpis AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'STUDENT') AS total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') AS total_admins,
    (SELECT COUNT(*) FROM events) AS total_events,
    (SELECT COUNT(*) FROM events WHERE status = 'PUBLISHED' AND start_time >= CURRENT_TIMESTAMP) AS upcoming_events,
    (SELECT COUNT(*) FROM registrations WHERE status = 'REGISTERED') AS total_active_registrations;
