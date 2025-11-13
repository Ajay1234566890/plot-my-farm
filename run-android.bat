@echo off
REM Set environment variables for Android development
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\nagen\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME\emulator;%PATH%

echo ========================================
echo Android Development Environment Setup
echo ========================================
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo ========================================
echo.

REM Check if emulator is running
echo Checking for running emulators...
"%ANDROID_HOME%\platform-tools\adb.exe" devices
echo.

REM Run the app
echo Starting Expo Android build...
npx expo run:android

