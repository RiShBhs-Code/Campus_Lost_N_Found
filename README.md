# Campus Lost & Found: Full Stack Containerization Guide

This document covers **Experiment 7 (Standalone Docker)**, **Experiment 8 (WebSockets)**, and **Experiment 9 (Docker Compose Multi-Container Setup)**.

---

## Experiment 9: Multi-Container Setup Using Docker Compose

Docker Compose coordinates and orchestrates multi-container applications with a single configuration file (`docker-compose.yml`) and unified commands (`docker compose up / down`).

### 1. Architecture & Port Mapping

```
[ Web Browser (Host Machine) ]
       │
       ├─── HTTP :3000 ─────────► [ campus-frontend ] (Nginx Alpine, port 80)
       │                              │ (Serves React 18 / Vite compiled assets)
       │
       └─── HTTP / WS :8080 ────► [ campus-backend ] (Node 20 Alpine, port 5000)
                                      │ (Express REST API & Socket.IO server)
                                      ▼
                             [ MongoDB Atlas ] (Cloud Database)
```

| Service | Container Name | Internal Port | Host Port | Purpose |
|---|---|---|---|---|
| **`backend`** | `campus-backend` | `5000` | `8080` | Express REST API & Socket.IO server |
| **`frontend`** | `campus-frontend` | `80` | `3000` | React/Vite SPA served via Nginx Alpine |
| **`database`** | *(External)* | Cloud | Cloud | MongoDB Atlas connection |

---

### 2. Services Breakdown in `docker-compose.yml`

1. **`backend`**:
   - Builds from `./backend` using `backend/Dockerfile`.
   - Runs `npm start` (`node server.js`) on port `5000`.
   - Reads environment variables (`MONGO_URI`, `JWT_SECRET`) safely from `./backend/.env`.
   - Configured with `restart: unless-stopped`.
   - Connected to bridge network `campus-network`.

2. **`frontend`**:
   - Builds from root using `Dockerfile` (multi-stage build).
   - Passes `VITE_API_URL=http://localhost:8080` at build time so the browser knows where to reach the backend.
   - Copies compiled assets to `nginx:alpine` and serves on port `80`.
   - Depends on `backend` service (`depends_on: [backend]`).
   - Connected to bridge network `campus-network`.

---

### 3. Essential Docker Compose Commands

#### **A. Start All Containers (Build & Run in Background)**
```bash
docker compose up -d --build
```
*Builds both images, creates the network, and starts containers in detached mode.*

#### **B. Check Status of Services**
```bash
docker compose ps
```
*Displays container IDs, service names, health status, and mapped ports.*

#### **C. View Real-Time Service Logs**
```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

#### **D. Stop All Services & Networks**
```bash
docker compose down
```
*Stops and removes containers and the created bridge network cleanly.*

---

### 4. How to Test & Demonstrate in a Practical Exam

1. **Start the Multi-Container Application**:
   ```bash
   docker compose up -d --build
   ```

2. **Verify Containers are Running**:
   ```bash
   docker compose ps
   ```
   Both `campus-backend` and `campus-frontend` will show status `Up`.

3. **Verify Backend Health & Database**:
   ```bash
   curl http://localhost:8080/
   ```
   *Expected Response:* `Campus Lost and Found API is Running`

4. **Open Frontend in Browser**:
   Navigate to **[http://localhost:3000](http://localhost:3000)**.
   - Click **`🎓 Student Account`** to auto-fill test credentials.
   - Click **Sign In as User**.
   - Notice the green **`● Connected`** WebSocket badge in the navbar.
   - Click **+ Report Item** to add an item directly to MongoDB.

5. **Demonstrate Real-Time Multi-Client Sync**:
   - Open another window in Incognito mode at [http://localhost:3000](http://localhost:3000).
   - Sign in using **`🛡️ Admin Account`**.
   - Report an item in Window 1: Window 2 receives the live WebSocket notification automatically without refreshing!
   - Delete an item as Admin in Window 2: It is removed from MongoDB and vanishes from Window 1 in real time!

6. **Tear Down Setup**:
   ```bash
   docker compose down
   ```

---

### 5. Important Docker Compose Concepts (Viva Cheatsheet)

- **What is Docker Compose?**
  A tool for defining and running multi-container Docker applications using a single YAML file (`docker-compose.yml`). Instead of executing multiple separate `docker build` and `docker run` commands with long parameter lists, a single `docker compose up` starts the entire system.
- **Why use `depends_on`?**
  Expresses service dependencies. In our setup, `depends_on: [backend]` instructs Docker Compose to start the backend before launching the frontend.
- **Why bridge network (`campus-network`)?**
  Containers on the same user-defined bridge network can resolve and communicate with each other using their service names (`http://backend:5000`) via automatic internal DNS resolution.
- **Why does the browser call `http://localhost:8080` instead of `http://backend:5000`?**
  Because the frontend is a client-side Single Page Application (SPA). React code runs in the user's web browser on the host machine, not inside the frontend container. The browser must reach the published host port (`localhost:8080`).
- **Why no MongoDB container?**
  The application utilizes a cloud-hosted MongoDB Atlas cluster. Adding a local MongoDB container is unnecessary and redundant.
