# 🚀 Build APK with Gradle - Complete Guide

## Prerequisites

### Required Software
- Node.js 16+ (already installed)
- Java Development Kit (JDK) 11 or higher
- Android SDK
- Gradle (will be installed automatically)

### Check Java Installation
```bash
java -version
javac -version
```

If not installed:
- **Windows**: Download from https://www.oracle.com/java/technologies/downloads/
- **Mac**: `brew install openjdk@11`
- **Linux**: `sudo apt-get install openjdk-11-jdk`

---

## Step 1: Generate Native Android Project

### Option A: Using Expo Prebuild (Recommended)
```bash
# Install expo-cli if not already installed
npm install -g expo-cli

# Generate native Android project
npx expo prebuild --platform android --clean
```

This creates an `android/` directory with the native Android project.

### Option B: Using Bare React Native
If you prefer a bare React Native setup, you can eject from Expo:
```bash
npx expo prebuild --platform android
```

---

## Step 2: Configure Android Project

### Update app.json
```json
{
  "expo": {
    "name": "Plot My Farm",
    "slug": "plot-my-farm",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.plotmyfarm.app",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

---

## Step 3: Create Signing Key

### Generate Keystore File
```bash
# Create a keystore for signing
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

**When prompted, enter:**
- Keystore password: (create a strong password)
- Key password: (same as keystore password)
- First and last name: Your Name
- Organization: Your Company
- City: Your City
- State: Your State
- Country: Your Country Code (e.g., US)

**Save the keystore file securely!**

### Store Keystore Credentials
Create `android/keystore.properties`:
```properties
storeFile=../my-release-key.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_KEY_PASSWORD
```

**Add to .gitignore:**
```
my-release-key.keystore
android/keystore.properties
```

---

## Step 4: Configure Gradle Build

### Update android/app/build.gradle

Add signing configuration:
```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.plotmyfarm.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
    
    signingConfigs {
        release {
            storeFile file("../my-release-key.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "password"
            keyAlias System.getenv("KEY_ALIAS") ?: "my-key-alias"
            keyPassword System.getenv("KEY_PASSWORD") ?: "password"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            debuggable true
        }
    }
}
```

---

## Step 5: Build APK with Gradle

### Build Debug APK (Fastest)
```bash
cd android
./gradlew assembleDebug
```

**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK (Optimized)
```bash
cd android
./gradlew assembleRelease
```

**Output**: `android/app/build/outputs/apk/release/app-release.apk`

### Build App Bundle (For Play Store)
```bash
cd android
./gradlew bundleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Step 6: Install APK on Device

### Using ADB
```bash
# Connect device via USB
# Enable USB debugging on device

# Install debug APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Or install release APK
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### Using Android Studio
1. Open Android Studio
2. Click "Run" → "Run 'app'"
3. Select device
4. APK will be built and installed

---

## Step 7: Verify APK

### Check APK Information
```bash
# List APK contents
unzip -l android/app/build/outputs/apk/release/app-release.apk

# Check APK size
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Verify signing
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk
```

### Test on Device
1. Install APK
2. Launch app
3. Test all features
4. Verify database connectivity
5. Check error handling

---

## Troubleshooting

### Gradle Build Fails
```bash
# Clean build
cd android
./gradlew clean

# Rebuild
./gradlew assembleRelease
```

### Java Not Found
```bash
# Set JAVA_HOME
export JAVA_HOME=/path/to/jdk
# On Windows: set JAVA_HOME=C:\Program Files\Java\jdk-11
```

### Android SDK Not Found
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
# On Windows: set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
```

### Keystore Issues
```bash
# List keystore contents
keytool -list -v -keystore my-release-key.keystore

# Recreate keystore if lost
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

---

## Quick Commands

```bash
# Generate native project
npx expo prebuild --platform android --clean

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Build app bundle
cd android && ./gradlew bundleRelease

# Install APK
adb install -r app-release.apk

# Clean build
cd android && ./gradlew clean

# View build output
cd android && ./gradlew assembleRelease --info
```

---

## File Structure

```
Plot-My-Farm/
├── android/                    # Native Android project
│   ├── app/
│   │   ├── build/
│   │   │   └── outputs/
│   │   │       └── apk/
│   │   │           ├── debug/
│   │   │           │   └── app-debug.apk
│   │   │           └── release/
│   │   │               └── app-release.apk
│   │   ├── src/
│   │   └── build.gradle
│   ├── gradle/
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradlew
├── app/
├── package.json
├── app.json
├── my-release-key.keystore    # Keep secure!
└── android/keystore.properties # Keep secure!
```

---

## Environment Variables (Optional)

For automated builds, set environment variables:
```bash
export KEYSTORE_PASSWORD="your_password"
export KEY_ALIAS="my-key-alias"
export KEY_PASSWORD="your_password"
```

Then build:
```bash
cd android && ./gradlew assembleRelease
```

---

## Next Steps

1. Generate native project: `npx expo prebuild --platform android --clean`
2. Create signing key: `keytool -genkey -v -keystore my-release-key.keystore ...`
3. Configure gradle: Update `android/app/build.gradle`
4. Build APK: `cd android && ./gradlew assembleRelease`
5. Install: `adb install -r app-release.apk`
6. Test on device
7. Upload to Play Store

---

**Status**: Ready to build with Gradle
**Last Updated**: 2025-10-22

