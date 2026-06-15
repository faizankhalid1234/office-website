# Django Auth Backend — H.H Husain

Python Django backend for **user email & password management**.

## What Django handles

- User registration (name, email, password)
- Login verification
- **Admin panel** — create/edit users, reset passwords, change emails

## What Next.js handles

- Expense dashboard UI
- Expenses, categories, reports, budget

## Setup (Windows — easy)

**Important:** Django is inside `django-backend` folder — NOT `office-expense` root.

Double-click from project root:
```
SETUP-DJANGO-ADMIN.bat
```
It will ask for **your email, name, and password** (you choose).

Or manually:
```bash
cd django-backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python setup.py              # prompts for YOUR admin email & password
start-admin.bat              # http://localhost:8000/admin
```

Custom admin without prompts:
```bash
python setup.py --email you@mail.com --name "Your Name" --password yourpass --skip-demo
```

## Admin Panel

Open **http://localhost:8000/admin**

Login with the **email and password you set** in `setup.py`.

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
