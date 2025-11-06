# 🗺️ Plot My Farm - MapLibre Integration

## 🎉 **NO GOOGLE MAPS - 100% Open Source!**

Your Plot My Farm app now uses **MapLibre + OpenStreetMap** for all mapping features.

---

## ✅ **What's Installed**

### **Packages:**
- `@maplibre/maplibre-react-native` v10.4.0 - Map rendering
- `geolib` v3.3.4 - Distance calculations
- `expo-dev-client` v6.0.17 - Custom native modules

### **New Files:**
```
utils/haversine.ts              - Distance & radius filtering
services/map-service.ts         - Fetch nearby users from Supabase
components/MapLibreView.tsx     - Interactive map component
app/map-test.tsx                - Test screen
```

### **Configuration:**
- ✅ `app.json` - MapLibre plugin added
- ✅ `app/_layout.tsx` - Map screen registered
- ✅ Location permissions already configured

---

## 🚀 **Quick Start (3 Commands)**

```bash
# 1. Generate native projects
npx expo prebuild

# 2. Build development client
npx expo run:android

# 3. Test the map
# Navigate to /map-test in your app
```

**Time:** ~10 minutes for first build

---

## 🗺️ **Features**

### **Map Display:**
- ✅ OpenStreetMap tiles (free, no API key needed!)
- ✅ User's current location (blue marker)
- ✅ 30km radius circle (configurable)
- ✅ Pan, zoom, rotate

### **User Markers:**
- 🌾 **Green markers** = Farmers
- 🛒 **Brown markers** = Buyers
- Tap to see user details
- Shows distance from you

### **Filtering:**
- Show/hide farmers
- Show/hide buyers
- Adjust radius (5km - 100km)
- Real-time updates

### **Integration:**
- ✅ Uses existing location service
- ✅ Fetches from Supabase
- ✅ Respects user roles
- ✅ Distance calculations

---

## 📖 **Usage Example**

```tsx
import MapLibreView from '@/components/MapLibreView';
import { RADIUS_PRESETS } from '@/utils/haversine';

export default function MyScreen() {
  return (
    <MapLibreView
      showFarmers={true}
      showBuyers={true}
      radiusInMeters={RADIUS_PRESETS.DEFAULT} // 30km
      onUserPress={(user) => {
        console.log('Tapped user:', user.full_name);
        // Navigate to profile, etc.
      }}
      style={{ height: 300 }}
    />
  );
}
```

---

## 🎯 **Where to Use**

Replace placeholder maps in these screens:

### **Farmer Screens:**
- `app/farmer-home.tsx` - Show nearby buyers
- `app/nearby-buyers.tsx` - Full map of buyers

### **Buyer Screens:**
- `app/buyer-home.tsx` - Show nearby farmers
- `app/nearby-farmers.tsx` - Full map of farmers
- `app/nearby-crops.tsx` - Show crop locations

### **Shared:**
- `app/track-order.tsx` - Delivery tracking
- Any screen needing location visualization

---

## 🔧 **API Reference**

### **MapLibreView Component**

```tsx
<MapLibreView
  showFarmers?: boolean        // Show farmer markers (default: true)
  showBuyers?: boolean          // Show buyer markers (default: true)
  radiusInMeters?: number       // Search radius (default: 30000)
  onUserPress?: (user) => void  // Tap handler
  style?: ViewStyle             // Custom styles
/>
```

### **Map Service Functions**

```tsx
import {
  fetchNearbyUsers,
  fetchNearbyFarmers,
  fetchNearbyBuyers,
  updateUserLocation
} from '@/services/map-service';

// Get all nearby users
const users = await fetchNearbyUsers(userLocation, 30000);

// Get only farmers
const farmers = await fetchNearbyFarmers(userLocation, 30000);

// Get only buyers
const buyers = await fetchNearbyBuyers(userLocation, 30000);

// Update user location
await updateUserLocation(userId, lat, lng, 'City, Country');
```

### **Distance Utilities**

