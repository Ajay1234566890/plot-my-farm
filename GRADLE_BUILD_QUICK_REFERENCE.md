# ⚡ Gradle APK Build - Quick Reference

## 🚀 5-Minute Quick Start

### Prerequisites
```bash
java -version          # JDK 11+
echo $ANDROID_HOME     # Android SDK path
node --version         # Node 16+
```

### Build in 5 Steps

**Step 1: Generate Native Project**
```bash
npx expo prebuild --platform android --clean
```

**Step 2: Create Signing Key**
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

**Step 3: Create Keystore Properties**
```bash
# Create android/keystore.properties
storeFile=../my-release-key.keystore
storePassword=YOUR_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_PASSWORD
```

**Step 4: Build APK**
```bash
cd android
./gradlew assembleRelease
```

**Step 5: Install**
```bash
adb install -r app/build/outputs/apk/release/app-release.apk
```

---

## 📋 Common Commands

### Build Commands
```bash
# Debug APK (fast, for testing)
cd android && ./gradlew assembleDebug

# Release APK (optimized, for production)
cd android && ./gradlew assembleRelease

# App Bundle (for Play Store)
cd android && ./gradlew bundleRelease

# Clean build
cd android && ./gradlew clean

# Build with verbose output
cd android && ./gradlew assembleRelease --info
```

### Installation Commands
```bash
# Install debug APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Install release APK
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Uninstall app
adb uninstall com.plotmyfarm.app

# List installed packages
adb shell pm list packages | grep plotmyfarm
```

### Verification Commands
```bash
# Check APK size
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Verify APK signing
jarsigner -verify -verbose android/app/build/outputs/apk/release/app-release.apk

# List APK contents
unzip -l android/app/build/outputs/apk/release/app-release.apk

# Check keystore
keytool -list -v -keystore my-release-key.keystore
```

---

## 🔑 Keystore Management

### Create Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

### List Keystore Contents
```bash
keytool -list -v -keystore my-release-key.keystore
```

### Export Certificate
```bash
keytool -export -alias my-key-alias \
  -keystore my-release-key.keystore \
  -file certificate.cer
```

### Get Certificate Fingerprint
```bash
keytool -list -v -keystore my-release-key.keystore \
  -alias my-key-alias
```

---

## 📁 Output Locations

```
Debug APK:
android/app/build/outputs/apk/debug/app-debug.apk

Release APK:
android/app/build/outputs/apk/release/app-release.apk

App Bundle:
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔧 Environment Variables

### Set ANDROID_HOME

**Mac/Linux:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

**Windows (Command Prompt):**
```cmd
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

### Set JAVA_HOME

**Mac/Linux:**
```bash
export JAVA_HOME=/path/to/jdk
```

**Windows:**
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-11
```

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
# Check Java installation
java -version
javac -version

# Set JAVA_HOME if needed
export JAVA_HOME=/path/to/jdk
```

### Android SDK Not Found
```bash
# Check Android SDK
ls $ANDROID_HOME

# Set ANDROID_HOME if needed
export ANDROID_HOME=$HOME/Android/Sdk
```

### Out of Memory
```bash
export GRADLE_OPTS="-Xmx2048m"
cd android && ./gradlew assembleRelease
```

### Gradle Wrapper Issues
```bash
cd android
gradle wrapper --gradle-version 7.5
./gradlew assembleRelease
```

---

## 📊 Build Types Comparison

| Type | Command | Time | Size | Use Case |
|------|---------|------|------|----------|
| Debug | `assembleDebug` | 2-5 min | 50-80 MB | Testing |
| Release | `assembleRelease` | 5-10 min | 30-50 MB | Production |
| Bundle | `bundleRelease` | 5-10 min | 20-40 MB | Play Store |

---

## ✅ Pre-Build Checklist

- [ ] Java JDK 11+ installed
- [ ] Android SDK installed
- [ ] ANDROID_HOME set
- [ ] JAVA_HOME set
- [ ] Native project generated
- [ ] Signing key created
- [ ] Keystore properties configured
- [ ] app.json configured
- [ ] build.gradle configured

---

## 🎯 Build Workflow

```
1. npx expo prebuild --platform android --clean
   ↓
2. keytool -genkey -v -keystore my-release-key.keystore ...
   ↓
3. Create android/keystore.properties
   ↓
4. cd android && ./gradlew assembleRelease
   ↓
5. adb install -r app-release.apk
   ↓
6. Test on device
```

---

## 📞 Useful Links

- **Android Gradle Plugin**: https://developer.android.com/studio/releases/gradle-plugin
- **Gradle Documentation**: https://gradle.org/
- **Android Developer**: https://developer.android.com/
- **Keytool Documentation**: https://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html

---

## 🎉 Success Indicators

✅ APK file created
✅ File size reasonable (30-80 MB)
✅ No build errors
✅ APK installs on device
✅ App launches without crashes
✅ Database connectivity works

---

**Last Updated**: 2025-10-22
**Status**: Ready to build

