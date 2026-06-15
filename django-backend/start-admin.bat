@echo off
cd /d "%~dp0"
call venv\Scripts\activate
echo.
echo ========================================
echo   H.H Husain - Django Admin Panel
echo ========================================
echo   URL:  http://localhost:8000/admin
echo.
echo   First time? Run setup-admin.bat to set YOUR email/password
echo ========================================
echo.
python manage.py runserver 8000
