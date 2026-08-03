# 🚀 Docker & Cloud Deployment Specification

This document provides complete instructions for deploying the **Campus Event Management Portal** using Docker Compose locally, in staging environments, and on cloud server providers (AWS EC2, DigitalOcean, Azure, Render/Railway).

---

## 🐳 1. Multi-Container Docker Compose Deployment (Local & Staging)

In modern containerized application architecture, running a multi-container Docker Compose stack represents a **production-ready containerized deployment**.

### Deployment Topology:
- **Nginx Reverse Proxy**: Listens on Port `80` (public entry point).
- **React Frontend**: Runs Node 20 / Vite container internally exposed on `5173`.
- **FastAPI Backend**: Runs Python 3.12 container internally exposed on `8000`.
- **PostgreSQL 16 Database**: Runs database container internally exposed on `5432` with volume persistence.
- **Redis Cache**: Runs Redis 7 container internally exposed on `6379`.

---

### Step-by-Step Deployment Execution:

#### 1. Clone Repository & Set Environment Variables:
```bash
git clone https://github.com/your-repo/campus-event-portal.git
cd campus-event-portal
cp .env.example .env
```

#### 2. Launch Docker Containers:
```bash
docker compose up --build -d
```
*The `-d` flag runs the containers in detached (background) mode.*

#### 3. Verify Container Health & Status:
```bash
docker compose ps
```

Expected Output:
```text
NAME                     STATUS                   PORTS
campus_postgres_db       Up (healthy)             0.0.0.0:5432->5432/tcp
campus_redis_cache       Up (healthy)             0.0.0.0:6379->6379/tcp
campus_fastapi_backend   Up                       8000/tcp
campus_react_frontend    Up                       5173/tcp
campus_nginx_proxy       Up                       0.0.0.0:80->80/tcp
```

#### 4. Access Live Services:
- **Application Frontend**: 👉 `http://localhost`
- **Interactive Swagger Docs**: 👉 `http://localhost/docs`
- **Database Status Check**: `docker compose logs db`

#### 5. Stop Application Stack:
```bash
docker compose down
```

---

## ☁️ 2. Production Cloud Deployment Options

### Option A: Cloud VM Deployment (AWS EC2 / DigitalOcean Droplet / Azure VM)

1. **Provision a Linux Server Instance**:
   - Ubuntu 22.04 LTS / 24.04 LTS (Minimum: 2 vCPU, 2GB RAM).
   - Configure Security Group / Firewall to open **Port 80 (HTTP)**, **Port 443 (HTTPS)**, and **Port 22 (SSH)**.

2. **Install Docker & Docker Compose Plugin**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo systemctl enable --now docker
   ```

3. **Deploy the Stack**:
   ```bash
   git clone https://github.com/your-repo/campus-event-portal.git
   cd campus-event-portal
   sudo docker compose up --build -d
   ```

4. **Enable SSL/TLS Certificates (Let's Encrypt / Certbot)**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

### Option B: Platform as a Service (Render / Railway / Fly.io)

- **Database**: Provision a managed PostgreSQL instance (e.g. Supabase, Render Postgres, AWS RDS).
- **Backend Service**: Deploy `/backend` Dockerfile with `DATABASE_URL` and `SECRET_KEY` environment variables.
- **Frontend Service**: Deploy React build output to static hosting (Vercel, Netlify, Render Static Site).

---

## 🛠️ 3. Maintenance & Log Inspection Commands

- **Inspect Real-Time Backend Logs**:
  ```bash
  docker compose logs -f backend
  ```
- **Inspect Nginx Access & Error Logs**:
  ```bash
  docker compose logs -f nginx
  ```
- **Execute Database Backup Dump**:
  ```bash
  docker exec -t campus_postgres_db pg_dump -U postgres campus_db > backup.sql
  ```
