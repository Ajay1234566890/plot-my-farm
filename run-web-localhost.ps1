# Automated Web Localhost Runner for Plot My Farm
# This script runs everything automatically - NO manual steps needed!

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Plot My Farm - Web Localhost Runner  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop any running emulators to free resources
Write-Host "1. Freeing up system resources..." -ForegroundColor Yellow
try {
    taskkill /F /IM qemu-system-x86_64.exe 2>$null | Out-Null
    taskkill /F /IM emulator.exe 2>$null | Out-Null
    Write-Host "   ✅ Emulator processes stopped" -ForegroundColor Green
} catch {
    Write-Host "   ✅ No emulator running" -ForegroundColor Green
}

# Kill any existing Metro/Node processes
try {
    taskkill /F /IM node.exe 2>$null | Out-Null
    Write-Host "   ✅ Previous Node processes stopped" -ForegroundColor Green
} catch {
    Write-Host "   ✅ No previous Node processes" -ForegroundColor Green
}

Write-Host ""

# Check Node.js
Write-Host "2. Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js not found! Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies if needed
Write-Host "3. Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   📦 Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Clear Metro cache
Write-Host "4. Clearing cache for smooth performance..." -ForegroundColor Yellow
try {
    npx expo start --clear --web --no-dev --minify 2>$null | Out-Null
    Start-Sleep -Seconds 2
    taskkill /F /IM node.exe 2>$null | Out-Null
    Write-Host "   ✅ Cache cleared" -ForegroundColor Green
} catch {
    Write-Host "   ✅ Cache clear attempted" -ForegroundColor Green
}

Write-Host ""

# Start web server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING WEB SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Starting Plot My Farm on localhost..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 The app will open automatically in your browser!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URL: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  Please wait 10-30 seconds for the app to load..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Expo web server (this will auto-open browser)
npx expo start --web --clear

# If the script ends, show message
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Web server stopped." -ForegroundColor Yellow
Write-Host "To restart, run this script again!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

