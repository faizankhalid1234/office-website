# H.H Husain — Office Expense

Monorepo for company expense management: **employee website**, **admin panel**, and **backend API**.

## A to Z — Project Overview

### What is this project?

| Part | Folder | Port (local) | Who uses it |
|------|--------|--------------|-------------|
| **Employee website** | `frontend/` | 3000 | Staff add/view expenses |
| **Admin panel** | `admin/` | 4000 | Admin manages users & budget |
| **Backend API** | `backend/` | 5000 | Data, login, database (no UI) |

All three talk to the **same MongoDB** through the backend.

```
Employee Website (3000) ──┐
                          ├──► Backend API (5000) ──► MongoDB
Admin Panel (4000) ───────┘
```

---

## Folder structure

```
office-expense/
├── package.json          # Run all apps together (npm run dev)
├── frontend/             # Next.js — employee website
│   ├── src/app/          # Pages (dashboard, expenses, budget, …)
│   ├── src/components/   # UI components
│   └── src/lib/          # API client, auth, helpers
├── admin/                # Next.js — admin only
│   ├── src/app/(panel)/  # Dashboard, users, budget
│   └── src/components/admin/
└── backend/              # Express + MongoDB
    ├── src/routes/       # API endpoints
    ├── src/models/       # MongoDB schemas
    └── scripts/seed.ts   # Demo users & categories
```

---

## Local setup (first time)

```bash
# 1. Install dependencies (all three apps)
npm run setup

# 2. Copy env files and fill secrets
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
copy admin\.env.example admin\.env

# 3. Start everything
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Employee website |
| http://localhost:4000 | Admin panel |
| http://localhost:5000/api/health | Backend health check |

### Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hhhusain.com | admin123 |
| Employee | employee@hhhusain.com | employee123 |

---

## Environment variables

**Important:** `AUTH_SECRET` must be the **same** in `frontend/.env`, `admin/.env`, and `backend/.env`.

### backend/.env

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret string |
| `AUTH_SECRET` | Same as frontend & admin |
| `PORT` | `5000` |
| `FRONTEND_URL` | `http://localhost:3000` (production: Vercel URL) |
| `ADMIN_URL` | `http://localhost:4000` (production: admin Vercel URL) |

### frontend/.env

| Variable | Example |
|----------|---------|
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `AUTH_SECRET` | Shared secret |
| `BACKEND_URL` | `http://localhost:5000` |
| `NEXT_PUBLIC_BACKEND_URL` | Same as BACKEND_URL |
| `ADMIN_URL` | `http://localhost:4000` |
| `NEXT_PUBLIC_ADMIN_URL` | Same as ADMIN_URL |

### admin/.env

| Variable | Example |
|----------|---------|
| `NEXTAUTH_URL` | `http://localhost:4000` |
| `AUTH_SECRET` | Shared secret |
| `BACKEND_URL` | `http://localhost:5000` |
| `NEXT_PUBLIC_BACKEND_URL` | Same as BACKEND_URL |
| `WEBSITE_URL` | `http://localhost:3000` |

---

## How features work

### Login
- Frontend & admin use **NextAuth** (session in browser).
- Credentials are checked by **backend** `POST /api/auth/login`.
- Backend returns JWT; admin/frontend store it for API calls.

### Expenses
- Employees add expenses on the **website**.
- Saved via backend `POST /api/expenses` → MongoDB.

### Budget
- Admin sets company monthly budget in **admin panel** (`/budget`).
- Backend stores one budget per month in MongoDB.
- **Website** shows the same budget (read-only) — all staff see company spending vs limit.

### Users
- Admin creates/edits users in **admin panel** (`/users`).
- Website `/users` redirects to admin.

---

## Backend API (main routes)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register employee |
| GET/POST | `/api/expenses` | List / create expenses |
| GET/POST | `/api/budget` | Get / set company budget |
| GET | `/api/dashboard/stats` | Dashboard numbers |
| GET/POST | `/api/users` | User management (admin) |

---

## NPM scripts (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Backend + frontend + admin |
| `npm run dev:backend` | API only |
| `npm run dev:frontend` | Website only |
| `npm run dev:admin` | Admin only |
| `npm run setup` | Install all + seed database |
| `npm run db:seed` | Seed demo users & categories |

---

## Deployment (Vercel + backend host)

| App | Platform | Root Directory |
|-----|----------|----------------|
| Frontend | Vercel | `frontend` |
| Admin | Vercel (new project) | `admin` |
| Backend | Railway / Render / VPS | `backend` |

After deploy, set production URLs in all `.env` / Vercel environment variables.

1. Deploy **backend** first → copy API URL  
2. Deploy **admin** on Vercel → set `BACKEND_URL`, `NEXTAUTH_URL`  
3. Update **frontend** Vercel env → `BACKEND_URL`, `ADMIN_URL`  
4. Update **backend** env → `FRONTEND_URL`, `ADMIN_URL` (for CORS)  
5. Run `npm run db:seed` on production database once  

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend & Admin | Next.js 16, React 19, Tailwind, NextAuth |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |

---

## License

Private — H.H Husain office use.
