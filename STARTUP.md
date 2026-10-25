# SkillNest — Local Setup, Run & Verification Guide

This document describes how to install, configure, run, and verify the **SkillNest** local-first marketplace application (React frontend + Express & Prisma backend + PostgreSQL database).

All instructions are based directly on the verified project structure, installed dependencies, and npm scripts.

---

## A. Prerequisites

Ensure the following runtimes and services are installed on your machine:

- **Node.js**: `v20.0.0` or higher (verified on `v24.21.0`).
- **npm**: `v10.0.0` or higher (verified on `v11.19.0`).
- **PostgreSQL**: `v14.0` or higher (verified on PostgreSQL `18.6` running on port `5432`).
- **Operating System**: Windows (PowerShell / cmd), macOS, or Linux.

---

## B. Project Structure

SkillNest is organized into independent frontend and backend workspaces:

```
d:\skillnest\
├── frontend\                         # Single Page Application (React 19 + Vite + Tailwind CSS)
│   ├── .env.example                  # Frontend environment template
│   ├── .env                          # Local frontend environment variables (API URL)
│   ├── package.json                  # Frontend scripts and UI dependencies
│   ├── vite.config.ts                # Bundler config, alias '@', and /api proxy
│   └── src\                          # Application components, pages, context, and API client
│       ├── lib\api.ts                # Central REST API client (credentials: include)
│       └── context\AppContext.tsx    # State management with backend synchronization
│
├── backend\                          # REST API Server (Node.js + Express + TypeScript + Prisma)
│   ├── .env.example                  # Backend environment template
│   ├── .env                          # Local backend secrets & database URL
│   ├── package.json                  # Backend dependencies, Prisma scripts, and Vitest
│   ├── tsconfig.json                 # TypeScript compiler options
│   ├── prisma\
│   │   ├── schema.prisma             # Normalized relational schema with 15 models
│   │   └── migrations\               # Version-controlled SQL migration history
│   │       └── 20261025074706_init\  # Initial schema migration
│   └── src\
│       ├── server.ts                 # HTTP server entrypoint
│       ├── app.ts                    # Express application factory with middleware
│       ├── seed.ts                   # Regional Boisar/Palghar seed script
│       ├── config\                   # Database client (Prisma) and Zod env validator
│       └── modules\                  # Domain modules (auth, freelancers, projects, etc.)
│
├── package.json                      # Root convenience scripts
├── TASK.md                           # Implementation and task tracking ledger
└── STARTUP.md                        # Local setup and run documentation (this file)
```

---

## C. Database Setup

### 1. Ensure PostgreSQL is Running
Verify that the PostgreSQL service is active:

- **Windows (PowerShell as Administrator or Service Manager):**
  ```powershell
  Get-Service -Name *postgres*
  # If stopped:
  Start-Service postgresql-x64-18
  ```
- **macOS / Linux:**
  ```bash
  sudo systemctl status postgresql
  # Or with Homebrew:
  brew services list
  ```

### 2. Database Connection Parameters
- **Host**: `localhost`
- **Port**: `5432` (default)
- **Database Name**: `skillnest_db`
- **User**: `postgres` (or your chosen PostgreSQL user)

### 3. Configure Connection String
In `backend/.env`, set the `DATABASE_URL` format:
```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/skillnest_db"
```
*(Replace `<USER>` and `<PASSWORD>` with your local PostgreSQL credentials).*

### 4. Generate Prisma Client
Generates the type-safe client tailored to `schema.prisma`:
```bash
cd backend
npm run db:generate
```

### 5. Apply Migrations
Creates the `skillnest_db` database if it does not already exist and applies all schema migrations:
```bash
cd backend
npx prisma migrate dev --name init
```

### 6. Verify Migration Status
Confirm the local database is in sync with the migration history:
```bash
cd backend
npx prisma migrate status
```
*Expected output: `Database schema is up to date!`*

### 7. Seed Development Data
Seeds the regional Boisar/Palghar test users, freelancer profiles, portfolios, and sample projects:
```bash
cd backend
npm run db:seed
```

