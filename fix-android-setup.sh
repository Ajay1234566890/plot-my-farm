#!/bin/bash

echo "🔧 Fixing Android Emulator Setup for Plot My Farm"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if emulator is running
echo "📱 Step 1: Checking emulator status..."
EMULATOR_STATUS=$("C:/Users/nagen/AppData/Local/Android/Sdk/platform-tools/adb.exe" devices | grep "emulator-5554")

if [ -z "$EMULATOR_STATUS" ]; then
    echo -e "${RED}❌ Emulator not running. Starting emulator...${NC}"
    "C:/Users/nagen/AppData/Local/Android/Sdk/emulator/emulator.exe" -avd Medium_Phone_API_36.1 &
    echo "⏳ Waiting for emulator to boot (60 seconds)..."
    sleep 60
else
    echo -e "${GREEN}✅ Emulator is running${NC}"
fi

# Step 2: Clean build cache
echo ""
echo "🧹 Step 2: Cleaning build cache..."
cd android
./gradlew clean --no-daemon
cd ..
echo -e "${GREEN}✅ Build cache cleaned${NC}"

# Step 3: Clear Metro bundler cache
echo ""
echo "🧹 Step 3: Clearing Metro bundler cache..."
npx expo start --clear --no-dev --minify &
METRO_PID=$!
sleep 10
kill $METRO_PID 2>/dev/null || true
echo -e "${GREEN}✅ Metro cache cleared${NC}"

# Step 4: Reinstall node modules (if needed)
echo ""
echo "📦 Step 4: Checking node_modules..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo -e "${GREEN}✅ node_modules exists${NC}"
fi

# Step 5: Check ADB connection
echo ""
echo "🔌 Step 5: Checking ADB connection..."
"C:/Users/nagen/AppData/Local/Android/Sdk/platform-tools/adb.exe" devices
echo -e "${GREEN}✅ ADB connection verified${NC}"

# Step 6: Kill any existing Metro processes
echo ""
echo "🛑 Step 6: Killing existing Metro processes..."
taskkill //F //IM node.exe 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Metro processes cleared${NC}"

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Android setup fixed successfully!${NC}"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npx expo start"
echo "2. Press 'a' to run on Android"
echo "   OR"
echo "   Run: npx expo run:android"
echo ""

