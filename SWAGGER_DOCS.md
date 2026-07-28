# 📖 Swagger API Documentation & OpenAPI Specification

The **Campus Event Management Portal** backend automatically generates interactive Swagger (OpenAPI 3.0) documentation powered by **FastAPI**.

---

## 🚀 Accessing Interactive API Documentation

When running the application locally or via Docker Compose, access the interactive documentation at:

* **Interactive Swagger UI**: 👉 **[http://localhost:8001/docs](http://localhost:8001/docs)** (or **[http://localhost:8000/docs](http://localhost:8000/docs)**)
* **ReDoc Documentation**: 👉 **[http://localhost:8001/redoc](http://localhost:8001/redoc)**
* **OpenAPI Schema (JSON)**: 👉 **[http://localhost:8001/openapi.json](http://localhost:8001/openapi.json)**

---

## 🔑 Authenticating in Swagger UI

To execute authenticated endpoints (`POST /api/events`, `POST /api/registrations`, etc.) directly inside the Swagger UI interface:

1. Open **[http://localhost:8001/docs](http://localhost:8001/docs)** in your browser.
2. Click the **`Authorize 🔓`** button at the top right of the Swagger UI.
3. Obtain a token by calling `POST /api/auth/login` with your credentials:
   - **Admin**: `admin@campus.edu` / `Admin123!`
   - **Student**: `student@campus.edu` / `Student123!`
4. Copy the `access_token` string from the JSON response.
5. In the **`Authorize`** modal, enter:
   ```text
   Bearer <your_copied_access_token>
   ```
6. Click **Authorize**, then **Close**. You can now test all protected endpoints directly in your browser!

---

## 📑 Exporting Postman / OpenAPI Collections

You can import the raw OpenAPI JSON specification directly into **Postman**, **Insomnia**, or **Swagger Editor**:
```bash
curl http://localhost:8001/openapi.json -o openapi_spec.json
```
