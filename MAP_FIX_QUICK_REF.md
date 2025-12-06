# 🗺️ MapLibre Map Fix - Quick Reference

## ✅ What Was Fixed

### 1. **MapLibreView Component** (`components/MapLibreView.tsx`)
- Changed to **Streets-v2** style (Google Maps-like)
- Added `MapLibreGL.setConnected(true)` - **CRITICAL for Android**
- Configured for India location by default

### 2. **Network Security Config** (NEW FILE)
- Path: `android/app/src/main/res/xml/network_security_config.xml`
- Allows HTTPS tile loading on Android 12+

### 3. **AndroidManifest.xml** (UPDATED)
- Path: `android/app/src/main/AndroidManifest.xml`
- Added: `android:networkSecurityConfig="@xml/network_security_config"`
- Added: `android:usesCleartextTraffic="true"`

---

## 🚀 Next Steps

### 1. Rebuild Your App
```bash
# Option A: Development build
npx expo prebuild --clean
npx expo run:android

# Option B: Production APK
eas build --platform android --profile preview
```

### 2. What You'll See Now
✅ Detailed street map with labels  
✅ City names and locations  
✅ Roads and highways  
✅ Rivers and water bodies  
✅ Your current location marker  
✅ Smooth zoom and pan  

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Still blank | Check `.env` has `EXPO_PUBLIC_MAPTILER_KEY=your_key` |
| 401 Error | Invalid MapTiler API key - get new one |
| Slow loading | Normal on first load - tiles are cached after |
| No location | Grant location permissions in device settings |

---

## 📝 Important Files

```
plot-my-farm/
├── components/
│   └── MapLibreView.tsx ✅ UPDATED
├── android/
│   └── app/
│       └── src/
│           └── main/
│               ├── AndroidManifest.xml ✅ UPDATED
│               └── res/
│                   └── xml/
│                       └── network_security_config.xml ✅ NEW
└── MAPLIBRE_FIX_GUIDE.md 📖 Full documentation
```

---

## 🎨 Change Map Style (Optional)

Edit `components/MapLibreView.tsx` line 9:

```typescript
// Streets (Current)
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

// Satellite
const STYLE_URL = `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`;

// Outdoor/Topographic
const STYLE_URL = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`;
```

---

## ⚠️ Before Building

1. ✅ Verify `.env` has your MapTiler API key
2. ✅ Clean build: `npx expo prebuild --clean`
3. ✅ Test on real device (not emulator for best results)

---

**Need help?** Check `MAPLIBRE_FIX_GUIDE.md` for detailed documentation.