**Pre-seeded Test Accounts:**
| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@skillnest.local` | `Admin@SkillNest2026!` | Boisar HQ Platform Admin |
| **Client** | `aniket@cafepalms.in` | `Client@123` | Cafe Palms Boisar (MSME Client) |
| **Freelancer** | `rahul.dev@skillnest.local` | `Freelancer@123` | Senior Full-Stack Developer |
| **Freelancer** | `contact@pixelcraftstudio.in` | `Freelancer@123` | PixelCraft Studio (Team) |

---

## D. Environment Configuration

### 1. Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and supply your actual database credentials:
```env
# Database connection string
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/skillnest_db"

# Session cookie signing key (at least 32 characters)
SESSION_SECRET="skillnest-super-secret-session-key-development-2026-secure"

# Server configuration
PORT=4000
NODE_ENV=development

# Allowed CORS Origin (Vite frontend)
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend (`frontend/.env`)
Create `frontend/.env` pointing to the backend API:
```env
# SkillNest Backend API base URL
VITE_API_URL="http://localhost:4000/api"

# Optional Gemini AI API key for assistant features
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
APP_URL="http://localhost:3000"
```

---

## E. Installation

Install dependencies separately for backend and frontend workspaces:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
```

*(Note: Dependencies are already installed in this repository. Run `npm install` only if setting up on a fresh machine).*

---

## F. Starting the Application

Run the backend API and frontend dev server in separate terminal windows:

### Terminal 1: Backend API Server
```bash
cd backend
npm run dev
```
- Starts the Express server via `tsx watch src/server.ts`.
- Runs on **`http://localhost:4000`**.
- Verifies database connectivity on boot: `✅ Database connected`.

### Terminal 2: Frontend Development Server
```bash
cd frontend
npm run dev
```
- Starts Vite on **`http://localhost:3000`**.
- Proxies `/api` requests directly to `http://localhost:4000`.

### Root Convenience Scripts
From the repository root directory (`d:\skillnest`), you can also run:
```bash
# Start Frontend
npm run dev:frontend

# Start Backend
npm run dev:backend
```

---

## G. Verification

Run these verification commands to ensure the system is healthy:

### 1. Backend Type Check
```bash
cd backend
npm run typecheck
```
*Expected: Exits code 0 with zero errors.*

### 2. Frontend Type Check (Lint)
```bash
cd frontend
npm run lint
```
*Expected: Exits code 0 with zero errors.*

### 3. Frontend Production Build
```bash
cd frontend
npm run build
```
*Expected: Bundles clean production assets into `dist/`.*

### 4. Backend Production Build
```bash
cd backend
npm run build
```
*Expected: Transpiles TypeScript into `dist/server.js`.*

### 5. Automated Integration Test Suite
```bash
cd backend
npm test
```
*Expected: 18/18 tests pass across live PostgreSQL queries, authentication, session lifecycle, RBAC enforcement, Zod schemas, and marketplace queries.*

### 6. Backend Live Health Check
With the backend server running, query the health endpoint:
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/health"
```
*Expected response: `{"status": "ok", "timestamp": "..."}`*

---

## H. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `P1001: Can't reach database server at localhost:5432` | PostgreSQL service stopped or port mismatch | Start the PostgreSQL service (`Start-Service postgresql-x64-18` on Windows). Check port `5432` in `pg_hba.conf`. |
| `P1000: Authentication failed against database server` | Incorrect password or username in `DATABASE_URL` | Verify the password in `backend/.env`. Connect via `psql -U postgres` to verify credentials. |
| `❌ Invalid environment configuration: { DATABASE_URL: [...] }` | Missing or unpopulated `backend/.env` | Ensure `backend/.env` exists and contains valid `DATABASE_URL` and `SESSION_SECRET` values. |
| `Error: EADDRINUSE: address already in use :::4000` | Port 4000 occupied by previous node process | Find and terminate the process holding port 4000: `Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess \| Stop-Process -Force`. |
| `Cannot find module '@prisma/client'` | Prisma Client has not been generated locally | Run `npm run db:generate` in `backend/`. |
| `401 Unauthorized` on protected routes | Session expired or cookie missing | Log in via `/login` using one of the pre-seeded credentials. Confirm your browser allows cookies for `localhost`. |
| Vite HMR warning on `__dirname` | Deprecated path resolution | Resolved in `vite.config.ts` using modern `import.meta.dirname`. |
