# 📱 Step-by-Step Gradle APK Build Guide

## Complete Walkthrough for Building APK with Gradle

---

## ✅ Prerequisites Check

### 1. Java Development Kit (JDK)
```bash
java -version
javac -version
```

**Required**: JDK 11 or higher

**If not installed:**
- **Windows**: Download from https://www.oracle.com/java/technologies/downloads/
- **Mac**: `brew install openjdk@11`
- **Linux**: `sudo apt-get install openjdk-11-jdk`

### 2. Android SDK
```bash
# Check if ANDROID_HOME is set
echo $ANDROID_HOME  # Mac/Linux
echo %ANDROID_HOME%  # Windows
```

**If not set:**
- **Windows**: `C:\Users\YourName\AppData\Local\Android\Sdk`
- **Mac**: `$HOME/Library/Android/sdk`
- **Linux**: `$HOME/Android/Sdk`

**Set ANDROID_HOME:**
```bash
# Mac/Linux
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

### 3. Node.js
```bash
node --version  # Should be 16+
npm --version
```

---

## 🚀 Step 1: Generate Native Android Project

### Using Expo Prebuild
```bash
# Navigate to project root
cd Plot-My-Farm

# Generate native Android project
npx expo prebuild --platform android --clean
```

**What this does:**
- Creates `android/` directory
- Generates native Android project structure
- Configures Gradle build system
- Sets up Android manifest

**Expected output:**
```
✅ Generated native Android project
✅ android/ directory created
✅ Ready for Gradle build
```

---

## 🔑 Step 2: Create Signing Key

### Generate Keystore
```bash
# From project root
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

**When prompted, enter:**
```
Enter keystore password: [create strong password]
Re-enter new password: [repeat password]
What is your first and last name? [Your Name]
What is your organizational unit name? [Your Company]
What is your organization name? [Your Company]
What is your City or Locality name? [Your City]
What is your State or Province name? [Your State]
What is the two-letter country code for this unit? [US]
Is CN=Your Name, OU=Your Company, O=Your Company, L=Your City, ST=Your State, C=US correct? [yes]
```

**Output:**
```
✅ Keystore created: my-release-key.keystore
```

### Create Keystore Properties File
Create `android/keystore.properties`:
```properties
storeFile=../my-release-key.keystore
storePassword=YOUR_PASSWORD_HERE
keyAlias=my-key-alias
keyPassword=YOUR_PASSWORD_HERE
```

**Add to .gitignore:**
```
my-release-key.keystore
android/keystore.properties
```

---

## 🔨 Step 3: Configure Gradle Build

### Update android/app/build.gradle

Find the `android` block and add signing configuration:

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

## 📦 Step 4: Build APK

### Option A: Debug APK (Fastest - for testing)
```bash
cd android
./gradlew assembleDebug
```

**Output location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Time**: 2-5 minutes
**Size**: ~50-80 MB
**Use for**: Testing on device

### Option B: Release APK (Optimized - for production)
```bash
cd android
./gradlew assembleRelease
```

**Output location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

**Time**: 5-10 minutes
**Size**: ~30-50 MB
**Use for**: Play Store submission

### Option C: App Bundle (For Play Store)
```bash
cd android
./gradlew bundleRelease
```

**Output location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Time**: 5-10 minutes
**Use for**: Google Play Store (recommended)

---

## 📱 Step 5: Install on Device

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
2. Open `android/` folder
3. Click "Run" → "Run 'app'"
4. Select device
5. APK will be built and installed

---

## ✅ Step 6: Verify Installation

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
1. Launch app
2. Test login flow
3. Verify database connectivity
4. Test all features
5. Check error handling

---

## 🔧 Troubleshooting

### Build Fails - Clean and Rebuild
```bash
cd android
./gradlew clean
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

### Gradle Wrapper Issues
```bash
# Regenerate gradle wrapper
cd android
gradle wrapper --gradle-version 7.5
```

### Out of Memory Error
```bash
# Increase heap size
export GRADLE_OPTS="-Xmx2048m"
cd android
./gradlew assembleRelease
```

---

## 📊 Build Output Locations

```
android/app/build/outputs/
├── apk/
│   ├── debug/
│   │   └── app-debug.apk          ← Debug APK
│   └── release/
│       └── app-release.apk        ← Release APK
└── bundle/
    └── release/
        └── app-release.aab        ← App Bundle
```

---

## 🎯 Quick Commands Summary

```bash
# 1. Generate native project
npx expo prebuild --platform android --clean

# 2. Create signing key
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# 3. Build debug APK
cd android && ./gradlew assembleDebug

# 4. Build release APK
cd android && ./gradlew assembleRelease

# 5. Build app bundle
cd android && ./gradlew bundleRelease

# 6. Install APK
adb install -r app-release.apk

# 7. Clean build
cd android && ./gradlew clean
```

---

## 📋 Checklist

- [ ] Java JDK 11+ installed
- [ ] Android SDK installed
- [ ] ANDROID_HOME set
- [ ] Native project generated
- [ ] Signing key created
- [ ] Keystore properties configured
- [ ] Gradle build configured
- [ ] APK built successfully
- [ ] APK installed on device
- [ ] App tested on device

---

## 🎉 Success!

Your APK is ready for:
- ✅ Testing on device
- ✅ Distribution to users
- ✅ Upload to Google Play Store

---

**Last Updated**: 2025-10-22
**Status**: Ready for Gradle build

