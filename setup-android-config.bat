@echo off
REM ===== AUTOMATED ANDROID CONFIGURATION SETUP =====
REM This script copies the configuration files to the correct locations after npx expo prebuild

echo.
echo ========================================
echo   ANDROID CONFIGURATION SETUP
echo ========================================
echo.

REM Check if android folder exists
if not exist "android" (
    echo [ERROR] android folder not found!
    echo.
    echo Please run this command first:
    echo   npx expo prebuild --platform android --clean
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking android folder structure...
if not exist "android\app\src\main\res\xml" (
    echo Creating xml folder...
    mkdir "android\app\src\main\res\xml"
)

echo [2/5] Copying network_security_config.xml...
copy /Y "android-config\network_security_config.xml" "android\app\src\main\res\xml\network_security_config.xml"
if errorlevel 1 (
    echo [ERROR] Failed to copy network_security_config.xml
    pause
    exit /b 1
)

echo [3/5] Copying proguard-rules.pro...
copy /Y "android-config\proguard-rules.pro" "android\app\proguard-rules.pro"
if errorlevel 1 (
    echo [ERROR] Failed to copy proguard-rules.pro
    pause
    exit /b 1
)

echo [4/5] Backing up AndroidManifest.xml...
if exist "android\app\src\main\AndroidManifest.xml" (
    copy /Y "android\app\src\main\AndroidManifest.xml" "android\app\src\main\AndroidManifest.xml.backup"
)

echo [5/5] Copying AndroidManifest.xml...
copy /Y "android-config\AndroidManifest.xml" "android\app\src\main\AndroidManifest.xml"
if errorlevel 1 (
    echo [ERROR] Failed to copy AndroidManifest.xml
    pause
    exit /b 1
)

echo.
echo ========================================
echo   CONFIGURATION COMPLETE!
echo ========================================
echo.
echo Next steps:
echo   1. Review android-config\build.gradle.patch
echo   2. Manually update android\app\build.gradle with the configurations
echo   3. Run: cd android
echo   4. Run: gradlew clean
echo   5. Run: gradlew assembleRelease
echo.
echo APK will be at: android\app\build\outputs\apk\release\app-release.apk
echo.
pause

