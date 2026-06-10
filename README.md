# H.H Husain - Office Expense Management System

Production-ready PWA for managing office expenses with a modern SaaS dashboard.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript — Frontend dashboard
- **Python Django** — User email & password backend + Admin panel
- **Tailwind CSS** + **Shadcn UI**
- **Prisma ORM** + **PostgreSQL** — Expenses data
- **NextAuth** (JWT sessions, role-based access)
- **Recharts** + **Framer Motion**
- **PWA** (manifest + service worker)

## Features

- Dashboard with animated stats, charts, budget progress
- Expense CRUD with receipt upload (image/PDF)
- Category management (Admin)
- Monthly reports with PDF/Excel export
- Budget tracking with 80%/90%/100% alerts
- Dark/Light mode
- Mobile installable PWA

## Getting Started

**Terminal 1 — Django Auth Backend:**
```bash
cd django-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python setup.py
python manage.py runserver
```
Admin panel: [http://localhost:8000/admin](http://localhost:8000/admin)

**Terminal 2 — Next.js Frontend:**
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@hhhusain.com     | admin123     |
| Employee | employee@hhhusain.com  | employee123  |

## Pages

| Route            | Access   | Description              |
|------------------|----------|--------------------------|
| `/`              | All      | Dashboard                |
| `/expenses`      | All      | Expense list             |
| `/expenses/add`  | All      | Add expense              |
| `/categories`    | Admin    | Manage categories        |
| `/reports`       | All      | Reports & export         |
| `/budget`        | Admin    | Set monthly budget       |
| `/settings`      | Admin    | App settings             |
| `/auth/login`    | Public   | Sign in                  |
| `/auth/register` | Public   | Register                 |

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run db:push    # Push schema to DB
npm run db:seed    # Seed categories & users
npm run icons      # Generate PWA icons
```

## PWA Install

On mobile/desktop Chrome: Menu → **Install app** or **Add to Home Screen**.

## Admin Panels

**Django Admin** (`http://localhost:8000/admin`) — Manage users:
- Create/edit user email & password
- Set Admin or Employee role
- Disable accounts

**Next.js App** — Admin role pages:
- Categories, Budget, Settings
