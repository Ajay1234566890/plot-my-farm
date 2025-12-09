@echo off
setlocal EnableDelayedExpansion

echo ===============================================================================
echo   PLOT MY FARM - AUTOMATED BUILD SCRIPT (SIMPLIFIED)
echo ===============================================================================
echo.

REM --- 1. CHECK NODE VERSION ---
echo [1/6] Checking Node.js version...
node -v > temp_node_version.txt
set /p NODE_VERSION=<temp_node_version.txt
del temp_node_version.txt
echo Current Node version: %NODE_VERSION%

REM --- 2. CLEANUP ENVIRONMENT ---
echo.
echo [2/6] Cleaning up environment...

if exist "android" (
    echo Removing android folder...
    rmdir /s /q "android"
)

if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
    echo Removing package-lock.json...
    del /f /q "package-lock.json"
)

REM --- 3. INSTALL DEPENDENCIES ---
echo.
echo [3/6] Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [FATAL ERROR] npm install failed.
    exit /b 1
)

REM --- 4. EXPO PREBUILD ---
echo.
echo [4/6] Running Expo Prebuild...
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo [FATAL ERROR] Expo prebuild failed.
    exit /b 1
)

REM --- 5. BUILD APK ---
echo.
echo [5/6] Building Release APK...
cd android

REM Clean Gradle
call gradlew.bat clean

REM Assemble Release
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo.
    echo [FATAL ERROR] Gradle build failed.
    cd ..
    exit /b 1
)

cd ..

REM --- 6. SUCCESS ---
echo.
echo ===============================================================================
echo   BUILD SUCCESSFUL!
echo ===============================================================================
echo.
echo APK Location:
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo %CD%\android\app\build\outputs\apk\release\app-release.apk
) else (
    echo [WARNING] APK file not found in expected location, but build reported success.
    echo Check: android\app\build\outputs\apk\release\
)
echo.
