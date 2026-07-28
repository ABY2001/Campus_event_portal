# 📡 REST API Design Specification

This document provides the full REST API specification for the **Campus Event Management Portal**.

---

## 🔑 Authentication & Headers

All authenticated endpoints require a JSON Web Token (JWT) passed in the `Authorization` HTTP header:

```http
Authorization: Bearer <your_jwt_access_token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 `POST /api/auth/signup`
Registers a new student user account.

- **Request Body**:
```json
{
  "email": "student@campus.edu",
  "password": "Password123!",
  "full_name": "Student Name",
  "role": "STUDENT",
  "student_id_number": "STU12345",
  "department": "Computer Science",
  "year_of_study": 3,
  "phone_number": "+1234567890"
}
```

- **Response (201 Created)**:
```json
{
  "id": "c1f2e3d4-5678-90ab-cdef-1234567890ab",
  "email": "student@campus.edu",
  "full_name": "Student Name",
  "role": "STUDENT",
  "is_active": true,
  "created_at": "2026-07-28T20:00:00Z"
}
```

---

### 1.2 `POST /api/auth/login`
Authenticates a user and returns a Bearer access token.

- **Request Body**:
```json
{
  "email": "student@campus.edu",
  "password": "Password123!"
}
```

- **Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "c1f2e3d4-5678-90ab-cdef-1234567890ab",
  "email": "student@campus.edu",
  "full_name": "Student Name",
  "role": "STUDENT"
}
```

---

### 1.3 `GET /api/auth/me`
Gets the current authenticated user's profile.

- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "id": "c1f2e3d4-5678-90ab-cdef-1234567890ab",
  "email": "student@campus.edu",
  "full_name": "Student Name",
  "role": "STUDENT",
  "is_active": true,
  "created_at": "2026-07-28T20:00:00Z"
}
```

---

### 1.4 `POST /api/auth/create-admin` (Admin Only)
Provisions a new administrator account.

- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
```json
{
  "email": "new.admin@campus.edu",
  "password": "AdminPassword123!",
  "full_name": "New Admin Name",
  "role": "ADMIN"
}
```
- **Response (201 Created)**: User response object.

---

## 2. Events Endpoints (`/api/events`)

### 2.1 `GET /api/events`
Lists campus events with search filtering, category sorting, and pagination.

- **Query Parameters**:
  - `search` *(optional, string)*: Keyword search across title, description, and location.
  - `category` *(optional, string)*: Filter by category (`Workshop`, `Cultural`, `Sports`, `Seminar`, `Academic`).
  - `page` *(optional, integer, default: 1)*: Page number.
  - `size` *(optional, integer, default: 10)*: Items per page.

- **Response (200 OK)**:
```json
{
  "total": 5,
  "page": 1,
  "size": 10,
  "items": [
    {
      "id": "e1f2e3d4-5678-90ab-cdef-1234567890ab",
      "title": "Annual Hackathon 2026",
      "description": "24-hour coding challenge",
      "category": "Workshop",
      "location": "Auditorium A",
      "start_time": "2026-08-01T10:00:00Z",
      "end_time": "2026-08-02T10:00:00Z",
      "registration_deadline": "2026-07-31T23:59:59Z",
      "capacity": 100,
      "banner_url": "/static/uploads/hackathon.jpg",
      "status": "PUBLISHED",
      "organizer_id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "organizer_name": "Campus Admin",
      "registered_count": 15,
      "available_seats": 85,
      "created_at": "2026-07-28T20:00:00Z",
      "updated_at": "2026-07-28T20:00:00Z"
    }
  ]
}
```

---

### 2.2 `POST /api/events` (Admin Only)
Creates a new event.

- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
```json
{
  "title": "Annual Hackathon 2026",
  "description": "24-hour coding challenge",
  "category": "Workshop",
  "location": "Auditorium A",
  "start_time": "2026-08-01T10:00:00Z",
  "end_time": "2026-08-02T10:00:00Z",
  "registration_deadline": "2026-07-31T23:59:59Z",
  "capacity": 100,
  "status": "PUBLISHED"
}
```
- **Response (201 Created)**: Event object.

---

### 2.3 `POST /api/events/{id}/banner` (Admin Only)
Uploads a banner image for an event.

- **Content-Type**: `multipart/form-data`
- **Form Data**: `file` (Image binary)
- **Response (200 OK)**: Event object with updated `banner_url`.

---

### 2.4 `DELETE /api/events/{id}` (Admin Only)
Deletes an event.

- **Response (204 No Content)**.

---

## 3. Registrations Endpoints (`/api/registrations`)

### 3.1 `POST /api/registrations/events/{event_id}`
Registers the logged-in student for an event.

- **Headers**: `Authorization: Bearer <student_token>`
- **Response (201 Created)**:
```json
{
  "id": "r1f2e3d4-5678-90ab-cdef-1234567890ab",
  "event_id": "e1f2e3d4-5678-90ab-cdef-1234567890ab",
  "user_id": "c1f2e3d4-5678-90ab-cdef-1234567890ab",
  "status": "REGISTERED",
  "registered_at": "2026-07-28T20:00:00Z"
}
```

---

### 3.2 `DELETE /api/registrations/events/{event_id}`
Cancels the logged-in student's registration for an event.

- **Headers**: `Authorization: Bearer <student_token>`
- **Response (200 OK)**: `{ "message": "Registration cancelled successfully" }`.

---

### 3.3 `GET /api/registrations/my`
Lists all event registrations for the logged-in student.

- **Response (200 OK)**: Array of registration objects with nested event details.

---

### 3.4 `GET /api/registrations/events/{event_id}/participants` (Admin Only)
Lists all student participants registered for a specific event.

- **Headers**: `Authorization: Bearer <admin_token>`
- **Response (200 OK)**: Array of participant records with student names and emails.

---

## 4. Dashboard KPIs Endpoint (`/api/dashboard`)

### 4.1 `GET /api/dashboard/kpis`
Returns live aggregated system metrics.

- **Response (200 OK)**:
```json
{
  "total_students": 150,
  "total_admins": 4,
  "total_events": 12,
  "upcoming_events": 8,
  "total_active_registrations": 340
}
```
