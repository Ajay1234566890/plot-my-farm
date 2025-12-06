@echo off
cd android
echo Building with logging...
call gradlew.bat assembleRelease -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=1g" --stacktrace --info > ..\build_debug.log 2>&1
if %errorlevel% neq 0 (
    echo BUILD FAILED
    exit /b 1
)
echo BUILD SUCCESS
