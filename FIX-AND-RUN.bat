@echo off
cls
color 0A
echo.
echo ========================================
echo   PLOT MY FARM - FIX AND RUN
echo ========================================
echo.
echo This script will:
echo   1. Kill all old processes
echo   2. Install missing dependencies
echo   3. Start the web server
echo   4. Open your browser
echo.
echo Press any key to continue...
pause >nul
cls

REM Step 1: Kill processes
echo.
echo [STEP 1/4] Cleaning up old processes...
echo.
taskkill /F /IM node.exe 2>nul
taskkill /F /IM qemu-system-x86_64.exe 2>nul
taskkill /F /IM emulator.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!
echo.

REM Step 2: Check Node
echo [STEP 2/4] Checking Node.js...
echo.
node --version
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo.
call npm --version
echo.
echo Node.js is installed!
echo.

REM Step 3: Install dependencies
echo [STEP 3/4] Installing dependencies...
echo.
echo This may take a few minutes. Please wait...
echo.

if not exist "node_modules" (
    echo node_modules folder not found. Installing all dependencies...
    echo.
    call npm install
) else (
    echo node_modules exists. Checking web dependencies...
    echo.
)

REM Install specific web dependencies
echo.
echo Installing web-specific dependencies...
echo.
call npm install react-dom@19.1.0 react-native-web@0.21.1 2>nul
call npm install --save-dev vite@5.4.10 @vitejs/plugin-react@4.3.3 vite-plugin-react-native-web@2.3.0 2>nul

echo.
echo Dependencies installed!
echo.

REM Step 4: Start server
echo [STEP 4/4] Starting web server...
echo.
echo ========================================
echo   SERVER STARTING
echo ========================================
echo.
echo IMPORTANT:
echo   1. Wait for the message: "Web is waiting on http://localhost:8081"
echo   2. Your browser will open automatically
echo   3. If not, manually open: http://localhost:8081
echo.
echo   Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Start the server and open browser after 15 seconds
start /B timeout /t 15 /nobreak >nul && start http://localhost:8081

REM Run expo
call npx expo start --web

echo.
echo Server stopped.
pause

