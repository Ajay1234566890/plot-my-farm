# 🚀 MapLibre Quick Start Guide

## ✅ **Installation Complete!**

All packages are installed and configured. Now you just need to build the development client.

---

## 📋 **3-Step Quick Start**

### **Step 1: Generate Native Projects**

```bash
npx expo prebuild
```

**What this does:**
- Creates `android/` folder
- Creates `ios/` folder  
- Configures MapLibre native modules
- Applies all plugins from app.json

**Expected output:**
```
✔ Created native projects | /android, /ios
```

---

### **Step 2: Build Development Client**

```bash
npx expo run:android
```

**What this does:**
- Builds custom dev client APK with MapLibre
- Installs on connected device/emulator
- Starts Metro bundler

**Expected output:**
```
✔ Built the app
✔ Installed the app on the device
```

**Time:** ~5-10 minutes (first build)

---

### **Step 3: Test the Map**

Once the app is running:

1. **Login** to your account
2. **Navigate** to the map test screen:
   - Add a button in your home screen:
   ```tsx
   <TouchableOpacity onPress={() => router.push('/map-test')}>
     <Text>Test Map</Text>
   </TouchableOpacity>
   ```
3. **Allow location permissions** when prompted
4. **See the map** with nearby farmers/buyers!

---

## 🎯 **What You'll See**

### **Map Features:**
- 🗺️ **OpenStreetMap tiles** (no Google!)
- 📍 **Your location** (blue marker)
- 🌾 **Nearby farmers** (green markers)
- 🛒 **Nearby buyers** (brown markers)
- ⭕ **30km radius circle** (light green)
- 📊 **User count** (top overlay)
- 🔄 **Refresh button**

### **Interactive:**
- **Tap markers** to see user info
- **Pan/zoom** the map
- **Filter** farmers/buyers
- **Change radius** (5km - 100km)

---

## 🔧 **Prerequisites**

### **For Android:**
- ✅ Android Studio installed
- ✅ Android SDK configured
- ✅ Device/emulator connected
- ✅ USB debugging enabled

### **Check device connection:**
```bash
adb devices
```

Should show:
```
List of devices attached
XXXXXXXXXX    device
```

---

## 📱 **Development Workflow**

### **First Time Setup:**
```bash
# 1. Prebuild
npx expo prebuild

# 2. Build & run
npx expo run:android
```

### **Daily Development:**
```bash
# Just start the dev server
npm start

# App will reload automatically
# No need to rebuild unless you:
# - Add new native modules
# - Change app.json plugins
# - Update native dependencies
```

### **When to Rebuild:**
```bash
# Clean rebuild
npx expo prebuild --clean
npx expo run:android
```

**Rebuild when:**
- ❌ Map not showing
- ❌ Added new native library
- ❌ Changed app.json plugins
- ❌ Updated MapLibre version

---

## 🗺️ **Using the Map in Your Screens**

### **Example: Replace Placeholder in Farmer Home**

**Before (placeholder image):**
```tsx
<Image
  source={{ uri: "https://placehold.co/800x400.png?text=Map+View" }}
  style={{ width: '100%', height: 250 }}
/>
```

**After (real MapLibre):**
```tsx
import MapLibreView from '@/components/MapLibreView';

<MapLibreView
  showFarmers={false}
  showBuyers={true}
  radiusInMeters={30000}
  style={{ width: '100%', height: 250 }}
  onUserPress={(buyer) => {
    router.push({
      pathname: '/buyer-profile',
      params: { buyerId: buyer.id }
    });
  }}
/>
```

---

## 🎨 **Customization Examples**

### **1. Show Only Farmers (Buyer's View)**
```tsx
<MapLibreView
  showFarmers={true}
  showBuyers={false}
  radiusInMeters={30000}
/>
```

### **2. Show Only Buyers (Farmer's View)**
```tsx
<MapLibreView
  showFarmers={false}
  showBuyers={true}
  radiusInMeters={30000}
/>
```

