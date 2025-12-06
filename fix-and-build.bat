@echo off
setlocal EnableDelayedExpansion

echo ===============================================================================
echo   PLOT MY FARM - FIX & BUILD SCRIPT (CORRECTED)
echo ===============================================================================
echo.

REM --- 1. CHECK NODE VERSION ---
echo [1/8] Checking Node.js version...
node -v > temp_node_version.txt
set /p NODE_VERSION=<temp_node_version.txt
del temp_node_version.txt
echo Current Node version: %NODE_VERSION%

REM Warn if not Node 18 or 20
echo %NODE_VERSION% | findstr /C:"v18" >nul
if %errorlevel% neq 0 (
    echo %NODE_VERSION% | findstr /C:"v20" >nul
    if %errorlevel% neq 0 (
        echo [WARNING] You are running %NODE_VERSION%. Expo recommends Node 18 or 20.
        echo If the build fails, please switch to Node 20 using nvm.
        echo.
    )
)

REM --- 2. VERIFY & FIX ASSETS ---
echo.
echo [2/8] Verifying and cleaning assets...
if exist "scripts\fix-assets.js" (
    node scripts\fix-assets.js
    if !errorlevel! neq 0 (
        echo [FATAL ERROR] Asset verification failed.
        pause
        exit /b 1
    )
) else (
    echo [WARNING] scripts\fix-assets.js not found. Skipping asset verification.
)

REM --- 3. CLEANUP ENVIRONMENT ---
echo.
echo [3/8] Cleaning up environment...

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

REM --- 4. INSTALL DEPENDENCIES ---
echo.
echo [4/8] Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [FATAL ERROR] npm install failed.
    pause
    exit /b 1
)

REM --- 5. EXPO PREBUILD ---
echo.
echo [5/8] Running Expo Prebuild...
REM Removed --no-interactive as it is not supported
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo [FATAL ERROR] Expo prebuild failed.
    pause
    exit /b 1
)

REM --- 6. APPLY CONFIGURATION PATCHES ---
echo.
echo [6/8] Applying Android configuration patches...

REM Create xml directory if it doesn't exist
if not exist "android\app\src\main\res\xml" (
    mkdir "android\app\src\main\res\xml"
)

REM Write network_security_config.xml directly to ensure it is correct
(
echo ^<?xml version="1.0" encoding="utf-8"?^>
echo ^<network-security-config^>
echo     ^<domain-config cleartextTrafficPermitted="true"^>
echo         ^<domain includeSubdomains="true"^>api.maptiler.com^</domain^>
echo         ^<domain includeSubdomains="true"^>maptiler.com^</domain^>
echo         ^<domain includeSubdomains="true"^>supabase.co^</domain^>
echo         ^<domain includeSubdomains="true"^>10.0.2.2^</domain^>
echo         ^<domain includeSubdomains="true"^>localhost^</domain^>
echo     ^</domain-config^>
echo     ^<base-config cleartextTrafficPermitted="true"^>
echo         ^<trust-anchors^>
echo             ^<certificates src="system" /^>
echo             ^<certificates src="user" /^>
echo         ^</trust-anchors^>
echo     ^</base-config^>
echo ^</network-security-config^>
) > "android\app\src\main\res\xml\network_security_config.xml"

REM Patch AndroidManifest.xml to ensure networkSecurityConfig is used
echo Patching AndroidManifest.xml...
set "MANIFEST_PATH=android\app\src\main\AndroidManifest.xml"
if exist "%MANIFEST_PATH%" (
    powershell -Command "(Get-Content '%MANIFEST_PATH%') -replace 'android:usesCleartextTraffic=\"true\"', 'android:usesCleartextTraffic=\"true\" android:networkSecurityConfig=\"@xml/network_security_config\"' | Set-Content '%MANIFEST_PATH%'"
)

REM --- 7. BUILD APK ---
echo.
echo [7/8] Building Release APK...
cd android

REM Clean Gradle
call gradlew.bat clean

REM Assemble Release
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo.
    echo [FATAL ERROR] Gradle build failed.
    cd ..
    pause
    exit /b 1
)

cd ..

REM --- 8. SUCCESS ---
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
pause
