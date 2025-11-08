# 🔍 MapLibre Debug Guide - Troubleshooting Map Issues

## 📦 Latest Build Information

**APK Location:** `android/app/build/outputs/apk/release/app-release.apk`  
**Build Time:** 08-11-2025 12:57:37  
**Size:** 63.52 MB  
**Status:** ✅ Build Successful

---

## ✅ What Was Fixed

### 1. **Enhanced Logging System**
Added comprehensive logging throughout the MapLibreView component to track:
- Module loading status
- Component availability (MapView, Camera, UserLocation)
- Fallback UI triggers
- Map rendering lifecycle
- Error details with stack traces

### 2. **Verified Dependencies**
All required packages are properly installed:
- ✅ `@maplibre/maplibre-react-native` v10.4.0
- ✅ `geolib` v3.3.4 (distance calculations)
- ✅ `supercluster` v8.0.1 (marker clustering)

### 3. **Native Module Registration**
MapLibre package is manually registered in `MainApplication.kt`:
```kotlin
add(MLRNPackage())
```

---

## 🔍 How to View Logs from the APK

### **Step 1: Install the APK**
1. Transfer `app-release.apk` to your Android device
2. Install the APK (enable "Install from Unknown Sources" if needed)

### **Step 2: Connect Device to Computer**
```powershell
# Check if device is connected
adb devices
```

You should see your device listed.

### **Step 3: View Real-Time Logs**
```powershell
# View all MapLibre-related logs
adb logcat | Select-String "MapLibre"

# View React Native JavaScript logs
adb logcat | Select-String "ReactNativeJS"

# View both MapLibre and React logs
adb logcat | Select-String "MapLibre|ReactNativeJS"

# View only errors and warnings
adb logcat *:E *:W

# Clear logs and start fresh
adb logcat -c
adb logcat | Select-String "MapLibre|ReactNativeJS"
```

### **Step 4: Test the App**
1. Open the app
2. Log in with your credentials
3. Navigate to the home page (farmer-home or buyer-home)
4. Watch the logs in real-time

---

## 🔍 What to Look For in Logs

### **✅ Success Indicators**
```
✅ [MapLibre] All components loaded successfully!
✅ [MapLibre] Rendering map view
✅ [MapLibre] Map loaded successfully
```

### **❌ Error Indicators**
```
❌ [MapLibre] Failed to load: [error details]
❌ [MapLibre] Module incomplete - missing required components
⚠️ [MapLibre] Components not available for rendering
```

### **ℹ️ Fallback Indicators**
```
ℹ️ [MapLibre] Showing fallback UI
   Platform: android
   isMapLibreAvailable: false
```

---

## 🐛 Common Issues and Solutions

### **Issue 1: "Map feature is temporarily unavailable"**

**Possible Causes:**
1. MapLibre native module not loaded
2. Components (MapView, Camera, UserLocation) are undefined
3. Platform detection issue

**Check Logs For:**
```
🔍 [MapLibre] Attempting to load MapLibre module...
🔍 [MapLibre] Module loaded, checking exports...
🔍 [MapLibre] Available exports: [list of exports]
```

**Solution:**
- If you see "Failed to load", the native module isn't linked properly
- If you see "Module incomplete", specific components are missing
- Check the component availability logs to see which components are missing

---

### **Issue 2: App Crashes on Home Page**

**Check Logs For:**
```
ERROR  [Error: ...]
FATAL EXCEPTION: main
```

**Solution:**
- Look for the error message and stack trace
- Check if it's related to MapLibre or another component
- The error boundaries should catch most errors and show fallback UI

---

### **Issue 3: Map Shows But User Location Not Visible**

**Check Logs For:**
```
✅ [MapLibre] Map loaded successfully
```

**Possible Causes:**
1. Location permissions not granted
2. GPS not enabled
3. UserLocation component not rendering

**Solution:**
- Check location permissions in app settings
- Enable GPS on device
- Look for UserLocation-related errors in logs

---

## 📊 Expected Log Flow (Success)

```
1. 🔍 [MapLibre] Attempting to load MapLibre module...
2. 🔍 [MapLibre] Module loaded, checking exports...
3. 🔍 [MapLibre] Available exports: Camera, MapView, UserLocation, ...
4. 🔍 [MapLibre] Component check:
     - MapView: object ✅
     - Camera: object ✅
     - UserLocation: object ✅
5. ✅ [MapLibre] All components loaded successfully!
6. ✅ [MAP] Loaded X nearby users
7. ✅ [MapLibre] Rendering map view
     User coordinates: { latitude: XX.XXXX, longitude: XX.XXXX }
     Nearby users: X
     Radius: 20 km
8. ✅ [MapLibre] Map loaded successfully
```

---

## 🚀 Next Steps

1. **Install the new APK** (built at 12:57:37)
2. **Connect device via ADB**
3. **Run the logging command:**
   ```powershell
   adb logcat -c
   adb logcat | Select-String "MapLibre|ReactNativeJS|ERROR"
   ```
4. **Open the app and navigate to home page**
5. **Copy the logs** and share them if issues persist

---

## 📝 Additional Information

### **MapLibre Configuration**
- **Style URL:** MapTiler CloudTile (streets-v2)
- **Zoom Level:** 11 (shows ~20km radius)
- **User Location:** Native rendering with compass mode
- **Radius:** 20km (20000 meters)

### **Error Boundaries**
- `MapErrorBoundary`: Catches map-specific errors
- `HomePageErrorBoundary`: Catches page-level errors

Both boundaries will show fallback UI instead of crashing the app.

---

## 🆘 If Issues Persist

Share the following information:
1. **Full ADB logs** from app startup to crash/error
2. **Device information** (Android version, manufacturer)
3. **Screenshot** of the error or fallback message
4. **Steps to reproduce** the issue

The enhanced logging will help identify the exact point of failure!

