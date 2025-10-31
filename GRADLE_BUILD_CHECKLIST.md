# ✅ Gradle APK Build - Complete Checklist

## Pre-Build Checklist

### Prerequisites Installation
- [ ] Java JDK 11+ installed
  - Command: `java -version`
  - Download: https://www.oracle.com/java/technologies/downloads/
  
- [ ] Android SDK installed
  - Download: https://developer.android.com/studio
  - Or: Android SDK tools only
  
- [ ] Node.js 16+ installed
  - Command: `node --version`
  - Download: https://nodejs.org/
  
- [ ] Gradle (included with Android SDK)
  - Verify: `gradle --version`

### Environment Variables
- [ ] ANDROID_HOME set
  - Mac/Linux: `export ANDROID_HOME=$HOME/Android/Sdk`
  - Windows: `set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk`
  - Verify: `echo $ANDROID_HOME`
  
- [ ] JAVA_HOME set
  - Mac/Linux: `export JAVA_HOME=/path/to/jdk`
  - Windows: `set JAVA_HOME=C:\Program Files\Java\jdk-11`
  - Verify: `echo $JAVA_HOME`
  
- [ ] PATH includes Android tools
  - Verify: `adb --version`

### Project Setup
- [ ] Plot My Farm project cloned/downloaded
- [ ] Dependencies installed: `npm install`
- [ ] Supabase configured in `.env`
- [ ] Database verified and working

---

## Build Preparation Checklist

### Step 1: Generate Native Project
- [ ] Run: `npx expo prebuild --platform android --clean`
- [ ] Verify: `android/` directory created
- [ ] Verify: `android/app/build.gradle` exists
- [ ] Verify: `android/gradlew` exists

### Step 2: Create Signing Key
- [ ] Run: `keytool -genkey -v -keystore my-release-key.keystore ...`
- [ ] Verify: `my-release-key.keystore` file created
- [ ] Save: Keystore password securely
- [ ] Save: Key alias and password

### Step 3: Create Keystore Properties
- [ ] Create: `android/keystore.properties`
- [ ] Add: `storeFile=../my-release-key.keystore`
- [ ] Add: `storePassword=YOUR_PASSWORD`
- [ ] Add: `keyAlias=my-key-alias`
- [ ] Add: `keyPassword=YOUR_PASSWORD`
- [ ] Verify: File created correctly

### Step 4: Configure Gradle
- [ ] Update: `android/app/build.gradle`
- [ ] Add: `signingConfigs` block
- [ ] Add: `buildTypes` block
- [ ] Verify: Configuration correct

### Step 5: Security Setup
- [ ] Add to `.gitignore`: `my-release-key.keystore`
- [ ] Add to `.gitignore`: `android/keystore.properties`
- [ ] Verify: Files not committed to git
- [ ] Backup: Keystore file to secure location

---

## Build Execution Checklist

### Debug Build (Testing)
- [ ] Navigate: `cd android`
- [ ] Run: `./gradlew assembleDebug`
- [ ] Wait: 2-5 minutes
- [ ] Verify: `app/build/outputs/apk/debug/app-debug.apk` created
- [ ] Check: File size reasonable (50-80 MB)

### Release Build (Production)
- [ ] Navigate: `cd android`
- [ ] Run: `./gradlew assembleRelease`
- [ ] Wait: 5-10 minutes
- [ ] Verify: `app/build/outputs/apk/release/app-release.apk` created
- [ ] Check: File size reasonable (30-50 MB)

### App Bundle (Play Store)
- [ ] Navigate: `cd android`
- [ ] Run: `./gradlew bundleRelease`
- [ ] Wait: 5-10 minutes
- [ ] Verify: `app/build/outputs/bundle/release/app-release.aab` created
- [ ] Check: File size reasonable (20-40 MB)

---

## Installation Checklist

### Device Setup
- [ ] Android device connected via USB
- [ ] USB debugging enabled on device
- [ ] Device recognized: `adb devices`
- [ ] Device shows in list

### Installation
- [ ] Run: `adb install -r android/app/build/outputs/apk/release/app-release.apk`
- [ ] Wait: Installation completes
- [ ] Verify: "Success" message displayed
- [ ] Check: App appears on device

### Alternative Installation
- [ ] Open Android Studio
- [ ] Open `android/` folder
- [ ] Click "Run" → "Run 'app'"
- [ ] Select device
- [ ] Wait: Build and installation completes

---

## Testing Checklist

