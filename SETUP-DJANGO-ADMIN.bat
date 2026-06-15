@echo off
REM Run Django setup from project root (opens django-backend automatically)
cd /d "%~dp0django-backend"
call setup-admin.bat
