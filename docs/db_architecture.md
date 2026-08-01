# 🗄️ Database Architecture Specification

This document details the PostgreSQL relational database model, Entity-Relationship (ER) structure, foreign key constraints, indexes, and aggregate view queries for the **Campus Event Management Portal**.

---

## 📐 Entity Relationship Diagram (ERD)

![Database Architecture Diagram](file:///d:/campus/Campus_event_portal/docs/db_architecture.png)

```mermaid
erDiagram
    USERS ||--o| STUDENT_PROFILES : "has (1:1)"
    USERS ||--o{ EVENTS : "organizes (1:N)"
    USERS ||--o{ REGISTRATIONS : "submits (1:N)"
    USERS ||--o{ ANNOUNCEMENTS : "posts (1:N)"
    EVENTS ||--o{ REGISTRATIONS : "has (1:N)"
    EVENTS ||--o{ ANNOUNCEMENTS : "targets (0:N)"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        enum role "STUDENT | ADMIN"
        string full_name
        boolean is_active
        string avatar_url
        timestamp created_at
    }

    STUDENT_PROFILES {
        uuid id PK
        uuid user_id FK, UK
        string student_id_number UK
        string department
        integer year_of_study
        string phone_number
        text bio
    }

    EVENTS {
        uuid id PK
        string title
        text description
        string category
        string location
        timestamp start_time
        timestamp end_time
        timestamp registration_deadline
        integer capacity
        string banner_url
        enum status "DRAFT | PUBLISHED | CANCELLED | COMPLETED"
        uuid organizer_id FK
        timestamp created_at
        timestamp updated_at
    }

    REGISTRATIONS {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        enum status "REGISTERED | WAITLISTED | CANCELLED"
        timestamp registered_at
    }

    ANNOUNCEMENTS {
        uuid id PK
        string title
        text content
        uuid event_id FK
        uuid created_by FK
        enum priority "LOW | NORMAL | HIGH | URGENT"
        timestamp created_at
    }
```

---

## 🗃️ Table Schemas & Constraints

### 1. `users` Table
Stores authentication credentials and account roles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt / SHA256 hashed password |
| `role` | `VARCHAR(50)` | `NOT NULL, DEFAULT 'STUDENT'` | Access role (`STUDENT` or `ADMIN`) |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | Account holder name |
| `is_active` | `BOOLEAN` | `NOT NULL, DEFAULT true` | Account status flag |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Registration timestamp |

---

### 2. `student_profiles` Table
Stores extended academic metadata for student accounts (1-to-1 with `users`).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Profile ID |
| `user_id` | `UUID` | `FOREIGN KEY (users.id) ON DELETE CASCADE, UNIQUE` | Associated user ID |
| `student_id_number` | `VARCHAR(100)` | `UNIQUE` | University Student Roll ID |
| `department` | `VARCHAR(100)` | `NULLABLE` | Academic department (e.g. Computer Science) |
| `year_of_study` | `INTEGER` | `NULLABLE` | Year level (1 to 4) |

---

### 3. `events` Table
Stores published campus events and venue capacities.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Event ID |
| `title` | `VARCHAR(255)` | `NOT NULL` | Event title |
| `description` | `TEXT` | `NOT NULL` | Event description |
| `category` | `VARCHAR(100)` | `NOT NULL` | Event category |
| `location` | `VARCHAR(255)` | `NOT NULL` | Venue / Room number |
| `start_time` | `TIMESTAMPTZ` | `NOT NULL` | Event start date & time |
| `end_time` | `TIMESTAMPTZ` | `NOT NULL` | Event end date & time |
| `capacity` | `INTEGER` | `NOT NULL, CHECK (capacity > 0)` | Maximum attendee limit |
| `banner_url` | `VARCHAR(500)` | `NULLABLE` | Uploaded image path |
| `status` | `VARCHAR(50)` | `NOT NULL, DEFAULT 'PUBLISHED'` | Event status |
| `organizer_id` | `UUID` | `FOREIGN KEY (users.id)` | Creating Admin ID |

---

### 4. `registrations` Table
Tracks student registrations and waitlist statuses.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Registration ID |
| `event_id` | `UUID` | `FOREIGN KEY (events.id) ON DELETE CASCADE` | Registered event |
| `user_id` | `UUID` | `FOREIGN KEY (users.id) ON DELETE CASCADE` | Registered student |
| `status` | `VARCHAR(50)` | `NOT NULL, DEFAULT 'REGISTERED'` | Registration status (`REGISTERED`, `WAITLISTED`, `CANCELLED`) |
| `registered_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Enrolled timestamp |

---

## ⚡ Indexes & Optimization

1. **Composite Unique Index**: Prevents duplicate registrations for the same user and event:
   ```sql
   CREATE UNIQUE INDEX idx_unique_active_reg ON registrations(event_id, user_id) WHERE status != 'CANCELLED';
   ```
2. **Full-Text GIN Index**: Accelerates event keyword search queries across title & description:
   ```sql
   CREATE INDEX idx_events_fts ON events USING gin(to_tsvector('english', title || ' ' || description));
   ```
3. **Foreign Key Indexes**:
   ```sql
   CREATE INDEX idx_registrations_user_id ON registrations(user_id);
   CREATE INDEX idx_events_start_time ON events(start_time);
   ```
