# ✅ MapLibre Map Fix - Pre-Build Checklist

## Before You Build - Verify These Items

### 1. Environment Setup
- [ ] `.env` file exists in project root
- [ ] `EXPO_PUBLIC_MAPTILER_KEY=your_actual_key` is set
- [ ] API key is valid (test at https://cloud.maptiler.com/)

### 2. Files Created/Updated
- [ ] `components/MapLibreView.tsx` - Updated with Streets-v2
- [ ] `android/app/src/main/res/xml/network_security_config.xml` - Created
- [ ] `android/app/src/main/AndroidManifest.xml` - Updated with network config

### 3. Code Verification
- [ ] MapLibreView.tsx has `MapLibreGL.setConnected(true)`
- [ ] MapLibreView.tsx uses `streets-v2/style.json`
- [ ] AndroidManifest.xml has `android:networkSecurityConfig="@xml/network_security_config"`
- [ ] network_security_config.xml exists in correct path

### 4. Build Commands Ready
```bash
# Clean build (recommended)
npx expo prebuild --clean

# Development build
npx expo run:android

# OR Production APK
eas build --platform android --profile preview
```

### 5. Testing Plan
After build completes:
- [ ] Open app on real device (not emulator)
- [ ] Navigate to Farmer Home screen
- [ ] Verify map shows detailed streets
- [ ] Verify city names are visible
- [ ] Verify roads and rivers are shown
- [ ] Navigate to Buyer Home screen
- [ ] Verify map works there too
- [ ] Test zoom in/out
- [ ] Test pan/drag
- [ ] Verify location marker appears

### 6. Expected Results
✅ Map shows Google Maps-like detail  
✅ City names and labels visible  
✅ Roads, highways, streets drawn  
✅ Rivers and water bodies shown  
✅ User location marker (blue dot)  
✅ Smooth zoom and pan  
✅ Loads within 2-3 seconds  

### 7. If Something Goes Wrong
- [ ] Check logs: `npx react-native log-android`
- [ ] Verify API key is correct
- [ ] Check internet connection
- [ ] Clear cache: `npx expo start -c`
- [ ] Rebuild with `--clean` flag

---

## Quick Command Reference

### Clean Everything
```bash
npx expo prebuild --clean
cd android
./gradlew clean
cd ..
```

### Build Development
```bash
npx expo run:android
```

### Build Production APK
```bash
eas build --platform android --profile preview
```

### View Logs
```bash
npx react-native log-android
```

### Clear Metro Cache
```bash
npx expo start -c
```

---

## 🎯 You're Ready When:
✅ All checkboxes above are checked  
✅ `.env` has valid MapTiler API key  
✅ All files are in correct locations  
✅ You've read the troubleshooting guide  

---

**Ready to build?** Run: `npx expo prebuild --clean && npx expo run:android`

**Need help?** Check `IMPLEMENTATION_SUMMARY.md` for full details.
