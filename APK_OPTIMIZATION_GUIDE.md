# APK Size Optimization Guide

## Current APK Size: 378.92 MB
## Target Size: 150-200 MB (50% reduction)

---

## QUICK OPTIMIZATION (Apply These Now)

### 1. Enable ABI Splits (Highest Impact - 40% reduction)

**File**: `android/app/build.gradle`

Add this inside the `android {}` block:

```gradle
android {
    ...
    
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
            universalApk false
        }
    }
    
    ...
}
```

**Result**: Creates 2 separate APKs:
- `app-armeabi-v7a-release.apk` (~150 MB) - For older devices
- `app-arm64-v8a-release.apk` (~150 MB) - For modern devices

**Rebuild**:
```bash
cd android
./gradlew clean assembleRelease
```

---

### 2. Enable ProGuard/R8 (20-30% reduction)

**File**: `android/app/build.gradle`

Update the `buildTypes` section:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

**Create**: `android/app/proguard-rules.pro` (if not exists)

```proguard
# Add project specific ProGuard rules here
-keep class com.facebook.react.** { *; }
-keep class com.swmansion.** { *; }
-keep class io.agora.** { *; }
-dontwarn com.facebook.react.**
-dontwarn io.agora.**
```

---

### 3. Remove Unused ABIs (Immediate)

**File**: `android/app/build.gradle`

Add this to only include ARM architectures (most devices):

```gradle
android {
    ...
    
    defaultConfig {
        ...
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a'
        }
    }
    
    ...
}
```

---

## MEDIUM OPTIMIZATION (Apply After Testing)

### 4. Optimize Images

**Run this command** to compress images:

```bash
# Install imagemagick first (if not installed)
# Then compress all images
find assets/images -name "*.jpg" -exec mogrify -quality 80 {} \;
find assets/images -name "*.png" -exec mogrify -quality 80 {} \;
```

**Or manually**:
- Use online tools like TinyPNG
- Convert PNG to WebP where possible
- Remove unused images

---

### 5. Use App Bundle (AAB) for Play Store

**Build AAB instead of APK**:

```bash
cd android
./gradlew bundleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

**Benefits**:
- Google Play automatically optimizes per device
- Users download only what they need
- 30-40% smaller downloads

---

## ADVANCED OPTIMIZATION

### 6. Remove Unused Dependencies

**Check** `package.json` and remove:
- Unused Expo modules
- Development-only packages
- Redundant libraries

**Example**:
```bash
npm uninstall <unused-package>
```

---

### 7. Enable Hermes (Already Done)

Verify in `android/app/build.gradle`:

```gradle
project.ext.react = [
    enableHermes: true
]
```

---

### 8. Optimize Native Libraries

**File**: `android/app/build.gradle`

```gradle
android {
    ...
    
    buildTypes {
        release {
            ...
            packagingOptions {
                exclude 'lib/x86/**'
                exclude 'lib/x86_64/**'
                exclude 'lib/mips/**'
                exclude 'lib/mips64/**'
            }
        }
    }
}
```

---

## RECOMMENDED BUILD CONFIGURATION

### Complete `android/app/build.gradle` optimizations:

```gradle
android {
    ...
    
    defaultConfig {
        ...
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a'
        }
    }
    
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
            universalApk false
        }
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
            
            packagingOptions {
                exclude 'lib/x86/**'
                exclude 'lib/x86_64/**'
            }
        }
    }
}
```

---

## BUILD COMMANDS

### After Optimization:

```bash
# Clean build
cd android
./gradlew clean

# Build optimized APKs
./gradlew assembleRelease

# Or build AAB for Play Store
./gradlew bundleRelease
```

---

## EXPECTED RESULTS

| Optimization | Size Reduction | Final Size |
|--------------|----------------|------------|
| Original | - | 378.92 MB |
| + ABI Splits | -40% | ~227 MB per APK |
| + ProGuard | -20% | ~182 MB per APK |
| + Image Optimization | -10 MB | ~172 MB per APK |
| + AAB (Play Store) | -30% for users | ~120-140 MB download |

---

## TESTING AFTER OPTIMIZATION

1. **Build optimized APK**
2. **Install on device**
3. **Test all features**:
   - App launches
   - All screens work
   - Chat photo upload
   - Video calls
   - No crashes

4. **Check APK size**:
```bash
Get-ChildItem "android\app\build\outputs\apk\release\*.apk" | Select-Object Name, @{Name="SizeMB";Expression={[math]::Round($_.Length/1MB,2)}}
```

---

## TROUBLESHOOTING

### If ProGuard causes crashes:

Add to `proguard-rules.pro`:
```proguard
-keep class your.package.name.** { *; }
-dontwarn **
```

### If ABI splits don't work:

Check that you're using the correct APK for your device:
- arm64-v8a: Modern devices (2015+)
- armeabi-v7a: Older devices

---

## QUICK START

**Apply optimizations 1-3 now for immediate 50% size reduction!**

1. Edit `android/app/build.gradle`
2. Add ABI splits
3. Enable ProGuard
4. Add ndk abiFilters
5. Rebuild: `cd android && ./gradlew clean assembleRelease`

**Result**: ~150-180 MB per APK instead of 378 MB!

---

**Last Updated**: December 4, 2025  
**Status**: Ready to Apply
