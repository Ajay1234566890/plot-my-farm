@echo off
echo ========================================
echo   BUILDING WITH INCREASED MEMORY
echo ========================================
echo.

cd android

echo Cleaning...
call gradlew.bat clean

echo Building with 4GB Heap and 1GB Metaspace...
call gradlew.bat assembleRelease -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=1g"

if %errorlevel% neq 0 (
    echo.
    echo [FATAL ERROR] Build failed even with increased memory.
    exit /b 1
)

echo.
echo BUILD SUCCESSFUL!
echo APK: %CD%\app\build\outputs\apk\release\app-release.apk
pause
