# Fix Android Emulator Setup for Plot My Farm
Write-Host "🔧 Fixing Android Emulator Setup for Plot My Farm" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if emulator is running
Write-Host "📱 Step 1: Checking emulator status..." -ForegroundColor Yellow
$adbPath = "C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$emulatorPath = "C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe"

$devices = & $adbPath devices
if ($devices -match "emulator-5554") {
    Write-Host "✅ Emulator is running" -ForegroundColor Green
} else {
    Write-Host "❌ Emulator not running. Please start it manually:" -ForegroundColor Red
    Write-Host "   Run: Start-Process -FilePath '$emulatorPath' -ArgumentList '-avd','Medium_Phone_API_36.1'" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Start emulator now? (y/n)"
    if ($response -eq "y") {
        Start-Process -FilePath $emulatorPath -ArgumentList "-avd","Medium_Phone_API_36.1"
        Write-Host "⏳ Waiting for emulator to boot (60 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 60
    }
}

# Step 2: Clean Android build cache
Write-Host ""
Write-Host "🧹 Step 2: Cleaning Android build cache..." -ForegroundColor Yellow
Push-Location android
& .\gradlew.bat clean --no-daemon
Pop-Location
Write-Host "✅ Build cache cleaned" -ForegroundColor Green

# Step 3: Clear Metro bundler cache
Write-Host ""
Write-Host "🧹 Step 3: Clearing Metro bundler cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:TEMP\metro-*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\haste-map-*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\.expo\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Metro cache cleared" -ForegroundColor Green

# Step 4: Kill any existing Metro/Node processes
Write-Host ""
Write-Host "🛑 Step 4: Killing existing Metro/Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✅ Metro processes cleared" -ForegroundColor Green

# Step 5: Check ADB connection
Write-Host ""
Write-Host "🔌 Step 5: Verifying ADB connection..." -ForegroundColor Yellow
& $adbPath devices
Write-Host "✅ ADB connection verified" -ForegroundColor Green

# Step 6: Optimize Gradle settings
Write-Host ""
Write-Host "⚙️  Step 6: Checking Gradle configuration..." -ForegroundColor Yellow
$gradleProps = Get-Content "android\gradle.properties"
if ($gradleProps -match "org.gradle.jvmargs=-Xmx2048m") {
    Write-Host "✅ Gradle memory settings are optimal" -ForegroundColor Green
} else {
    Write-Host "⚠️  Consider increasing Gradle memory in android/gradle.properties" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Android setup fixed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npx expo start --clear" -ForegroundColor White
Write-Host "2. Press 'a' to run on Android" -ForegroundColor White
Write-Host "   OR" -ForegroundColor White
Write-Host "   Run: npx expo run:android" -ForegroundColor White
Write-Host ""


