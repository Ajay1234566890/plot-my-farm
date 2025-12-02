# Build APK for Plot My Farm
# This script builds a production-ready APK

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Plot My Farm - APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set Java Home
$javaPath = "C:\Program Files\Android\Android Studio\jbr"
if (Test-Path $javaPath) {
    $env:JAVA_HOME = $javaPath
    $env:PATH = "$javaPath\bin;$env:PATH"
    Write-Host "✅ JAVA_HOME set to: $javaPath" -ForegroundColor Green
} else {
    Write-Host "⚠️  Java not found at expected location" -ForegroundColor Yellow
}

Write-Host ""

# Check if android folder exists
if (-not (Test-Path "android")) {
    Write-Host "❌ Android folder not found!" -ForegroundColor Red
    Write-Host "   Generating Android native code..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        & npx expo prebuild --platform android --clean
        Write-Host "✅ Android folder generated" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to generate Android folder" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Build type selection
Write-Host "Select build type:" -ForegroundColor Yellow
Write-Host "1. Debug APK (faster, larger file, for testing)" -ForegroundColor White
Write-Host "2. Release APK (optimized, smaller file, for distribution)" -ForegroundColor White
Write-Host "3. Release AAB (for Google Play Store)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1, 2, or 3)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

switch ($choice) {
    "1" {
        Write-Host "Building DEBUG APK..." -ForegroundColor Yellow
        Write-Host ""
        
        Set-Location android
        & .\gradlew.bat assembleDebug
        Set-Location ..
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "✅ DEBUG APK BUILT!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Location:" -ForegroundColor Yellow
        Write-Host "  android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
        Write-Host ""
        Write-Host "Install on device:" -ForegroundColor Yellow
        Write-Host "  adb install android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Gray
    }
    
    "2" {
        Write-Host "Building RELEASE APK..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  Note: For production, you should sign the APK" -ForegroundColor Yellow
        Write-Host "   This will create an unsigned APK" -ForegroundColor Yellow
        Write-Host ""
        
        Set-Location android
        & .\gradlew.bat assembleRelease
        Set-Location ..
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "✅ RELEASE APK BUILT!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Location:" -ForegroundColor Yellow
        Write-Host "  android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  This APK is unsigned!" -ForegroundColor Yellow
        Write-Host "   For production, you need to sign it with a keystore" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Install on device:" -ForegroundColor Yellow
        Write-Host "  adb install android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Gray
    }
    
    "3" {
        Write-Host "Building RELEASE AAB (Android App Bundle)..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  Note: AAB must be signed for Play Store" -ForegroundColor Yellow
        Write-Host ""
        
        Set-Location android
        & .\gradlew.bat bundleRelease
        Set-Location ..
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "✅ RELEASE AAB BUILT!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Location:" -ForegroundColor Yellow
        Write-Host "  android\app\build\outputs\bundle\release\app-release.aab" -ForegroundColor White
        Write-Host ""
        Write-Host "📦 Upload this AAB to Google Play Console" -ForegroundColor Cyan
        Write-Host "   (Must be signed with upload key)" -ForegroundColor Yellow
    }
    
    default {
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show file size if exists
if ($choice -eq "1") {
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host "APK Size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
    }
} elseif ($choice -eq "2") {
    $apkPath = "android\app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host "APK Size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
    }
} elseif ($choice -eq "3") {
    $aabPath = "android\app\build\outputs\bundle\release\app-release.aab"
    if (Test-Path $aabPath) {
        $size = (Get-Item $aabPath).Length / 1MB
        Write-Host "AAB Size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Build complete!" -ForegroundColor Green
