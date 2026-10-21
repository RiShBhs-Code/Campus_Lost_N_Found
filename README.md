# Experiment 7: Deploy Using Docker — Dockerize Frontend and Backend

This guide covers the containerization of the **Campus Lost and Found** Full Stack application using Docker.

---

## 1. Core Docker Concepts (Viva Cheatsheet)

- **Docker Image**: A lightweight, standalone, executable package that includes everything needed to run an application (code, runtime, system libraries, environment settings). It acts as an immutable blueprint.
- **Docker Container**: A runnable, isolated instance of a Docker image. When you execute `docker run`, Docker creates a container from the image.
- **Dockerfile**: A text document containing sequential instructions to automate building a Docker image.
- **Multi-Stage Build**: A Docker build technique that uses multiple `FROM` instructions in a single Dockerfile. Intermediate stages (such as Node.js build tools and heavy `node_modules`) are discarded, leaving only production artifacts (static HTML/CSS/JS) served by a tiny Nginx image (~25MB).

---

## 2. Ports & Architecture Overview

| Service | Technology | Internal Port | Mapped Host Port | Serving Mechanism |
|---|---|---|---|---|
| **Backend** | Node.js + Express | `5000` | `5000` (`-p 5000:5000`) | Node.js (`npm start`) |
| **Frontend** | React 18 + Vite | `80` | `3000` (`-p 3000:80`) | Nginx Alpine |
| **Database** | MongoDB Atlas | Cloud | Cloud | Mongoose direct connection |

> **Browser-to-Backend Networking**:
> The React frontend is a client-side Single Page Application (SPA). It runs in the user's web browser on the host machine. When the browser makes API requests to `http://localhost:5000/api/...`, it connects to the backend port published on the host.

---

## 3. Backend Containerization

### Dockerfile (`backend/Dockerfile`)
- **Base image**: `node:20-alpine` (lightweight, minimal Linux).
- **Working directory**: `/app`.
- **Dependency caching**: Copies `package*.json` first and runs `npm install --omit=dev`.
- **Source copy**: Copies backend code while excluding `.env`, `node_modules`, and `.git` via `backend/.dockerignore`.
- **Port exposed**: `5000`.
- **Entry point**: `npm start` (executes `node server.js`).

### Step 1: Build the Backend Image
Run from the project root:
```bash
docker build -t campus-lost-found-backend ./backend
```

### Step 2: Run the Backend Container
Pass runtime environment variables using `-e` flags (never bake secrets into Docker images):
```bash
docker run -d \
  --name campus-backend-container \
  -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="your_mongodb_atlas_connection_string" \
  -e JWT_SECRET="your_jwt_secret_key" \
  campus-lost-found-backend
```

*Or pass an excluded `.env` file at runtime:*
```bash
docker run -d \
  --name campus-backend-container \
  -p 5000:5000 \
  --env-file ./backend/.env \
  campus-lost-found-backend
```

---

## 4. Frontend Containerization

### Dockerfile (`Dockerfile` / `frontend/Dockerfile`)
- **Stage 1 (`build`)**: Uses `node:20-alpine`, installs dependencies, accepts `ARG VITE_API_URL` (defaulting to `http://localhost:5000`), and runs `npm run build` to generate `/app/dist`.
- **Stage 2 (`serve`)**: Uses `nginx:alpine`, copies only the compiled `/app/dist` folder into `/usr/share/nginx/html`, and serves it on port `80`.

### Step 1: Build the Frontend Image
Run from the project root:
```bash
docker build -t campus-lost-found-frontend .
```

*If you need to customize the backend API URL at build time:*
```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t campus-lost-found-frontend .
```

### Step 2: Run the Frontend Container
Map host port `3000` to container port `80`:
```bash
docker run -d \
  --name campus-frontend-container \
  -p 3000:80 \
  campus-lost-found-frontend
```

---

## 5. Verification & Testing Steps

1. **Verify Running Containers**:
   ```bash
   docker ps
   ```
   Both `campus-backend-container` and `campus-frontend-container` should show status `Up`.

2. **Test Backend Health Endpoint**:
   ```bash
   curl http://localhost:5000/
   ```
   *Expected Response*: `Campus Lost and Found API is Running`

3. **Test Frontend in Browser**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser. The Campus Lost & Found Login Page should load.

4. **Test Fullstack Interaction**:
   - Log in with the **Student** or **Admin** account.
   - Verify that items load on the dashboard.
   - Report a new lost/found item.
   - Log in as Admin to verify delete capabilities.

---

## 6. Container Management Commands

- **View Container Logs**:
  ```bash
  docker logs -f campus-backend-container
  docker logs -f campus-frontend-container
  ```

- **Stop Containers**:
  ```bash
  docker stop campus-frontend-container campus-backend-container
  ```

- **Restart Containers**:
  ```bash
  docker start campus-backend-container campus-frontend-container
  ```

- **Remove Containers**:
  ```bash
  docker rm -f campus-frontend-container campus-backend-container
  ```

- **Remove Images**:
  ```bash
  docker rmi campus-lost-found-frontend campus-lost-found-backend
  ```