### App Launch
- [ ] App launches without crashes
- [ ] Splash screen displays
- [ ] Login screen appears
- [ ] No error messages

### Authentication
- [ ] Farmer login works
- [ ] Buyer login works
- [ ] User data loads correctly
- [ ] Navigation works

### Database Connectivity
- [ ] Database connection successful
- [ ] Data loads from Supabase
- [ ] CRUD operations work
- [ ] No connection errors

### Features Testing
- [ ] Farmer features work
  - [ ] Add crops
  - [ ] Create offers
  - [ ] View orders
  - [ ] Manage inventory
  
- [ ] Buyer features work
  - [ ] Browse crops
  - [ ] View offers
  - [ ] Add to cart
  - [ ] Place orders
  
- [ ] Communication features work
  - [ ] Send messages
  - [ ] Receive notifications
  - [ ] View chat history

### File Operations
- [ ] Image upload works
- [ ] File download works
- [ ] Storage buckets accessible
- [ ] No permission errors

### Performance
- [ ] App responds quickly
- [ ] No lag or freezing
- [ ] Smooth navigation
- [ ] Efficient memory usage

---

## Verification Checklist

### APK Verification
- [ ] APK file exists
- [ ] File size reasonable
- [ ] File is readable
- [ ] Signing verified: `jarsigner -verify -verbose app-release.apk`

### Build Verification
- [ ] No build errors
- [ ] No build warnings (optional)
- [ ] Build log clean
- [ ] All resources included

### Device Verification
- [ ] App installed successfully
- [ ] App appears in app drawer
- [ ] App launches without errors
- [ ] All permissions granted

---

## Troubleshooting Checklist

### Build Fails
- [ ] Run: `cd android && ./gradlew clean`
- [ ] Run: `./gradlew assembleRelease --info`
- [ ] Check: Error messages
- [ ] Check: Java version
- [ ] Check: Android SDK version
- [ ] Check: Gradle version

### Java Not Found
- [ ] Check: `java -version`
- [ ] Set: `JAVA_HOME` environment variable
- [ ] Verify: Path is correct
- [ ] Restart: Terminal/IDE

### Android SDK Not Found
- [ ] Check: `echo $ANDROID_HOME`
- [ ] Set: `ANDROID_HOME` environment variable
- [ ] Verify: Path is correct
- [ ] Restart: Terminal/IDE

### Out of Memory
- [ ] Set: `export GRADLE_OPTS="-Xmx2048m"`
- [ ] Run: Build again
- [ ] Increase: Memory if needed

### Installation Fails
- [ ] Check: Device connected
- [ ] Check: USB debugging enabled
- [ ] Run: `adb devices`
- [ ] Uninstall: Previous version
- [ ] Try: `adb install -r app.apk`

---

## Post-Build Checklist

### Documentation
- [ ] Read: GRADLE_BUILD_SUMMARY.md
- [ ] Read: Relevant guide for your needs
- [ ] Save: Quick reference for future builds
- [ ] Share: Documentation with team

### Backup
- [ ] Backup: `my-release-key.keystore`
- [ ] Backup: `android/keystore.properties`
- [ ] Store: In secure location
- [ ] Document: Keystore password

### Next Steps
- [ ] Test: All features on device
- [ ] Fix: Any issues found
- [ ] Optimize: Performance if needed
- [ ] Prepare: For Play Store submission

### Play Store Preparation
- [ ] Create: Google Play Developer account
- [ ] Create: App listing
- [ ] Add: App description
- [ ] Add: Screenshots
- [ ] Add: Privacy policy
- [ ] Upload: APK/Bundle
- [ ] Submit: For review

---

## Quick Reference

### Commands
```bash
# Generate native project
npx expo prebuild --platform android --clean

# Create signing key
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

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
```

### File Locations
```
Debug APK: android/app/build/outputs/apk/debug/app-debug.apk
Release APK: android/app/build/outputs/apk/release/app-release.apk
App Bundle: android/app/build/outputs/bundle/release/app-release.aab
Keystore: my-release-key.keystore
Properties: android/keystore.properties
```

---

## Status Tracking

- [ ] Prerequisites installed
- [ ] Environment variables set
- [ ] Native project generated
- [ ] Signing key created
- [ ] Gradle configured
- [ ] Debug APK built
- [ ] Release APK built
- [ ] APK installed on device
- [ ] Features tested
- [ ] Ready for Play Store

---

**Last Updated**: 2025-10-22
**Status**: Ready for Gradle build
**Next Action**: Start with Pre-Build Checklist

