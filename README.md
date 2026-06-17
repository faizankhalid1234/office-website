# H.H Husain — Office Expense (Frontend + Backend)

Monorepo with **separate folders** for UI and API.

## Structure

```
office-expense/
├── frontend/     → Next.js employee website (port 3000)
├── admin/        → Next.js admin panel (port 4000)
├── backend/      → Node.js Express API (port 5000)
└── package.json  → run all together
```

| Folder | Role | Tech |
|--------|------|------|
| **frontend** | Employee website | Next.js 16, React, Tailwind |
| **admin** | Admin panel | Next.js 16, React, Tailwind |
| **backend** | Auth, users, expenses, DB | Express, MongoDB |

## Quick start

```bash
# Install both
npm run install:all

# Database (backend)
npm run db:push
npm run db:seed

# Install + create demo users in MongoDB (run once on a new machine)
npm run setup

# Run backend + frontend + admin together
npm run dev
```

- **Employee website:** http://localhost:3000/auth/login
- **Admin panel:** http://localhost:4000/login
- **Backend API:** http://localhost:5000/api/health

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hhhusain.com | admin123 |
| Employee | employee@hhhusain.com | employee123 |

## Scripts (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Backend + Frontend + Admin |
| `npm run dev:backend` | API only |
| `npm run dev:frontend` | Employee website only |
| `npm run dev:admin` | Admin panel only |
| `npm run db:push` | Push Prisma schema |
| `npm run db:seed` | Seed users & categories |

## Environment

**backend/.env** — `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`, `FRONTEND_URL`, `ADMIN_URL`

**frontend/.env** — `BACKEND_URL=http://localhost:5000`, `ADMIN_URL=http://localhost:4000`, `AUTH_SECRET`, `NEXTAUTH_URL`

**admin/.env** — `BACKEND_URL=http://localhost:5000`, `NEXTAUTH_URL=http://localhost:4000`, `AUTH_SECRET`
