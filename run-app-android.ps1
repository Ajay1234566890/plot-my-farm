# Run Plot My Farm on Android Emulator
# This script handles all the setup and runs the app

Write-Host "🚀 Starting Plot My Farm on Android" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Set Java Home (Android Studio's bundled JDK)
$possibleJavaPaths = @(
    "C:\Program Files\Android\Android Studio\jbr",
    "C:\Program Files\Android\Android Studio\jre",
    "C:\Program Files (x86)\Android\Android Studio\jbr",
    "C:\Program Files (x86)\Android\Android Studio\jre"
)

$javaHome = $null
foreach ($path in $possibleJavaPaths) {
    if (Test-Path $path) {
        $javaHome = $path
        break
    }
}

if ($javaHome) {
    Write-Host "✅ Found Java at: $javaHome" -ForegroundColor Green
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
} else {
    Write-Host "⚠️  Java not found in Android Studio directory" -ForegroundColor Yellow
    Write-Host "   The build will use system Java if available" -ForegroundColor Yellow
}

# Check if emulator is running
Write-Host ""
Write-Host "📱 Checking emulator status..." -ForegroundColor Yellow
$adbPath = "C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe"

$devices = & $adbPath devices 2>$null
if ($devices -match "emulator-5554.*device") {
    Write-Host "✅ Emulator is running" -ForegroundColor Green
} else {
    Write-Host "❌ Emulator not detected" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the emulator first:" -ForegroundColor Yellow
    Write-Host "  C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Kill any existing Metro bundlers
Write-Host ""
Write-Host "🛑 Stopping existing Metro bundlers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✅ Metro processes cleared" -ForegroundColor Green

# Run the app
Write-Host ""
Write-Host "🏗️  Building and running the app..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Use npx expo run:android
npx expo run:android --device emulator-5554

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ App launch complete!" -ForegroundColor Green
Write-Host ""

