@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   Admin password / email change karein
echo ========================================
echo.

if not exist "venv\Scripts\activate.bat" (
  echo Pehle setup-admin.bat chalao.
  pause
  exit /b 1
)

call venv\Scripts\activate
python setup.py --skip-migrate

pause