### **3. Larger Radius (50km)**
```tsx
import { RADIUS_PRESETS } from '@/utils/haversine';

<MapLibreView
  radiusInMeters={RADIUS_PRESETS.FAR} // 50km
/>
```

### **4. Custom User Press Handler**
```tsx
<MapLibreView
  onUserPress={(user) => {
    Alert.alert(
      user.full_name,
      `${user.role} - ${user.distanceFormatted} away`
    );
  }}
/>
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "expo-dev-client not found"**

**Solution:**
```bash
npm install
npx expo prebuild --clean
npx expo run:android
```

---

### **Issue 2: "MapLibre is not defined"**

**Cause:** Using Expo Go instead of dev client

**Solution:** Build dev client:
```bash
npx expo run:android
```

---

### **Issue 3: Map shows but no markers**

**Cause:** No users with location data in Supabase

**Solution:** Add test data:
```sql
-- Update your user with location
UPDATE users 
SET latitude = 17.3850, longitude = 78.4867, location = 'Hyderabad, India'
WHERE id = 'your-user-id';

-- Add test farmer
INSERT INTO users (email, full_name, role, latitude, longitude, location)
VALUES ('farmer@test.com', 'Test Farmer', 'farmer', 17.4000, 78.5000, 'Hyderabad');

-- Add test buyer
INSERT INTO users (email, full_name, role, latitude, longitude, location)
VALUES ('buyer@test.com', 'Test Buyer', 'buyer', 17.3700, 78.4700, 'Hyderabad');
```

---

### **Issue 4: Location permission denied**

**Solution:** Grant permission manually:
- Android: Settings → Apps → Plot My Farm → Permissions → Location → Allow

---

### **Issue 5: Build fails**

**Solution:** Clean everything:
```bash
# Clean Metro cache
npx expo start --clear

# Clean Android build
cd android && ./gradlew clean && cd ..

# Clean prebuild
npx expo prebuild --clean

# Rebuild
npx expo run:android
```

---

## 📊 **Testing Checklist**

Before deploying, test these scenarios:

- [ ] Map loads successfully
- [ ] User location marker appears
- [ ] Nearby users show as markers
- [ ] Tap marker shows user info
- [ ] Filter farmers/buyers works
- [ ] Change radius works
- [ ] Refresh button works
- [ ] Location permission handled
- [ ] Error states display correctly
- [ ] Works on real device (not just emulator)

---

## 🎯 **Next Steps**

### **1. Integrate into Existing Screens**

Replace placeholder maps in:
- ✅ `app/farmer-home.tsx`
- ✅ `app/buyer-home.tsx`
- ✅ `app/nearby-farmers.tsx`
- ✅ `app/nearby-buyers.tsx`
- ✅ `app/track-order.tsx`

### **2. Add Real User Data**

Ensure all users have location:
```tsx
// When user registers or updates profile
import { updateUserLocation } from '@/services/map-service';

await updateUserLocation(
  user.id,
  locationData.coordinates.latitude,
  locationData.coordinates.longitude,
  locationData.address
);
```

### **3. Enhance Features**

- Add crop locations on map
- Show delivery routes
- Add clustering for many markers
- Custom map styles
- Offline map support

---

## 📚 **Documentation**

- **Full Guide:** `MAPLIBRE_SETUP_COMPLETE.md`
- **API Reference:** `services/map-service.ts`
- **Utilities:** `utils/haversine.ts`
- **Component:** `components/MapLibreView.tsx`

---

## ✅ **Summary**

**You have:**
- ✅ MapLibre installed
- ✅ Expo Dev Client configured
- ✅ Map component ready
- ✅ Supabase integration
- ✅ Distance calculations
- ✅ Test screen created

**You need to:**
1. Run `npx expo prebuild`
2. Run `npx expo run:android`
3. Test the map!

---

**Ready to build?** Run the commands above and see your map come to life! 🗺️✨

