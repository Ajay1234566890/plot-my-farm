@echo off
cls
echo ========================================
echo   Install Web Dependencies
echo   Plot My Farm
echo ========================================
echo.

echo This will install all dependencies needed for localhost web development
echo.
pause
echo.

echo [1/6] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js OK!
echo.

echo [2/6] Checking npm...
call npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo npm OK!
echo.

echo [3/6] Installing all dependencies...
echo This may take 2-5 minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo.
    echo Try running as Administrator or check your internet connection
    pause
    exit /b 1
)
echo.
echo All dependencies installed!
echo.

echo [4/6] Verifying web dependencies...
echo.

echo Checking react-dom...
if exist "node_modules\react-dom" (
    echo   [OK] react-dom installed
) else (
    echo   [MISSING] Installing react-dom...
    call npm install react-dom@19.1.0
)

echo Checking react-native-web...
if exist "node_modules\react-native-web" (
    echo   [OK] react-native-web installed
) else (
    echo   [MISSING] Installing react-native-web...
    call npm install react-native-web@0.21.1
)

echo Checking vite...
if exist "node_modules\vite" (
    echo   [OK] vite installed
) else (
    echo   [MISSING] Installing vite...
    call npm install --save-dev vite@5.4.10
)

echo Checking @vitejs/plugin-react...
if exist "node_modules\@vitejs\plugin-react" (
    echo   [OK] @vitejs/plugin-react installed
) else (
    echo   [MISSING] Installing @vitejs/plugin-react...
    call npm install --save-dev @vitejs/plugin-react@4.3.3
)

echo Checking vite-plugin-react-native-web...
if exist "node_modules\vite-plugin-react-native-web" (
    echo   [OK] vite-plugin-react-native-web installed
) else (
    echo   [MISSING] Installing vite-plugin-react-native-web...
    call npm install --save-dev vite-plugin-react-native-web@2.3.0
)

echo.
echo All web dependencies verified!
echo.

echo [5/6] Clearing caches...
call npx expo start --clear >nul 2>&1
timeout /t 2 /nobreak >nul
taskkill /F /IM node.exe >nul 2>&1
echo Caches cleared!
echo.

echo [6/6] Testing web server...
echo Starting test server (will auto-stop in 10 seconds)...
echo.
start /B cmd /c "npx expo start --web >test-output.txt 2>&1"
timeout /t 10 /nobreak
taskkill /F /IM node.exe >nul 2>&1
echo.

if exist "test-output.txt" (
    echo Server test output:
    type test-output.txt
    del test-output.txt
)

echo.
echo ========================================
echo   INSTALLATION COMPLETE!
echo ========================================
echo.
echo All web dependencies are installed!
echo.
echo To run the app on localhost:
echo   1. Double-click: RUN-LOCALHOST-SIMPLE.bat
echo   2. Wait for the URL to appear
echo   3. Open that URL in your browser
echo.
echo ========================================
echo.

pause

