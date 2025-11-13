# Start Plot My Farm with Metro Bundler
# Simpler approach - just start Metro and let it handle the build

Write-Host "🚀 Starting Plot My Farm" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if emulator is running
Write-Host "📱 Checking emulator..." -ForegroundColor Yellow
$adbPath = "C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe"

try {
    $devices = & $adbPath devices 2>$null
    if ($devices -match "emulator-5554.*device") {
        Write-Host "✅ Emulator is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Emulator not detected - starting it now..." -ForegroundColor Yellow
        $emulatorPath = "C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe"
        Start-Process -FilePath $emulatorPath -ArgumentList "-avd","Medium_Phone_API_36.1"
        Write-Host "⏳ Waiting for emulator to boot (30 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
    }
} catch {
    Write-Host "⚠️  Could not check emulator status" -ForegroundColor Yellow
}

# Kill existing Metro processes
Write-Host ""
Write-Host "🛑 Clearing old processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Metro bundler
Write-Host ""
Write-Host "🎯 Starting Metro bundler..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Once Metro starts, press 'a' to run on Android" -ForegroundColor Cyan
Write-Host "Or scan the QR code with Expo Go app" -ForegroundColor Cyan
Write-Host ""

npx expo start --clear


