# 🗺️ MapLibre + OpenStreetMap Integration - COMPLETE

## ✅ **Installation Complete!**

Your Plot My Farm app now has **full MapLibre + OpenStreetMap integration** with:
- ✅ Real-time location tracking
- ✅ 30km radius filtering
- ✅ Custom farmer/buyer markers
- ✅ Supabase backend integration
- ✅ Distance calculations
- ✅ Interactive map with OpenStreetMap tiles

---

## 📦 **What Was Installed**

### **Packages:**
```json
{
  "@maplibre/maplibre-react-native": "^10.0.0",
  "geolib": "^3.3.4",
  "expo-dev-client": "~6.0.17"
}
```

### **Files Created:**

1. **`utils/haversine.ts`** - Distance calculations & radius filtering
2. **`services/map-service.ts`** - Fetch nearby users from Supabase
3. **`components/MapLibreView.tsx`** - MapLibre component with markers
4. **`app/map-test.tsx`** - Test screen for map functionality

### **Files Modified:**

1. **`app.json`** - Added MapLibre plugin
2. **`app/_layout.tsx`** - Registered map-test screen

---

## 🚀 **Next Steps - Build Development Client**

### **IMPORTANT:** You MUST build a development client to use MapLibre!

MapLibre requires native modules that aren't included in Expo Go.

### **Step 1: Prebuild Native Projects**

```bash
npx expo prebuild
```

This creates `android/` and `ios/` folders with MapLibre configured.

### **Step 2: Build & Run Development Client**

#### **For Android:**
```bash
npx expo run:android
```

This will:
1. Build the custom dev client APK
2. Install it on your connected device/emulator
3. Start the Metro bundler

#### **For iOS (Mac only):**
```bash
npx expo run:ios
```

---

## 🗺️ **How to Use the Map**

### **Test the Map:**

1. **Build dev client** (see above)
2. **Navigate to map test screen:**
   ```tsx
   import { useRouter } from 'expo-router';
   
   const router = useRouter();
   router.push('/map-test');
   ```

### **Use in Your Screens:**

```tsx
import MapLibreView from '@/components/MapLibreView';
import { RADIUS_PRESETS } from '@/utils/haversine';

export default function YourScreen() {
  return (
    <MapLibreView
      showFarmers={true}
      showBuyers={true}
      radiusInMeters={RADIUS_PRESETS.DEFAULT} // 30km
      onUserPress={(user) => {
        console.log('User pressed:', user);
        // Navigate to user profile, etc.
      }}
    />
  );
}
```

---

## 🎨 **Map Features**

### **1. User Location Marker**
- Blue circle with white center
- Shows your current location
- Automatically centered on map

### **2. Nearby Users Markers**
- 🌾 **Green markers** = Farmers
- 🛒 **Brown markers** = Buyers
- Tap marker to see user info

### **3. Radius Circle**
- Light green circle showing 30km radius
- Configurable via `radiusInMeters` prop
- Visual indicator of search area

### **4. Info Overlay**
- Shows count of nearby users
- Refresh button to reload data
- Real-time updates

---

## 🔧 **Configuration Options**

### **MapLibreView Props:**

```tsx
interface MapLibreViewProps {
  showFarmers?: boolean;        // Show farmer markers (default: true)
  showBuyers?: boolean;          // Show buyer markers (default: true)
  radiusInMeters?: number;       // Search radius (default: 30000)
  onUserPress?: (user) => void;  // Callback when marker tapped
  style?: any;                   // Custom styles
}
```

### **Radius Presets:**

```tsx
import { RADIUS_PRESETS } from '@/utils/haversine';

RADIUS_PRESETS.VERY_CLOSE  // 5 km
RADIUS_PRESETS.CLOSE       // 10 km
RADIUS_PRESETS.NEARBY      // 20 km
RADIUS_PRESETS.DEFAULT     // 30 km
RADIUS_PRESETS.FAR         // 50 km
RADIUS_PRESETS.VERY_FAR    // 100 km
```

---

## 📊 **Database Integration**

### **Required User Fields:**

Your `users` table already has these fields:
```sql
- latitude (DECIMAL)
- longitude (DECIMAL)
- role (TEXT: 'farmer' | 'buyer' | 'admin')
- full_name (TEXT)
- profile_image_url (TEXT)
- is_verified (BOOLEAN)
```

### **Map Service Functions:**

```tsx
import { 
  fetchNearbyUsers,
  fetchNearbyFarmers,
  fetchNearbyBuyers,
  updateUserLocation 
} from '@/services/map-service';

// Fetch all nearby users
const users = await fetchNearbyUsers(userLocation, 30000);

// Fetch only farmers
const farmers = await fetchNearbyFarmers(userLocation, 30000);

// Fetch only buyers
const buyers = await fetchNearbyBuyers(userLocation, 30000);

// Update user's location
await updateUserLocation(userId, latitude, longitude, 'City, Country');
```

---

## 🎯 **Integration Examples**

