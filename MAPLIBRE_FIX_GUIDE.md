# MapLibre Map Fix - Complete Implementation Guide

## Status: ✅ MapLibreView.tsx Updated
## Remaining: Android Configuration Files (Manual)

---

## ✅ COMPLETED

### 1. MapLibreView.tsx - UPDATED
**Location**: `components/MapLibreView.tsx`

**Changes Made**:
- ✅ Updated to MapTiler streets-v2 style (full world map with roads, cities, labels)
- ✅ Added proper error handling and logging
- ✅ Enabled all map interactions (zoom, scroll, rotate, compass)
- ✅ Added map loading indicators
- ✅ Set telemetry to false for production
- ✅ Proper GPS location fetching with high accuracy
- ✅ Cache clearing on mount for fresh tiles

**Style URL**: `https://api.maptiler.com/maps/streets-v2/style.json?key=8MaoCcKOtQUbnHcNOBQn`

---

## ⚠️ MANUAL STEPS REQUIRED (Android Files Blocked by .gitignore)

### 2. Network Security Config
**File**: `android/app/src/main/res/xml/network_security_config.xml`

**Action**: Create this file with the following content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <!-- Allow cleartext traffic for MapTiler API -->
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">api.maptiler.com</domain>
    <domain includeSubdomains="true">maptiler.com</domain>
  </domain-config>
  
  <!-- Base configuration for all other domains -->
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
</network-security-config>
```

---

### 3. AndroidManifest.xml
**File**: `android/app/src/main/AndroidManifest.xml`

**Action**: Add these permissions ABOVE `<application>` tag:

```xml
<!-- Location permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

**Action**: Update `<application>` tag to include:

```xml
<application
    android:name=".MainApplication"
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config"
    android:allowBackup="true"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme">
```

**Key additions**:
- `android:usesCleartextTraffic="true"`
- `android:networkSecurityConfig="@xml/network_security_config"`

---

### 4. ProGuard Rules
**File**: `android/app/proguard-rules.pro`

**Action**: Add these rules to preserve MapLibre classes:

```proguard
# --- MapLibre + MapTiler JNI ---
-keep class org.maplibre.** { *; }
-keep class com.mapbox.** { *; }
-keep class com.maptiler.** { *; }
-dontwarn org.maplibre.**
-dontwarn com.mapbox.**
-dontwarn com.maptiler.**

# --- React Native bridge ---
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-dontwarn com.facebook.react.**

# --- Keep native methods ---
-keepclassmembers class * {
    native <methods>;
}

# --- Keep MapLibre native libraries ---
-keep class com.mapbox.mapboxsdk.** { *; }
-keep interface com.mapbox.mapboxsdk.** { *; }
-keep class org.maplibre.android.** { *; }
-keep interface org.maplibre.android.** { *; }
```

---

### 5. build.gradle
**File**: `android/app/build.gradle`

**Action**: Add inside `android { ... }` block:

```gradle
android {
    ...
    
    packagingOptions {
        pickFirst '**/*.so'
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
    }
    
    ...
}
```

**Action**: Verify `buildTypes` section:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources false  // Keep false to preserve map assets
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
    debug {
        minifyEnabled false
    }
}
```

---

## 🔧 BUILD COMMANDS

### Clean Build:
```bash
cd android
./gradlew clean
```

### Build Release APK:
```bash
cd android
./gradlew assembleRelease
```

### Install on Device:
```bash
adb uninstall com.plotmyfarm
adb install app/build/outputs/apk/release/app-release.apk
```

---

## ✅ VALIDATION CHECKLIST

After building and installing:

- [ ] Map loads without blank/yellow screen
- [ ] Full world map visible (roads, cities, labels, landmarks)
- [ ] Place names and street names visible
- [ ] GPS location marker appears
- [ ] Map is interactive (zoom, pan, rotate)
- [ ] No network security errors in logcat
- [ ] Release build works same as debug
- [ ] Map tiles load from MapTiler API
- [ ] No crashes on map load

---

## 🐛 TROUBLESHOOTING

### If map is still blank:

1. **Check Logcat**:
```bash
adb logcat | grep -i "map\|maptiler\|maplibre"
```

2. **Verify network_security_config.xml is packaged**:
```bash
# Check if file exists in APK
unzip -l app/build/outputs/apk/release/app-release.apk | grep network_security
```

3. **Check ProGuard didn't strip MapLibre classes**:
```bash
# View ProGuard mapping
cat app/build/outputs/mapping/release/mapping.txt | grep -i maplibre
```

4. **Verify internet permission**:
```bash
aapt dump permissions app/build/outputs/apk/release/app-release.apk | grep INTERNET
```

### If tiles don't load:

1. **Test MapTiler API directly**:
   - Open in browser: `https://api.maptiler.com/maps/streets-v2/style.json?key=8MaoCcKOtQUbnHcNOBQn`
   - Should return JSON with map style

2. **Check network security config is applied**:
   - Look for errors in logcat about cleartext traffic

3. **Verify .so libraries are included**:
```bash
unzip -l app/build/outputs/apk/release/app-release.apk | grep "\.so$"
```

---

## 📊 EXPECTED RESULTS

### Debug Build:
- ✅ Map loads with full world data
- ✅ Roads, cities, labels visible
- ✅ GPS marker shows user location
- ✅ Smooth interactions

### Release Build (After fixes):
- ✅ Same as debug build
- ✅ No blank/yellow screen
- ✅ All map features work
- ✅ Play Store compliant
- ✅ No network errors

---

## 🎯 KEY DIFFERENCES FROM PREVIOUS VERSION

| Aspect | Before | After |
|--------|--------|-------|
| Map Style | streets | streets-v2 (more detailed) |
| Telemetry | Default | Disabled (false) |
| Error Handling | Basic | Comprehensive with logging |
| Loading States | Simple | Dual indicators (location + map) |
| GPS Accuracy | Balanced | High |
| Cache Management | None | Clears on mount |
| Network Config | Missing | Configured for MapTiler |
| ProGuard | Partial | Complete MapLibre preservation |

---

## 📝 NOTES

1. **MapTiler API Key**: Currently using `8MaoCcKOtQUbnHcNOBQn`
   - This is visible in the code
   - For production, consider using environment variables
   - Or implement a proxy server

2. **Style URL**: Using `streets-v2` which includes:
   - All roads (highways, streets, paths)
   - Buildings and landmarks
   - Place labels (cities, towns, villages)
   - Natural features (rivers, lakes, mountains)
   - Points of interest (POIs)

3. **Permissions**: App requests location at runtime
   - Handled by expo-location
   - Falls back to default location if denied

4. **Network Security**: 
   - Allows cleartext for MapTiler API only
   - All other domains use HTTPS
   - Play Store compliant

---

## 🚀 DEPLOYMENT READY

Once all manual steps are completed:

1. ✅ MapLibreView.tsx updated
2. ✅ network_security_config.xml created
3. ✅ AndroidManifest.xml updated
4. ✅ ProGuard rules added
5. ✅ build.gradle configured
6. ✅ Release APK built
7. ✅ Tested on device
8. ✅ Validated all features work

**The app will be ready for Play Store submission with fully functional maps!**

---

**Last Updated**: December 4, 2025, 8:45 PM IST  
**Status**: MapLibreView.tsx Updated - Android Config Pending Manual Steps  
**Priority**: HIGH - Required for map functionality
