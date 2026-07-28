# 🎓 Campus Event Management Portal

A full-stack, production-ready **Campus Event Management Portal** designed for university students to discover, search, register, and manage campus events, while providing administrators with tools for event CRUD, banner uploads, participant tracking, dynamic KPI analytics, and custom admin account management.

---

## 🚀 Technology Stack

* **Frontend**: React.js (TypeScript), Vite 6, Tailwind CSS v3, PostCSS
* **Backend**: FastAPI (Python 3.12), Pydantic v2, SQLAlchemy ORM, PyJWT, Bcrypt
* **Database**: PostgreSQL 16 (GIN Full-Text Indexes, Foreign Keys, Dynamic View Views)
* **Authentication**: JSON Web Token (JWT) Bearer Authentication with role-based access control (`STUDENT` vs `ADMIN`)
* **Containerization**: Docker & Docker Compose (`db`, `backend`, `frontend`)

---

## ✨ Features Summary

### 🎓 Student Features
* **Authentication**: Student Account Signup and JWT Login.
* **Event Discovery**: Browse upcoming campus events with category filtering (*Workshop*, *Cultural*, *Sports*, *Seminar*, *Academic*).
* **Live Search**: Instant keyword search across event titles, descriptions, and locations.
* **1-Click Registration**: Register for events with real-time seat availability updates.
* **Waitlist Support**: Automatic waitlisting when event capacity is reached.
* **Registration Management**: Cancel active registrations with 1-click.
* **My Registrations**: Track confirmed vs waitlisted event requests on the dashboard.

### 🛡️ Administrator Features
* **Live KPI Dashboard**: Real-time summary cards (*Total Students*, *Total Admins*, *Total Events*, *Active Registrations*).
* **Event Management**: Create, edit, and delete events with date/time, location, and capacity controls.
* **Banner File Uploads**: Upload event banner images directly to static media storage (`/static/uploads/`).
* **Participant Tracking**: View list of registered student names, emails, and timestamped registration statuses for any event.
* **Custom Admin Provisioning**: Create custom administrator accounts (`POST /api/auth/create-admin`).

---

## 🛠️ Infrastructure Requirements & Setup

### Option 1: Run Entire Application via Docker Compose (Recommended)

Ensure Docker Desktop is running, then execute:

```bash
docker compose up --build
```

This starts 3 isolated container services:
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
* **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **PostgreSQL Database**: `localhost:5432` (`db_name: campus_events`)

To stop all services:
```bash
docker compose down
```

---

### Option 2: Local Development Setup (Manual)

#### 1. Database Setup
Ensure PostgreSQL is installed locally and create the database:
```sql
CREATE DATABASE campus_events;
```
Run the DDL schema script in `docs/schema.sql`:
```bash
psql -U postgres -d campus_events -f docs/schema.sql
```

#### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload --port 8000
```

#### 3. Frontend Setup (React + Vite)
```bash
# In the root project directory:
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Seed Credentials

Upon database initialization (`init_db.py`), a default Super Admin account is auto-seeded:

* **Role**: Administrator
* **Email**: `admin@campus.edu`
* **Password**: `Admin123!`

For Student access:
* Click **"Student Signup"** on the login page to register a new student account, or login with `student@campus.edu`.

---

## 📡 Key REST API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/signup` - Register student account
* `POST /api/auth/login` - Authenticate & obtain JWT Token
* `GET /api/auth/me` - Get current authenticated user profile
* `POST /api/auth/create-admin` - Admin-only endpoint to create custom admin accounts

### 📅 Events (`/api/events`)
* `GET /api/events` - List events with search, category filters, and pagination
* `POST /api/events` - Admin endpoint to create new event
* `PUT /api/events/{id}` - Admin endpoint to update event details
* `DELETE /api/events/{id}` - Admin endpoint to delete event
* `POST /api/events/{id}/banner` - Admin endpoint to upload event banner image

### 📝 Registrations (`/api/registrations`)
* `POST /api/registrations/events/{event_id}` - Student registration endpoint
* `DELETE /api/registrations/events/{event_id}` - Cancel registration endpoint
* `GET /api/registrations/my` - List current user's registrations
* `GET /api/registrations/events/{event_id}/participants` - Admin view for registered participants

### 📊 Dashboard KPIs (`/api/dashboard`)
* `GET /api/dashboard/kpis` - Aggregated live stats (*students*, *admins*, *events*, *registrations*)

---

## 📖 Engineering Requirements Documentation

* **System Design & Architecture Diagram**: [docs/architecture_diagram.md](file:///d:/campus/Campus_event_portal/docs/architecture_diagram.md)
* **REST API Specification**: [API_DESIGN.md](file:///d:/campus/Campus_event_portal/API_DESIGN.md)
* **Environment Variables Guide**: [.env.example](file:///d:/campus/Campus_event_portal/.env.example)
* **Swagger API Documentation**: [SWAGGER_DOCS.md](file:///d:/campus/Campus_event_portal/SWAGGER_DOCS.md) *(Live at http://localhost:8001/docs)*
* **Logging & Error Handling**: [LOGGING_AND_ERRORS.md](file:///d:/campus/Campus_event_portal/LOGGING_AND_ERRORS.md)
* **Pagination & Search Implementation**: [PAGINATION_AND_SEARCH.md](file:///d:/campus/Campus_event_portal/PAGINATION_AND_SEARCH.md)
* **Database SQL Schema**: [docs/schema.sql](file:///d:/campus/Campus_event_portal/docs/schema.sql)
* **Docker Compose Stack Config**: [docker-compose.yml](file:///d:/campus/Campus_event_portal/docker-compose.yml)
