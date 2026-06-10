# Django Auth Backend — H.H Husain

Python Django backend for **user email & password management**.

## What Django handles

- User registration (name, email, password)
- Login verification
- **Admin panel** — create/edit users, reset passwords, change emails

## What Next.js handles

- Expense dashboard UI
- Expenses, categories, reports, budget

## Setup

```bash
cd django-backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python setup.py              # migrate + create admin
python manage.py runserver   # http://localhost:8000
```

## Admin Panel

Open **http://localhost:8000/admin**

| Field | Value |
|-------|-------|
| Email | admin@hhhusain.com |
| Password | admin123 |

From admin you can:
- Add new users with email & password
- Change any user's email or password
- Set role: **Admin** or **Employee**
- Disable accounts

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register/` | User signup (name, email, password) |
| POST | `/api/auth/login/` | Login verify (email, password) |

## Run both servers

Terminal 1 — Django:
```bash
cd django-backend && venv\Scripts\activate && python manage.py runserver
```

Terminal 2 — Next.js:
```bash
npm run dev
```
