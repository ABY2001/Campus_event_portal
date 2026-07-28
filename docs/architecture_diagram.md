# Campus Event Management Portal - System Architecture

This document presents the system architecture, component interaction workflow, database model design, and container deployment structure for the **Campus Event Management Portal**.

---

## 🏗️ Architecture Overview

The system follows a modern decoupled full-stack microservices pattern composed of:
1. **Frontend Layer**: React SPA built with TypeScript, Vite, Tailwind CSS v3, and PostCSS.
2. **Backend API Layer**: FastAPI (Python 3.12) REST service protected with JWT Bearer Authentication and bcrypt password hashing.
3. **Database Layer**: PostgreSQL database with indexed tables, custom enum types, full-text GIN search indexes, and dynamic aggregate view queries.
4. **Container Orchestration**: Docker Compose isolating `frontend`, `backend`, and `db` services into a virtual network.

---

## 📐 System Architecture Diagram

```mermaid
flowchart TB
    subgraph Client ["Client Layer (Web Browser)"]
        StudentUI["Student Dashboard\n(Event Discovery & Registration)"]
        AdminUI["Admin Dashboard\n(Event CRUD, Banners & Users)"]
        AuthUI["JWT Auth Components\n(Login / Signup Forms)"]
    end

    subgraph ReverseProxy ["Edge & Routing Layer"]
        ViteDev["Vite / Nginx Reverse Proxy\n(Port 5173 / 80)"]
    end

    subgraph Backend ["FastAPI Application Services (Port 8000)"]
        AuthRouter["/api/auth Router\n(JWT Auth, Signup, Custom Admin)"]
        EventsRouter["/api/events Router\n(CRUD, GIN Search, Banner Uploads)"]
        RegRouter["/api/registrations Router\n(Register, Cancel, Participants)"]
        KpiRouter["/api/dashboard Router\n(Real-time Aggregated Metrics)"]
        SecurityService["Core Security Service\n(Bcrypt Hash & PyJWT validation)"]
    end

    subgraph DataStorage ["Data & Media Storage"]
        PostgreSQL[("PostgreSQL Database\n(Users, Events, Registrations, Views)")]
        FileStorage["Local Banner Uploads Directory\n(/backend/uploads)"]
    end

    %% Client Interactions
    StudentUI -->|HTTP / JSON Requests| ViteDev
    AdminUI -->|HTTP & Multipart Form| ViteDev
    AuthUI -->|Login Credentials| ViteDev

    %% Proxy Routing
    ViteDev -->|Pass Requests| AuthRouter
    ViteDev -->|Pass Requests| EventsRouter
    ViteDev -->|Pass Requests| RegRouter
    ViteDev -->|Pass Requests| KpiRouter

    %% Internal Backend Logic
    AuthRouter --> SecurityService
    SecurityService --> PostgreSQL
    EventsRouter --> FileStorage
    EventsRouter --> PostgreSQL
    RegRouter --> PostgreSQL
    KpiRouter --> PostgreSQL
```

---

## 🔄 Interaction Flow Sequences

### 1. Student Event Registration Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant ReactApp as React Frontend
    participant API as FastAPI Backend
    participant Auth as JWT Auth Guard
    participant DB as PostgreSQL DB

    Student->>ReactApp: Click "Register Now" on Event Card
    ReactApp->>API: POST /api/registrations/events/{event_id} (Bearer Token)
    API->>Auth: Validate JWT Signature & Expiry
    Auth-->>API: User Context (role: STUDENT)
    API->>DB: Query Event Status & Seat Availability
    alt Available Seats > 0
        DB-->>API: Seat Available
        API->>DB: INSERT into registrations (status: REGISTERED)
        DB-->>API: Registration Confirmed
        API-->>ReactApp: 201 Created (status: REGISTERED)
        ReactApp-->>Student: Update UI Badge to "✓ Registered" & Show Banner Notification
    else Capacity Exceeded
        API->>DB: INSERT into registrations (status: WAITLISTED)
        DB-->>API: Waitlist Confirmed
        API-->>ReactApp: 201 Created (status: WAITLISTED)
        ReactApp-->>Student: Update UI Badge to "Waitlisted"
    end
```

### 2. Admin Event Creation & Banner Upload Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant ReactApp as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL DB
    participant Disk as Static Media Folder

    Admin->>ReactApp: Submit "Create Event" Form + Select Image File
    ReactApp->>API: POST /api/events (JSON Payload + Bearer JWT)
    API->>DB: INSERT into events table
    DB-->>API: Created Event Record (id: uuid)
    ReactApp->>API: POST /api/events/{id}/banner (Multipart Form Data)
    API->>Disk: Save Image to /backend/uploads/{uuid}.jpg
    API->>DB: UPDATE events SET banner_url = '/static/uploads/{uuid}.jpg'
    DB-->>API: Event Banner Path Saved
    API-->>ReactApp: 200 OK (Updated ApiEvent)
    ReactApp-->>Admin: Prepend Event to Admin & Student Event Feeds
```

---

## 🐳 Docker Infrastructure Topology

```mermaid
graph LR
    subgraph DockerCompose ["Docker Compose Stack"]
        subgraph FrontendContainer ["Frontend Container (Node 20 / Nginx)"]
            ReactBundle["React Single Page App\n(Port 5173)"]
        end

        subgraph BackendContainer ["Backend Container (Python 3.12)"]
            FastAPIApp["Uvicorn / FastAPI Server\n(Port 8000)"]
            UploadsDir["Mounted /uploads Volume"]
        end

        subgraph DatabaseContainer ["Database Container (Postgres 16)"]
            PostgresDB["PostgreSQL Service\n(Port 5432)"]
            DbVolume[("Persistent Data Volume")]
        end
    end

    ReactBundle -->|Internal Network Call| FastAPIApp
    FastAPIApp -->|SQL Connection String| PostgresDB
    PostgresDB --- DbVolume
    FastAPIApp --- UploadsDir
```
