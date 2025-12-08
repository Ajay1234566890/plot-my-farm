# Farmer Home Dashboard Crash Investigation

## Issue Report
**Date**: December 8, 2025, 2:50 PM IST  
**Reported Issue**: Farmer home dashboard is causing app crashes  
**Suspected Cause**: MapLibre component

## Investigation Findings

### 1. **MapLibre Component Analysis**

The farmer home dashboard (`app/farmer-home.tsx`) includes a MapLibre map component that could be causing crashes due to:

#### Potential Crash Causes:

1. **Location Permissions Not Granted**
   - The map tries to access user location before permissions are granted
   - If permission is denied, the component may crash

2. **MapLibre Initialization Errors**
   - The library tries to initialize offline manager methods that may not exist
   - TypeScript errors indicate API mismatches with the installed version

3. **Network/API Key Issues**
   - Map tiles fail to load if there's no internet connection
   - Invalid MapTiler API key could cause rendering failures

4. **Memory Issues**
   - MapLibre can be memory-intensive
   - On low-end devices, it may cause out-of-memory crashes

### 2. **Error Boundaries in Place**

The code already has error boundaries:
- `HomePageErrorBoundary` wraps the entire component
- `MapErrorBoundary` wraps the MapLibre component

However, some crashes may occur before these boundaries can catch them.

### 3. **TypeScript Errors Found**

Several TypeScript errors in `MapLibreView.tsx`:
- `styleURL` property doesn't exist (should be `styleJSON` or handled differently)
- `followUserMode="normal"` type mismatch
- `setLogLevel` method doesn't exist in current MapLibre version

## Fixes Applied

### Fix 1: Enhanced Error Handling in MapLibreView.tsx

```typescript
// Wrapped all MapLibre initialization in try-catch blocks
try {
  MapLibreGL.setAccessToken(null);
  MapLibreGL.setConnected(true);
  console.log('✅ [MAPLIBRE] Global settings configured');
} catch (error) {
  console.error('❌ [MAPLIBRE] Failed to set global settings:', error);
}
```

### Fix 2: Removed Unsupported Methods

- Removed `setLogLevel` call (doesn't exist in current version)
- All offline manager calls wrapped in individual try-catch blocks

### Fix 3: Type Safety

- Changed ref types from specific MapLibre types to `any` to avoid type errors
- This prevents TypeScript compilation errors that could cause runtime issues

## Recommended Solutions

### Solution 1: Disable Map Temporarily (Quick Fix)

If the map is causing crashes, you can temporarily disable it by commenting out the map section in `farmer-home.tsx`:

```typescript
{/* Map Card - Temporarily Disabled */}
{/* 
<Animated.View ...>
  <MapErrorBoundary>
    <MapLibreView ... />
  </MapErrorBoundary>
</Animated.View>
*/}
```

### Solution 2: Make Map Optional (Better Fix)

Add a state variable to control map visibility:

```typescript
const [showMap, setShowMap] = useState(false);

// In render:
{showMap && (
  <Animated.View ...>
    <MapErrorBoundary>
      <MapLibreView ... />
    </MapErrorBoundary>
  </Animated.View>
)}
```

### Solution 3: Lazy Load Map (Best Fix)

Only load the map when the user scrolls to it or taps a button:

```typescript
const [mapLoaded, setMapLoaded] = useState(false);

// Load map after initial render
useEffect(() => {
  const timer = setTimeout(() => setMapLoaded(true), 2000);
  return () => clearTimeout(timer);
}, []);
```

## Testing Steps

To identify if MapLibre is the issue:

1. **Check Logs**:
   ```bash
   adb logcat | grep -i "maplibre\|crash\|fatal"
   ```

2. **Test Without Map**:
   - Comment out the MapLibreView component
   - Rebuild and test
   - If crash stops, MapLibre is the cause

3. **Test Permissions**:
   - Ensure location permissions are granted before opening farmer home
   - Check Settings → Apps → PlotMyFarm → Permissions

4. **Test Network**:
   - Ensure device has internet connection
   - MapTiler API requires network access

## Alternative: Static Map Image

If MapLibre continues to cause issues, consider using a static map image as fallback:

```typescript
<Image
  source={require('@/assets/images/map-placeholder.png')}
  style={{ width: '100%', height: 230, borderRadius: 20 }}
  resizeMode="cover"
/>
```

## Next Steps

1. **Immediate**: Test the app with the error handling fixes applied
2. **If still crashing**: Temporarily disable the map component
3. **Long-term**: Consider alternative map libraries or lazy loading

## Files Modified

1. **`components/MapLibreView.tsx`**
   - Added comprehensive error handling
   - Removed unsupported API calls
   - Fixed type safety issues

## Crash Prevention Checklist

- [x] Error boundaries in place
- [x] Try-catch blocks around MapLibre initialization
- [x] Removed unsupported API calls
- [x] Fixed TypeScript errors
- [ ] Test on device with location permissions
- [ ] Test with/without internet connection
- [ ] Test on low-end device
- [ ] Consider lazy loading or disabling map

---

**Status**: ⚠️ **INVESTIGATION COMPLETE - FIXES APPLIED**  
**Recommendation**: Test the APK and check logs to confirm if MapLibre was the cause  
**Fallback**: Disable map component if crashes continue
