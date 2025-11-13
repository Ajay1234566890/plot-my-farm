@echo off
cls
echo ========================================
echo   Plot My Farm - Simple Localhost
echo ========================================
echo.

echo [1/5] Killing old processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
taskkill /F /IM emulator.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo Done!
echo.

echo [2/5] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo.

echo [3/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies (this may take a few minutes)...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)
echo Dependencies OK!
echo.

echo [4/5] Checking web dependencies...
if not exist "node_modules\react-dom" (
    echo Installing react-dom...
    call npm install react-dom@19.1.0
)
if not exist "node_modules\react-native-web" (
    echo Installing react-native-web...
    call npm install react-native-web@0.21.1
)
if not exist "node_modules\vite" (
    echo Installing vite...
    call npm install --save-dev vite@5.4.10 @vitejs/plugin-react@4.3.3 vite-plugin-react-native-web@2.3.0
)
echo Web dependencies OK!
echo.

echo [5/5] Starting Expo web server...
echo.
echo ========================================
echo   IMPORTANT: Wait for the URL!
echo ========================================
echo.
echo Look for a message like:
echo   "Web is waiting on http://localhost:8081"
echo.
echo Then open that URL in your browser!
echo.
echo If you see errors, press Ctrl+C and run again
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npx expo start --web

pause

