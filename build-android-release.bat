@echo off
echo ========================================
echo   Building Android Release APK
echo   MapTiler API Key: 8MaoCcKOtQUbnHcNOBQn
echo ========================================
echo.

echo [1/6] Generating native Android project...
call npx expo prebuild --platform android --clean

if errorlevel 1 (
    echo [ERROR] Failed to generate Android project
    pause
    exit /b 1
)

echo.
echo [2/6] Copying network security config...
if not exist "android\app\src\main\res\xml" mkdir "android\app\src\main\res\xml"
copy /Y "android-config\network_security_config.xml" "android\app\src\main\res\xml\network_security_config.xml"

echo.
echo [3/6] Copying ProGuard rules...
copy /Y "android-config\proguard-rules.pro" "android\app\proguard-rules.pro"

echo.
echo [4/6] Updating AndroidManifest.xml...
copy /Y "android-config\AndroidManifest.xml" "android\app\src\main\AndroidManifest.xml"

echo.
echo [5/6] Cleaning previous builds...
cd android
call gradlew clean

echo.
echo [6/6] Building release APK...
call gradlew assembleRelease

if errorlevel 1 (
    echo [ERROR] Build failed
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo Next steps:
echo   1. Transfer APK to your Android device
echo   2. Install and test the app
echo   3. Verify map loads with street names
echo.
pause

