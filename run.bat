@echo off
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Install from https://nodejs.org and try again.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
if errorlevel 1 exit /b 1

echo Starting dev server...
call npm run dev
pause
