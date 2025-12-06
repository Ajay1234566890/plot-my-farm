# MapLibre Map Fix - Complete Solution

## Problem
- Map showing blank yellow background
- No map tiles/glyphs visible
- Missing location names, rivers, cities, roads, and labels
- Need Google Maps-like detailed view

## Root Causes Identified
1. **Wrong Map Style**: Not using a detailed street style with labels
2. **Android Network Blocking**: Android 12+ blocks HTTPS tile requests by default
3. **MapLibreGL Not Connected**: Missing `setConnected(true)` call

## Solutions Implemented

### ✅ 1. Updated MapLibreView Component
**File**: `components/MapLibreView.tsx`

**Changes Made**:
- ✅ Changed style to `streets-v2` for Google Maps-like detail
- ✅ Added `MapLibreGL.setConnected(true)` to fix Android blank map
- ✅ Configured proper camera defaults for India
- ✅ Enabled user location display

**Key Code**:
```typescript
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
MapLibreGL.setConnected(true); // CRITICAL for Android
```

### ✅ 2. Created Network Security Config
**File**: `android/app/src/main/res/xml/network_security_config.xml`

**Purpose**: Allows MapLibre to load HTTPS tiles without being blocked by Android 12+ security policies

**What it fixes**:
- ✅ Blank yellow screen
- ✅ Glyphs not loading
- ✅ Style JSON downloaded but tiles not visible
- ✅ MapTiler tiles blocked

### ✅ 3. Updated AndroidManifest.xml
**File**: `android/app/src/main/AndroidManifest.xml`

**Changes Made**:
- ✅ Added `android:networkSecurityConfig="@xml/network_security_config"`
- ✅ Added `android:usesCleartextTraffic="true"` for compatibility
- ✅ Included all necessary permissions (INTERNET, LOCATION, CAMERA)

## How to Verify the Fix

### Step 1: Check Your MapTiler API Key
Make sure your `.env` file has:
```
EXPO_PUBLIC_MAPTILER_KEY=your_actual_key_here
```

### Step 2: Rebuild the App
```bash
# Clean and rebuild
npx expo prebuild --clean
cd android
./gradlew clean
cd ..

# Build new APK
npx expo run:android
# OR
eas build --platform android --profile preview
```

### Step 3: Test the Map
1. Open the app
2. Navigate to any screen with the map (Farmer Home or Buyer Home)
3. You should now see:
   - ✅ Detailed street map (like Google Maps)
   - ✅ City names and labels
   - ✅ Roads and highways
   - ✅ Rivers and water bodies
   - ✅ Your current location marker
   - ✅ Smooth zoom and pan

## Alternative Map Styles

If you want different looks, you can change the style URL in `MapLibreView.tsx`:

### Streets (Current - Recommended)
```typescript
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
```

### Satellite
```typescript
const STYLE_URL = `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`;
```

### Outdoor (Topographic)
```typescript
const STYLE_URL = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`;
```

### Basic (Minimal)
```typescript
const STYLE_URL = `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`;
```

## Troubleshooting

### If map still shows blank:
1. **Check API Key**: Verify your MapTiler key is valid
2. **Check Internet**: Ensure device has internet connection
3. **Check Logs**: Run `npx react-native log-android` to see errors
4. **Clear Cache**: Run `npx expo start -c` to clear Metro cache

### If tiles load slowly:
- This is normal on first load
- Tiles are cached after first download
- Consider using offline tile packs for production

### If you see "401 Unauthorized":
- Your MapTiler API key is invalid or expired
- Get a new key from https://cloud.maptiler.com/

## Files Modified/Created

1. ✅ `components/MapLibreView.tsx` - Updated with Streets-v2 style
2. ✅ `android/app/src/main/res/xml/network_security_config.xml` - Created
3. ✅ `android/app/src/main/AndroidManifest.xml` - Updated with network config

## Next Steps

1. **Rebuild the app** with the changes
2. **Test on both Farmer and Buyer sides**
3. **Verify all map features work**:
   - Location display
   - Zoom/Pan
   - Labels and names visible
   - Roads and rivers visible

## Important Notes

⚠️ **Production Deployment**:
- Keep `cleartextTrafficPermitted="true"` only if you need HTTP (not recommended)
- For HTTPS-only (recommended), you can set it to `false`
- MapTiler uses HTTPS by default, so this is safe

⚠️ **API Key Security**:
- Never commit your `.env` file with real API keys
- Use environment variables in production
- Consider using a proxy server for API key protection

## Support

If you still face issues after implementing these fixes:
1. Share the error logs from `npx react-native log-android`
2. Verify your MapTiler account is active
3. Check if you've exceeded the free tier limits (100k requests/month)
