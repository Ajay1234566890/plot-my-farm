#!/bin/bash

# Plot My Farm - APK Build Script with Gradle
# This script automates the APK build process

set -e

echo "🚀 Plot My Farm - APK Build with Gradle"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Please install JDK 11 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java found: $(java -version 2>&1 | head -n 1)${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${YELLOW}⚠️  ANDROID_HOME not set. Trying to find Android SDK...${NC}"
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        echo -e "${GREEN}✅ Found Android SDK at: $ANDROID_HOME${NC}"
    else
        echo -e "${RED}❌ Android SDK not found. Please set ANDROID_HOME.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Android SDK found at: $ANDROID_HOME${NC}"
fi

echo ""
echo "📦 Step 1: Generating native Android project..."

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "Creating native Android project with expo prebuild..."
    npx expo prebuild --platform android --clean
    echo -e "${GREEN}✅ Native project generated${NC}"
else
    echo -e "${YELLOW}⚠️  Android directory already exists. Skipping prebuild.${NC}"
    read -p "Do you want to regenerate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx expo prebuild --platform android --clean
        echo -e "${GREEN}✅ Native project regenerated${NC}"
    fi
fi

echo ""
echo "🔑 Step 2: Checking signing key..."

if [ ! -f "my-release-key.keystore" ]; then
    echo -e "${YELLOW}⚠️  Signing key not found. Creating new keystore...${NC}"
    echo ""
    echo "Please enter the following information:"
    read -p "Keystore password: " -s KEYSTORE_PASSWORD
    echo ""
    read -p "Key alias (default: my-key-alias): " KEY_ALIAS
    KEY_ALIAS=${KEY_ALIAS:-my-key-alias}
    read -p "First and last name: " NAME
    read -p "Organization: " ORG
    read -p "City: " CITY
    read -p "State: " STATE
    read -p "Country code (e.g., US): " COUNTRY
    
    keytool -genkey -v -keystore my-release-key.keystore \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -alias "$KEY_ALIAS" \
        -dname "CN=$NAME, OU=$ORG, L=$CITY, ST=$STATE, C=$COUNTRY" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEYSTORE_PASSWORD"
    
    echo -e "${GREEN}✅ Keystore created${NC}"
    
    # Create keystore.properties
    cat > android/keystore.properties << EOF
storeFile=../my-release-key.keystore
storePassword=$KEYSTORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEYSTORE_PASSWORD
EOF
    echo -e "${GREEN}✅ Keystore properties configured${NC}"
else
    echo -e "${GREEN}✅ Signing key found${NC}"
fi

echo ""
echo "🔨 Step 3: Building APK with Gradle..."

# Ask for build type
echo ""
echo "Select build type:"
echo "1) Debug APK (faster, for testing)"
echo "2) Release APK (optimized, for production)"
echo "3) App Bundle (for Play Store)"
read -p "Enter choice (1-3): " BUILD_TYPE

cd android

case $BUILD_TYPE in
    1)
        echo "Building debug APK..."
        ./gradlew assembleDebug
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
        echo -e "${GREEN}✅ Debug APK built successfully${NC}"
        ;;
    2)
        echo "Building release APK..."
        ./gradlew assembleRelease
        APK_PATH="app/build/outputs/apk/release/app-release.apk"
        echo -e "${GREEN}✅ Release APK built successfully${NC}"
        ;;
    3)
        echo "Building app bundle..."
        ./gradlew bundleRelease
        APK_PATH="app/build/outputs/bundle/release/app-release.aab"
        echo -e "${GREEN}✅ App bundle built successfully${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

cd ..

echo ""
echo "📊 Step 4: Verifying build..."

if [ -f "$APK_PATH" ]; then
    SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo -e "${GREEN}✅ APK file created: $APK_PATH${NC}"
    echo -e "${GREEN}✅ File size: $SIZE${NC}"
else
    echo -e "${RED}❌ APK file not found at $APK_PATH${NC}"
    exit 1
fi

echo ""
echo "📱 Step 5: Installation options..."
echo ""
echo "To install on device:"
echo "  adb install -r $APK_PATH"
echo ""
echo "Or use Android Studio to run the app."
echo ""

# Ask if user wants to install
read -p "Do you want to install on connected device? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v adb &> /dev/null; then
        echo "Installing APK..."
        adb install -r "$APK_PATH"
        echo -e "${GREEN}✅ APK installed successfully${NC}"
    else
        echo -e "${RED}❌ ADB not found. Please install Android SDK Platform Tools.${NC}"
    fi
fi

echo ""
echo "🎉 Build complete!"
echo "========================================"
echo -e "${GREEN}✅ APK ready at: $APK_PATH${NC}"
echo ""

