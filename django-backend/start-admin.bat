@echo off
cd /d "%~dp0"
call venv\Scripts\activate
echo.
echo ========================================
echo   H.H Husain - Django Admin Panel
echo ========================================
echo   URL:      http://localhost:8000/admin
echo   Email:    admin@hhhusain.com
echo   Password: admin123
echo ========================================
echo.
python manage.py runserver 8000
