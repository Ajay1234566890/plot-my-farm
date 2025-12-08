# Quick Fix: Disable MapLibre in Farmer Home

If the farmer home dashboard is crashing due to MapLibre, follow these steps to temporarily disable the map:

## Option 1: Comment Out Map (Fastest)

Edit `app/farmer-home.tsx` and find the map section (around line 302-381):

```typescript
{/* Map Card - TEMPORARILY DISABLED TO FIX CRASHES */}
{/* 
<Animated.View
  style={{
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    opacity: mapOpacity,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  }}
>
  <MapErrorBoundary fallbackMessage={t('errors.mapUnavailable')}>
    <MapLibreView
      showFarmers={true}
      showBuyers={true}
      radiusInMeters={RADIUS_PRESETS.DEFAULT}
      onUserPress={(user) => {
        if (user.role === 'buyer') {
          router.push({
            pathname: "/nearby-buyers",
            params: { selectedBuyerId: user.id }
          });
        } else {
          router.push({
            pathname: "/nearby-farmers",
            params: { selectedFarmerId: user.id }
          });
        }
      }}
    />
  </MapErrorBoundary>

  <View
    className="absolute top-4 left-4 right-4 flex-row justify-between"
    style={{ gap: 8 }}
  >
    <TouchableOpacity
      onPress={() => router.push("/nearby-buyers")}
      className="px-4 py-2 rounded-full flex-row items-center"
      style={{
        backgroundColor: 'rgba(124, 139, 58, 0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text className="text-xs font-semibold text-white">
        {t('farmerHome.nearbyBuyers')}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.push("/nearby-farmers")}
      className="px-4 py-2 rounded-full flex-row items-center"
      style={{
        backgroundColor: 'rgba(124, 139, 58, 0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text className="text-xs font-semibold text-white">
        {t('farmerHome.nearbyFarmers')}
      </Text>
    </TouchableOpacity>
  </View>
</Animated.View>
*/}
```

## Option 2: Replace with Placeholder (Better UX)

Replace the map section with a placeholder that still allows navigation:

```typescript
{/* Map Placeholder - Tap to view nearby users */}
<TouchableOpacity
  onPress={() => router.push("/nearby-buyers")}
  style={{
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#7C8B3A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  }}
>
  <View className="flex-1 items-center justify-center">
    <MapPin size={48} color="#FFFFFF" />
    <Text className="text-white text-lg font-bold mt-4">
      {t('farmerHome.viewNearbyUsers')}
    </Text>
    <Text className="text-white/70 text-sm mt-2">
      {t('farmerHome.tapToExplore')}
    </Text>
  </View>
</TouchableOpacity>
```

## After Making Changes

1. **Save the file**
2. **Rebuild the APK**:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleRelease
   ```
3. **Install and test**

## To Re-enable Map Later

Simply uncomment the map section or remove the placeholder when the MapLibre issue is resolved.

---

**Note**: This is a temporary workaround. The map functionality can be restored once the underlying MapLibre issues are fixed.
