# Complete Dependency Installation Script for Plot My Farm
# This script checks and installs ALL required dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Plot My Farm - Dependency Installer  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Track installation status
$allGood = $true

# ============================================
# 1. CHECK NODE.JS AND NPM
# ============================================
Write-Host "1. Checking Node.js and npm..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
        Write-Host "   Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    $allGood = $false
}

# Check npm (with execution policy bypass)
try {
    $npmVersion = & "npm" "--version" 2>$null
    if ($npmVersion) {
        Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  npm check failed (may be execution policy)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 2. CHECK ANDROID SDK
# ============================================
Write-Host "2. Checking Android SDK..." -ForegroundColor Yellow

$androidSdkPath = "C:\Users\nagen\AppData\Local\Android\Sdk"
if (Test-Path $androidSdkPath) {
    Write-Host "   ✅ Android SDK found at: $androidSdkPath" -ForegroundColor Green
    
    # Check platform-tools
    if (Test-Path "$androidSdkPath\platform-tools\adb.exe") {
        Write-Host "   ✅ ADB (Android Debug Bridge) installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ADB not found!" -ForegroundColor Red
        $allGood = $false
    }
    
    # Check build-tools
    if (Test-Path "$androidSdkPath\build-tools") {
        $buildTools = Get-ChildItem "$androidSdkPath\build-tools" -Directory | Select-Object -First 1
        if ($buildTools) {
            Write-Host "   ✅ Build Tools: $($buildTools.Name)" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠️  Build Tools not found" -ForegroundColor Yellow
    }
    
    # Check platforms
    if (Test-Path "$androidSdkPath\platforms") {
        $platforms = Get-ChildItem "$androidSdkPath\platforms" -Directory
        Write-Host "   ✅ Android Platforms: $($platforms.Count) installed" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Android SDK not found!" -ForegroundColor Red
    Write-Host "   Please install Android Studio from: https://developer.android.com/studio" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# ============================================
# 3. CHECK ANDROID EMULATOR
# ============================================
Write-Host "3. Checking Android Emulator..." -ForegroundColor Yellow

$emulatorPath = "$androidSdkPath\emulator\emulator.exe"
if (Test-Path $emulatorPath) {
    Write-Host "   ✅ Emulator executable found" -ForegroundColor Green
    
    # List available AVDs
    try {
        $avds = & $emulatorPath -list-avds 2>$null
        if ($avds) {
            Write-Host "   ✅ Available Emulators:" -ForegroundColor Green
            foreach ($avd in $avds) {
                Write-Host "      - $avd" -ForegroundColor White
            }
        } else {
            Write-Host "   ⚠️  No emulators configured!" -ForegroundColor Yellow
            Write-Host "   Create one in Android Studio > Device Manager" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Could not list emulators" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Emulator not found!" -ForegroundColor Red
    Write-Host "   Install via Android Studio SDK Manager" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# ============================================
# 4. CHECK JAVA (JDK)
# ============================================
Write-Host "4. Checking Java Development Kit..." -ForegroundColor Yellow

$javaPath = "C:\Program Files\Android\Android Studio\jbr"
if (Test-Path $javaPath) {
    Write-Host "   ✅ Java (JBR) found at: $javaPath" -ForegroundColor Green
    
    # Set JAVA_HOME for this session
    $env:JAVA_HOME = $javaPath
    Write-Host "   ✅ JAVA_HOME set for this session" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Android Studio JBR not found" -ForegroundColor Yellow
    Write-Host "   Gradle will attempt to use system Java" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 5. CHECK NODE_MODULES
# ============================================
Write-Host "5. Checking npm dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "   ✅ node_modules exists ($packageCount packages)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules not found - will install" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 6. INSTALL NPM DEPENDENCIES
# ============================================
Write-Host "6. Installing npm dependencies..." -ForegroundColor Yellow
Write-Host "   This may take several minutes..." -ForegroundColor White

try {
    & npm install
    Write-Host "   ✅ npm dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm install failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# ============================================
# 7. CHECK GRADLE
# ============================================
Write-Host "7. Checking Gradle..." -ForegroundColor Yellow

if (Test-Path "android\gradlew.bat") {
    Write-Host "   ✅ Gradle wrapper found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Gradle wrapper not found" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 8. VERIFY EXPO INSTALLATION
# ============================================
Write-Host "8. Verifying Expo installation..." -ForegroundColor Yellow

try {
    $expoVersion = & npx expo --version 2>$null
    if ($expoVersion) {
        Write-Host "   ✅ Expo CLI: $expoVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Expo check failed" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 9. SUMMARY AND RECOMMENDATIONS
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALLATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allGood) {
    Write-Host "✅ ALL DEPENDENCIES INSTALLED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Start the emulator:" -ForegroundColor White
    Write-Host "   C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Run the app:" -ForegroundColor White
    Write-Host "   npx expo start --clear" -ForegroundColor Gray
    Write-Host "   Then press 'a' for Android" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or use the helper script:" -ForegroundColor White
    Write-Host "   powershell -ExecutionPolicy Bypass -File start-app.ps1" -ForegroundColor Gray
} else {
    Write-Host "⚠️  SOME DEPENDENCIES MISSING" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install missing components:" -ForegroundColor Yellow
    Write-Host "- Node.js: https://nodejs.org/" -ForegroundColor White
    Write-Host "- Android Studio: https://developer.android.com/studio" -ForegroundColor White
    Write-Host "- Android SDK via Android Studio SDK Manager" -ForegroundColor White
    Write-Host "- Create an emulator in Android Studio Device Manager" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Environment Variables
Write-Host "Environment Variables (for this session):" -ForegroundColor Yellow
if ($env:JAVA_HOME) {
    Write-Host "  JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Green
}
if ($env:ANDROID_HOME) {
    Write-Host "  ANDROID_HOME = $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "  ANDROID_HOME = Not set (optional)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Installation script complete!" -ForegroundColor Cyan