```tsx
import {
  calculateDistance,
  formatDistance,
  isWithinRadius,
  filterByRadius,
  sortByDistance,
  RADIUS_PRESETS
} from '@/utils/haversine';

// Calculate distance in meters
const distance = calculateDistance(point1, point2);

// Format for display
const formatted = formatDistance(point1, point2); // "2.5 km"

// Check if within radius
const isNearby = isWithinRadius(userLoc, targetLoc, 30000);

// Filter array
const nearby = filterByRadius(userLoc, locations, 30000);

// Sort by distance
const sorted = sortByDistance(userLoc, locations);

// Radius presets
RADIUS_PRESETS.VERY_CLOSE  // 5 km
RADIUS_PRESETS.CLOSE       // 10 km
RADIUS_PRESETS.NEARBY      // 20 km
RADIUS_PRESETS.DEFAULT     // 30 km
RADIUS_PRESETS.FAR         // 50 km
RADIUS_PRESETS.VERY_FAR    // 100 km
```

---

## 🗄️ **Database Requirements**

Your `users` table needs these fields (already exists):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  latitude DECIMAL(10, 8),      -- Required for map
  longitude DECIMAL(11, 8),     -- Required for map
  role TEXT,                    -- 'farmer' | 'buyer'
  full_name TEXT,
  profile_image_url TEXT,
  location TEXT,                -- City, Country
  is_verified BOOLEAN
);
```

**Ensure users have location data:**
```sql
-- Check users with location
SELECT COUNT(*) FROM users 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update your location
UPDATE users 
SET latitude = 17.3850, longitude = 78.4867, location = 'Hyderabad, India'
WHERE id = 'your-user-id';
```

---

## 🎨 **Customization**

### **Change Map Style**

Edit `components/MapLibreView.tsx`:

```tsx
<MapLibreGL.MapView
  styleURL="https://demotiles.maplibre.org/style.json"
  // OR use custom style:
  // styleURL="https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY"
/>
```

### **Custom Marker Colors**

```tsx
// In MapLibreView.tsx
farmerMarker: {
  backgroundColor: '#16a34a', // Change farmer color
},
buyerMarker: {
  backgroundColor: '#B27E4C', // Change buyer color
},
```

### **Custom Marker Icons**

Replace emoji with images:

```tsx
<View style={styles.marker}>
  <Image 
    source={require('@/assets/icons/farmer.png')}
    style={{ width: 32, height: 32 }}
  />
</View>
```

---

## 🐛 **Troubleshooting**

### **Map not showing?**
1. Build dev client: `npx expo run:android`
2. Check location permission granted
3. Verify `locationData` exists in WeatherContext

### **No markers appearing?**
1. Check users have `latitude` and `longitude` in database
2. Verify you're within radius of other users
3. Check console for errors

### **Build fails?**
```bash
npx expo prebuild --clean
cd android && ./gradlew clean && cd ..
npx expo run:android
```

---

## 📚 **Documentation**

- **Quick Start:** `MAPLIBRE_QUICK_START.md`
- **Complete Guide:** `MAPLIBRE_SETUP_COMPLETE.md`
- **Expo Dev Client:** `EXPO_DEV_CLIENT_SETUP_GUIDE.md`

---

## 🌟 **Why MapLibre?**

### **vs Google Maps:**
- ✅ **Free** - No API costs
- ✅ **Open Source** - Full control
- ✅ **No API key** - Simpler setup
- ✅ **Privacy** - No Google tracking
- ✅ **Customizable** - Any map style

### **vs Mapbox:**
- ✅ **Free** - No usage limits
- ✅ **Open Source** - Community driven
- ✅ **No vendor lock-in**

---

## ✅ **Summary**

**You have:**
- ✅ MapLibre + OpenStreetMap integration
- ✅ Real-time location tracking
- ✅ 30km radius filtering
- ✅ Custom farmer/buyer markers
- ✅ Supabase backend integration
- ✅ Distance calculations
- ✅ Interactive map component

**Next step:**
```bash
npx expo prebuild && npx expo run:android
```

---

**Questions?** Check the documentation or MapLibre docs: https://maplibre.org/

**Happy Mapping!** 🗺️✨

