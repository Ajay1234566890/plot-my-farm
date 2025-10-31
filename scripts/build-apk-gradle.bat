@echo off
REM Plot My Farm - APK Build Script with Gradle (Windows)
REM This script automates the APK build process

setlocal enabledelayedexpansion

echo.
echo 🚀 Plot My Farm - APK Build with Gradle
echo ========================================
echo.

REM Check Java
echo 📋 Checking prerequisites...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found. Please install JDK 11 or higher.
    pause
    exit /b 1
)
echo ✅ Java found
for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr /R "version"') do echo    %%i

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found.
    pause
    exit /b 1
)
echo ✅ Node.js found: 
for /f "tokens=*" %%i in ('node --version') do echo    %%i

REM Check Android SDK
if not defined ANDROID_HOME (
    echo ⚠️  ANDROID_HOME not set. Trying to find Android SDK...
    if exist "%USERPROFILE%\AppData\Local\Android\Sdk" (
        set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
        echo ✅ Found Android SDK at: !ANDROID_HOME!
    ) else (
        echo ❌ Android SDK not found. Please set ANDROID_HOME.
        pause
        exit /b 1
    )
) else (
    echo ✅ Android SDK found at: !ANDROID_HOME!
)

echo.
echo 📦 Step 1: Generating native Android project...

if not exist "android" (
    echo Creating native Android project with expo prebuild...
    call npx expo prebuild --platform android --clean
    echo ✅ Native project generated
) else (
    echo ⚠️  Android directory already exists.
    set /p REGEN="Do you want to regenerate? (y/n): "
    if /i "!REGEN!"=="y" (
        call npx expo prebuild --platform android --clean
        echo ✅ Native project regenerated
    )
)

echo.
echo 🔑 Step 2: Checking signing key...

if not exist "my-release-key.keystore" (
    echo ⚠️  Signing key not found. Creating new keystore...
    echo.
    echo Please enter the following information:
    set /p KEYSTORE_PASSWORD="Keystore password: "
    set /p KEY_ALIAS="Key alias (default: my-key-alias): "
    if "!KEY_ALIAS!"=="" set KEY_ALIAS=my-key-alias
    set /p NAME="First and last name: "
    set /p ORG="Organization: "
    set /p CITY="City: "
    set /p STATE="State: "
    set /p COUNTRY="Country code (e.g., US): "
    
    keytool -genkey -v -keystore my-release-key.keystore ^
        -keyalg RSA -keysize 2048 -validity 10000 ^
        -alias !KEY_ALIAS! ^
        -dname "CN=!NAME!, OU=!ORG!, L=!CITY!, ST=!STATE!, C=!COUNTRY!" ^
        -storepass !KEYSTORE_PASSWORD! ^
        -keypass !KEYSTORE_PASSWORD!
    
    echo ✅ Keystore created
    
    REM Create keystore.properties
    (
        echo storeFile=../my-release-key.keystore
        echo storePassword=!KEYSTORE_PASSWORD!
        echo keyAlias=!KEY_ALIAS!
        echo keyPassword=!KEYSTORE_PASSWORD!
    ) > android\keystore.properties
    echo ✅ Keystore properties configured
) else (
    echo ✅ Signing key found
)

echo.
echo 🔨 Step 3: Building APK with Gradle...
echo.
echo Select build type:
echo 1) Debug APK (faster, for testing)
echo 2) Release APK (optimized, for production)
echo 3) App Bundle (for Play Store)
set /p BUILD_TYPE="Enter choice (1-3): "

cd android

if "!BUILD_TYPE!"=="1" (
    echo Building debug APK...
    call gradlew assembleDebug
    set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
    echo ✅ Debug APK built successfully
) else if "!BUILD_TYPE!"=="2" (
    echo Building release APK...
    call gradlew assembleRelease
    set APK_PATH=app\build\outputs\apk\release\app-release.apk
    echo ✅ Release APK built successfully
) else if "!BUILD_TYPE!"=="3" (
    echo Building app bundle...
    call gradlew bundleRelease
    set APK_PATH=app\build\outputs\bundle\release\app-release.aab
    echo ✅ App bundle built successfully
) else (
    echo ❌ Invalid choice
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo 📊 Step 4: Verifying build...

if exist "!APK_PATH!" (
    for %%A in ("!APK_PATH!") do set SIZE=%%~zA
    echo ✅ APK file created: !APK_PATH!
    echo ✅ File size: !SIZE! bytes
) else (
    echo ❌ APK file not found at !APK_PATH!
    pause
    exit /b 1
)

echo.
echo 📱 Step 5: Installation options...
echo.
echo To install on device:
echo   adb install -r !APK_PATH!
echo.
echo Or use Android Studio to run the app.
echo.

set /p INSTALL="Do you want to install on connected device? (y/n): "
if /i "!INSTALL!"=="y" (
    where adb >nul 2>&1
    if errorlevel 1 (
        echo ❌ ADB not found. Please install Android SDK Platform Tools.
    ) else (
        echo Installing APK...
        adb install -r "!APK_PATH!"
        echo ✅ APK installed successfully
    )
)

echo.
echo 🎉 Build complete!
echo ========================================
echo ✅ APK ready at: !APK_PATH!
echo.
pause

