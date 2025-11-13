@echo off
REM One-Click Web Launcher for Plot My Farm
REM Double-click this file to run the app on localhost!

echo ========================================
echo   Plot My Farm - Web Launcher
echo ========================================
echo.

REM Stop emulator to free resources
echo [1/4] Freeing up resources...
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
taskkill /F /IM emulator.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done!
echo.

REM Check Node.js
echo [2/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo.

REM Install dependencies if needed
echo [3/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
echo Dependencies OK!
echo.

REM Start web server
echo [4/4] Starting web server...
echo.
echo ========================================
echo   SERVER STARTING
echo ========================================
echo.
echo URL: http://localhost:8081
echo.
echo The browser will open automatically!
echo Please wait 30-60 seconds for first load...
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Start with Vite (faster and more reliable)
call npm run web:vite

pause