### **Example 1: Farmer Home Screen**

Replace the placeholder map image with real MapLibre:

```tsx
// app/farmer-home.tsx
import MapLibreView from '@/components/MapLibreView';

export default function FarmerHome() {
  return (
    <View>
      {/* Replace static image with: */}
      <MapLibreView
        showFarmers={false}  // Don't show other farmers
        showBuyers={true}    // Show nearby buyers
        radiusInMeters={30000}
        style={{ height: 250 }}
        onUserPress={(buyer) => {
          router.push({
            pathname: '/buyer-profile',
            params: { buyerId: buyer.id }
          });
        }}
      />
    </View>
  );
}
```

### **Example 2: Buyer Home Screen**

```tsx
// app/buyer-home.tsx
import MapLibreView from '@/components/MapLibreView';

export default function BuyerHome() {
  return (
    <View>
      <MapLibreView
        showFarmers={true}   // Show nearby farmers
        showBuyers={false}   // Don't show other buyers
        radiusInMeters={30000}
        style={{ height: 250 }}
        onUserPress={(farmer) => {
          router.push({
            pathname: '/farmer-details',
            params: { farmerId: farmer.id }
          });
        }}
      />
    </View>
  );
}
```

### **Example 3: Nearby Farmers Screen**

```tsx
// app/nearby-farmers.tsx
import MapLibreView from '@/components/MapLibreView';

export default function NearbyFarmers() {
  return (
    <View style={{ flex: 1 }}>
      <MapLibreView
        showFarmers={true}
        showBuyers={false}
        radiusInMeters={50000} // 50km radius
      />
    </View>
  );
}
```

---

## 🛠️ **Utility Functions**

### **Distance Calculations:**

```tsx
import { 
  calculateDistance,
  formatDistance,
  isWithinRadius,
  filterByRadius,
  sortByDistance 
} from '@/utils/haversine';

// Calculate distance between two points
const distance = calculateDistance(
  { latitude: 17.3850, longitude: 78.4867 },
  { latitude: 17.4400, longitude: 78.4800 }
); // Returns distance in meters

// Format distance for display
const formatted = formatDistance(point1, point2); // "2.5 km"

// Check if within radius
const isNearby = isWithinRadius(userLoc, targetLoc, 30000); // true/false

// Filter array by radius
const nearbyLocations = filterByRadius(userLoc, allLocations, 30000);

// Sort by distance (nearest first)
const sorted = sortByDistance(userLoc, locations);
```

---

## 🎨 **Customization**

### **Change Map Style:**

Edit `components/MapLibreView.tsx`:

```tsx
<MapLibreGL.MapView
  styleURL="https://demotiles.maplibre.org/style.json"  // Default
  // OR use custom style:
  // styleURL="https://your-custom-style.json"
/>
```

**Free OpenStreetMap Styles:**
- `https://demotiles.maplibre.org/style.json` (Default)
- Maptiler: https://cloud.maptiler.com/maps/
- Mapbox: https://www.mapbox.com/maps/

### **Custom Marker Icons:**

Replace emoji markers with custom images:

```tsx
<MapLibreGL.PointAnnotation
  id={`user-${user.id}`}
  coordinate={[user.longitude, user.latitude]}
>
  <Image
    source={user.role === 'farmer' 
      ? require('@/assets/icons/farmer-marker.png')
      : require('@/assets/icons/buyer-marker.png')
    }
    style={{ width: 40, height: 40 }}
  />
</MapLibreGL.PointAnnotation>
```

---

## 🐛 **Troubleshooting**

### **Issue: "MapLibre not found"**

**Solution:** You need to build the dev client:
```bash
npx expo prebuild
npx expo run:android
```

### **Issue: Map not showing**

**Solution:** Check location permissions:
```tsx
import { useWeather } from '@/contexts/weather-context';

const { locationData, isLoadingLocation } = useWeather();

if (!locationData) {
  // Request location permission
}
```

### **Issue: No users showing on map**

**Solution:** Check Supabase data:
```sql
-- Verify users have location data
SELECT id, full_name, role, latitude, longitude 
FROM users 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

### **Issue: Build fails**

**Solution:** Clean and rebuild:
```bash
npx expo prebuild --clean
cd android && ./gradlew clean && cd ..
npx expo run:android
```

---

## 📚 **Resources**

- [MapLibre React Native Docs](https://github.com/maplibre/maplibre-react-native)
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js/docs/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Geolib Docs](https://github.com/manuelbieh/geolib)

---

## ✅ **Summary**

You now have a **complete MapLibre + OpenStreetMap integration** with:

✅ **NO Google Maps** - 100% open source!
✅ **Real-time location tracking**
✅ **30km radius filtering**
✅ **Custom farmer/buyer markers**
✅ **Supabase integration**
✅ **Distance calculations**
✅ **Interactive maps**

**Next step:** Run `npx expo prebuild` and `npx expo run:android` to build your dev client!

---

**Questions?** Check the troubleshooting section or MapLibre documentation.

