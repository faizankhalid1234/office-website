# Deploy Django Admin (Railway / Render)

## 1. Create project
- Root directory: `django-backend`
- Start command: `python setup.py && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

## 2. Environment variables (Django server)

| Variable | Example |
|----------|---------|
| `DJANGO_SECRET_KEY` | long random string |
| `DJANGO_DEBUG` | `false` |
| `ALLOWED_HOSTS` | `your-app.up.railway.app` |
| `CORS_ALLOWED_ORIGINS` | `https://your-vercel-app.vercel.app,http://localhost:3000` |
| `CSRF_TRUSTED_ORIGINS` | `https://your-app.up.railway.app` |

## 3. After deploy — update Next.js `.env` and Vercel

```
DJANGO_API_URL="https://your-app.up.railway.app"
```

Also set `NEXTAUTH_URL` to your Vercel URL on production.

## 4. Admin login
- URL: `https://your-app.up.railway.app/admin` (or `/` redirects there)
- Email: `admin@hhhusain.com`
- Password: `admin123`
