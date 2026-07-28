# 🔍 Pagination & Search Specification

This document details the pagination, full-text search, and category filtering mechanisms implemented in the **Campus Event Management Portal**.

---

## ⚡ 1. Database Full-Text GIN Index Search

Search is accelerated in PostgreSQL using a Generalized Inverted Index (GIN) on full-text vectors combined with SQL `ILIKE` pattern matching:

```sql
CREATE INDEX idx_events_title_desc ON events USING gin(to_tsvector('english', title || ' ' || description));
```

---

## 📡 2. Query Parameters

The `GET /api/events` endpoint accepts the following query parameters:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search` | `string` | `None` | Case-insensitive search keyword across `title`, `description`, `location`, and `category` |
| `category` | `string` | `None` | Exact category filter (`Workshop`, `Cultural`, `Sports`, `Seminar`, `Academic`) |
| `page` | `integer` | `1` | Page index (1-based) |
| `size` | `integer` | `10` | Maximum number of records returned per page |

---

## 🧮 3. SQL Offset & Limit Calculation

The backend SQLAlchemy query calculates SQL offset as:
```python
offset = (page - 1) * size
events = query.offset(offset).limit(size).all()
```

---

## 📦 4. Paginated Response Envelope

```json
{
  "total": 42,
  "page": 1,
  "size": 10,
  "items": [
    {
      "id": "uuid-string",
      "title": "Campus Event",
      "category": "Workshop",
      "available_seats": 25
    }
  ]
}
```
