# 🎯 Complete Gradle APK Build Guide - Plot My Farm

## Overview

This guide provides everything you need to build an APK using Gradle instead of Expo/EAS. You'll have full control over the build process and can customize it as needed.

---

## 📚 Documentation Files

### Quick References
1. **GRADLE_BUILD_QUICK_REFERENCE.md** - Commands and quick start
2. **GRADLE_BUILD_STEP_BY_STEP.md** - Detailed walkthrough
3. **GRADLE_APK_BUILD_GUIDE.md** - Comprehensive guide

### Automation Scripts
1. **scripts/build-apk-gradle.sh** - Automated build (Mac/Linux)
2. **scripts/build-apk-gradle.bat** - Automated build (Windows)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Check Prerequisites
```bash
java -version          # JDK 11+
echo $ANDROID_HOME     # Android SDK
node --version         # Node 16+
```

### Step 2: Generate Native Project
```bash
npx expo prebuild --platform android --clean
```

### Step 3: Create Signing Key
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

### Step 4: Build APK
```bash
cd android
./gradlew assembleRelease
```

### Step 5: Install
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

---

## 📋 Prerequisites

### Required Software
- **Java JDK 11+** - For compilation
- **Android SDK** - For Android tools
- **Node.js 16+** - For Expo
- **Gradle** - Included with Android SDK

### Installation

**Java:**
- Windows: https://www.oracle.com/java/technologies/downloads/
- Mac: `brew install openjdk@11`
- Linux: `sudo apt-get install openjdk-11-jdk`

**Android SDK:**
- Download Android Studio from https://developer.android.com/studio
- Or download SDK tools only

**Environment Variables:**
```bash
# Mac/Linux
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/path/to/jdk

# Windows
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Java\jdk-11
```

---

## 🔑 Signing Key Setup

### Generate Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

### Create Keystore Properties
File: `android/keystore.properties`
```properties
storeFile=../my-release-key.keystore
storePassword=YOUR_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_PASSWORD
```

### Security
- Add to `.gitignore`:
  ```
  my-release-key.keystore
  android/keystore.properties
  ```
- Keep keystore file safe
- Don't commit to version control

---

## 🔨 Build Process

### Step 1: Generate Native Project
```bash
npx expo prebuild --platform android --clean
```

Creates:
- `android/` directory
- Gradle build files
- Android manifest
- Native configuration

### Step 2: Configure Gradle
Update `android/app/build.gradle`:
```gradle
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
    }
}
```

### Step 3: Build APK
```bash
cd android

# Debug APK (fast)
./gradlew assembleDebug

# Release APK (optimized)
./gradlew assembleRelease

# App Bundle (Play Store)
./gradlew bundleRelease
```

### Step 4: Install
```bash
adb install -r app-release.apk
```

---

## 📊 Build Types

### Debug APK
- **Command**: `./gradlew assembleDebug`
- **Time**: 2-5 minutes
- **Size**: 50-80 MB
- **Use**: Testing and development
- **Location**: `app/build/outputs/apk/debug/app-debug.apk`

### Release APK
- **Command**: `./gradlew assembleRelease`
- **Time**: 5-10 minutes
- **Size**: 30-50 MB
- **Use**: Production and distribution
- **Location**: `app/build/outputs/apk/release/app-release.apk`

### App Bundle
- **Command**: `./gradlew bundleRelease`
- **Time**: 5-10 minutes
- **Size**: 20-40 MB
- **Use**: Google Play Store
- **Location**: `app/build/outputs/bundle/release/app-release.aab`

---

## 🔧 Automation Scripts

### Mac/Linux
```bash
chmod +x scripts/build-apk-gradle.sh
./scripts/build-apk-gradle.sh
```

### Windows
```cmd
scripts\build-apk-gradle.bat
```

**Features:**
- Checks prerequisites
- Generates native project
- Creates signing key
- Builds APK
- Installs on device

---

## 📱 Installation

### Using ADB
```bash
# Install debug APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Install release APK
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Uninstall
adb uninstall com.plotmyfarm.app
```

### Using Android Studio
1. Open `android/` folder
2. Click "Run" → "Run 'app'"
3. Select device
4. APK will be built and installed

---

## ✅ Verification

### Check Build
```bash
# APK size
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Verify signing
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk

# List contents
unzip -l android/app/build/outputs/apk/release/app-release.apk
```

### Test on Device
1. Launch app
2. Test login
3. Verify database connectivity
4. Test all features
5. Check error handling

---

## 🐛 Troubleshooting

### Build Fails
```bash
cd android
./gradlew clean
./gradlew assembleRelease --info
```

### Java Not Found
```bash
export JAVA_HOME=/path/to/jdk
```

### Android SDK Not Found
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

### Out of Memory
```bash
export GRADLE_OPTS="-Xmx2048m"
```

### Gradle Wrapper Issues
```bash
cd android
gradle wrapper --gradle-version 7.5
```

---

## 📋 Checklist

- [ ] Java JDK 11+ installed
- [ ] Android SDK installed
- [ ] ANDROID_HOME set
- [ ] JAVA_HOME set
- [ ] Native project generated
- [ ] Signing key created
- [ ] Keystore properties configured
- [ ] Gradle build configured
- [ ] APK built successfully
- [ ] APK installed on device
- [ ] App tested on device

---

## 🎯 Next Steps

1. **Immediate**
   - Check prerequisites
   - Generate native project
   - Create signing key

2. **Build**
   - Configure Gradle
   - Build APK
   - Install on device

3. **Test**
   - Test all features
   - Verify database connectivity
   - Check error handling

4. **Deploy**
   - Upload to Play Store
   - Create app listing
   - Submit for review

---

## 📞 Resources

- **Android Gradle Plugin**: https://developer.android.com/studio/releases/gradle-plugin
- **Gradle Documentation**: https://gradle.org/
- **Android Developer**: https://developer.android.com/
- **Keytool Documentation**: https://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html

---

## 🎉 Success!

Your APK is ready for:
- ✅ Testing on device
- ✅ Distribution to users
- ✅ Upload to Google Play Store

---

**Status**: ✅ READY FOR GRADLE BUILD
**Last Updated**: 2025-10-22

