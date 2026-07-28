# 🛡️ Logging & Error Handling Specification

This document describes the structured logging, exception handling, and error response architecture implemented across the backend and frontend.

---

## 🪵 1. Structured Logging

The backend leverages Python's standard `logging` module and Uvicorn log formatters to output log streams:

- **Log Levels**:
  - `INFO`: HTTP request handling, database connection events, table creation, and admin seeding.
  - `WARNING`: Handled application errors (e.g. invalid login attempts, duplicate registrations).
  - `ERROR`: Unhandled exceptions, SQL connection timeouts, and authentication failures.

- **Console & Container Logs**:
  Logs output to standard output (`stdout`) allowing Docker to collect and present logs via `docker compose logs -f backend`.

---

## 🛑 2. Standardized Error Response Format

All error responses adhere to FastAPI's standard JSON format:

```json
{
  "detail": "Descriptive error explanation message"
}
```

### Common HTTP Status Codes Implemented:

| Status Code | Meaning | Example Trigger |
| :--- | :--- | :--- |
| `400 Bad Request` | Invalid payload or business constraint violation | Registering for a full event |
| `401 Unauthorized` | Missing or invalid JWT token | Accessing protected endpoint without Bearer token |
| `403 Forbidden` | Insufficient role permissions | Student attempting to call Admin-only CRUD endpoint |
| `404 Not Found` | Requested resource does not exist | Requesting non-existent event ID |
| `422 Unprocessable Entity` | Pydantic schema validation failure | Invalid email format or password under 6 chars |
| `500 Internal Server Error` | Unexpected server exception | Database connection loss |

---

## 🌐 3. CORS Exception Interceptor

To prevent cross-origin preflight errors on API exception responses, custom exception handlers inject explicit CORS headers:

```python
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: *
Access-Control-Allow-Methods: *
```
