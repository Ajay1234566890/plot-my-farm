@echo off
echo ========================================
echo Plot My Farm - Release APK Builder
echo ========================================
echo.

REM Check if Java is installed
echo [1/4] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo.
    echo Please install Java JDK 17 from:
    echo https://adoptium.net/temurin/releases/
    echo.
    echo Make sure to:
    echo 1. Download Windows x64 JDK 17
    echo 2. Check "Set JAVA_HOME variable" during installation
    echo 3. Restart this terminal after installation
    echo.
    pause
    exit /b 1
)

echo SUCCESS: Java is installed
java -version
echo.

REM Navigate to android directory
echo [2/4] Navigating to android directory...
cd android
if %errorlevel% neq 0 (
    echo ERROR: Could not find android directory
    pause
    exit /b 1
)
echo SUCCESS: In android directory
echo.

REM Clean previous builds
echo [3/4] Cleaning previous builds...
call gradlew.bat clean
echo.

REM Build release APK
echo [4/4] Building release APK...
echo This may take 5-10 minutes on first build...
echo.
call gradlew.bat assembleRelease

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo BUILD FAILED
    echo ========================================
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo.
echo Your release APK is located at:
echo %cd%\app\build\outputs\apk\release\app-release.apk
echo.
echo APK Size:
dir app\build\outputs\apk\release\app-release.apk | find "app-release.apk"
echo.
echo Next steps:
echo 1. Transfer the APK to your Android device
echo 2. Enable "Install from unknown sources" in device settings
echo 3. Install the APK
echo.
pause
