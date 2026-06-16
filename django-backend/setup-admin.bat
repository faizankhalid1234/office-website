@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   H.H Husain - Django Admin Setup
echo ========================================
echo   Folder: django-backend
echo.
echo   Aap apna EMAIL aur PASSWORD khud set karenge
echo ========================================
echo.

if not exist "venv\Scripts\activate.bat" (
  echo Creating Python virtual environment...
  python -m venv venv
)

call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt -q

echo.
python setup.py

echo.
echo Admin panel start: start-admin.bat
echo URL: http://localhost:8000/admin
echo.
pause
