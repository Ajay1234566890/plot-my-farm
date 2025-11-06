# 🚀 Build & Test Guide - MapLibre Integration

## ✅ **Integration Complete!**

All screens have been updated with real MapLibre + OpenStreetMap integration:

- ✅ **farmer-home.tsx** - Shows nearby buyers map
- ✅ **buyer-home.tsx** - Shows nearby farmers map
- ✅ **nearby-farmers.tsx** - Full-screen farmers map
- ✅ **nearby-buyers.tsx** - Full-screen buyers map
- ✅ **track-order.tsx** - Delivery tracking map
- ✅ **Location auto-update** - Automatically updates user location in Supabase
- ✅ **Error handling** - Graceful fallbacks for map failures

---

## 📋 **Pre-Build Checklist**

### **1. Verify Environment Variables**

Check `.env` file:
```bash
cat .env
```

Should contain:
```
EXPO_PUBLIC_SUPABASE_URL=https://dlwbvoqowqiugyjdfyax.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. Verify Dependencies**

```bash
npm list @maplibre/maplibre-react-native geolib expo-dev-client
```

Should show:
- `@maplibre/maplibre-react-native@10.4.0`
- `geolib@3.3.4`
- `expo-dev-client@6.0.17`

### **3. Verify app.json Plugins**

```bash
cat app.json | grep -A 5 plugins
```

Should include:
```json
"plugins": [
  "expo-router",
  "expo-dev-client",
  "@maplibre/maplibre-react-native",
  ...
]
```

---

## 🏗️ **Build Process**

### **Step 1: Clean Previous Builds**

```bash
# Clean Metro cache
npx expo start --clear

# Remove previous native folders (if they exist)
rm -rf android ios

# Clean node modules (optional, if issues persist)
rm -rf node_modules
npm install
```

### **Step 2: Prebuild Native Projects**

```bash
npx expo prebuild --clean
```

**Expected output:**
```
✔ Created native projects | /android, /ios
✔ Installed pods
```

**What this does:**
- Creates `android/` folder with MapLibre configured
- Creates `ios/` folder with MapLibre configured
- Applies all plugins from `app.json`
- Configures location permissions

### **Step 3: Build Development Client**

#### **For Android:**

```bash
npx expo run:android
```

**Expected output:**
```
✔ Built the app
✔ Installed the app on the device
✔ Starting Metro bundler
```

**Time:** 5-10 minutes (first build)

#### **For iOS (Mac only):**

```bash
npx expo run:ios
```

---

## 📱 **Testing the Integration**

### **Test 1: Location Detection**

1. **Open the app**
2. **Grant location permission** when prompted
3. **Check console logs:**
   ```
   🗺️ [AUTH] Starting location auto-update for user: <user-id>
   📍 [LOCATION AUTO-UPDATE] Getting current location...
   ✅ [LOCATION AUTO-UPDATE] Location updated in Supabase
   ```

### **Test 2: Farmer Home Map**

1. **Login as farmer**
2. **Navigate to Farmer Home**
3. **Scroll down to "Nearby Buyers" section**
4. **Verify:**
   - ✅ Map loads successfully
   - ✅ Blue marker shows your location
   - ✅ Brown markers show nearby buyers
   - ✅ Green circle shows 30km radius
   - ✅ Tap marker shows buyer info

### **Test 3: Buyer Home Map**

1. **Login as buyer**
2. **Navigate to Buyer Home**
3. **See floating map at top**
4. **Verify:**
   - ✅ Map loads successfully
   - ✅ Blue marker shows your location
   - ✅ Green markers show nearby farmers
   - ✅ Tap marker navigates to farmer details

### **Test 4: Nearby Farmers Screen**

1. **Navigate to Nearby Farmers**
2. **Verify:**
   - ✅ Full map view loads
   - ✅ Shows all farmers within 30km
   - ✅ Can tap markers
   - ✅ Refresh button works

### **Test 5: Nearby Buyers Screen**

1. **Navigate to Nearby Buyers**
2. **Verify:**
   - ✅ Full map view loads
   - ✅ Shows all buyers within 30km
   - ✅ Can tap markers
   - ✅ Refresh button works

### **Test 6: Track Order Map**

1. **Navigate to Track Order**
2. **Verify:**
   - ✅ Map shows delivery route
   - ✅ Shows nearby users (farmers & buyers)
   - ✅ 10km radius (closer range)

### **Test 7: Location Auto-Update**

1. **Check Supabase database:**
   ```sql
   SELECT id, full_name, latitude, longitude, location, updated_at
   FROM users
   WHERE id = 'your-user-id';
   ```
2. **Verify:**
   - ✅ `latitude` and `longitude` are populated
   - ✅ `location` shows city/country
   - ✅ `updated_at` is recent

### **Test 8: 30km Radius Filtering**

1. **Add test users in Supabase:**
   ```sql
   -- User within 30km (should appear)
   INSERT INTO users (email, full_name, role, latitude, longitude, location)
   VALUES ('nearby@test.com', 'Nearby User', 'farmer', 17.4000, 78.5000, 'Hyderabad');
   
   -- User beyond 30km (should NOT appear)
   INSERT INTO users (email, full_name, role, latitude, longitude, location)
   VALUES ('far@test.com', 'Far User', 'farmer', 18.5000, 79.5000, 'Warangal');
   ```
2. **Verify:**
   - ✅ Only users within 30km appear on map
   - ✅ User count is accurate

---

## 🐛 **Troubleshooting**

### **Issue 1: "MapLibre is not defined"**

**Cause:** Using Expo Go instead of dev client

**Solution:**
```bash
npx expo prebuild --clean
npx expo run:android
```

---

### **Issue 2: Map shows but no markers**

**Cause:** No users with location data in Supabase

**Solution:**
```sql
-- Update your user with location
UPDATE users 
SET latitude = 17.3850, longitude = 78.4867, location = 'Hyderabad, India'
WHERE id = 'your-user-id';
```

---

### **Issue 3: Location permission denied**

**Solution:**
- Android: Settings → Apps → Plot My Farm → Permissions → Location → Allow
- iOS: Settings → Plot My Farm → Location → While Using the App

---

### **Issue 4: Build fails with "plugin not found"**

**Solution:**
```bash
# Clean everything
rm -rf android ios node_modules
npm install
npx expo prebuild --clean
npx expo run:android
```

---

### **Issue 5: Map loads but crashes**

**Check console for errors:**
```bash
npx react-native log-android
```

**Common fixes:**
- Ensure Supabase credentials are correct
- Check internet connection
- Verify location permissions granted

---

## 📊 **Performance Checklist**

- [ ] Map loads within 3 seconds
- [ ] Location detected within 5 seconds
- [ ] Markers render smoothly (no lag)
- [ ] Tap interactions are responsive
- [ ] Refresh updates data correctly
- [ ] No memory leaks (test by navigating back/forth)
- [ ] Works on real device (not just emulator)
- [ ] Works offline (shows cached location)

---

## 🎯 **Production Build**

### **For Android APK:**

```bash
# Using EAS Build (recommended)
eas build --profile development --platform android

# Or local build
cd android
./gradlew assembleRelease
```

### **For iOS:**

```bash
eas build --profile development --platform ios
```

---

## 📝 **Post-Build Verification**

### **1. Check APK Size**

```bash
ls -lh android/app/build/outputs/apk/release/
```

**Expected:** ~50-80 MB

### **2. Test on Real Device**

- Install APK on physical Android device
- Test all map features
- Verify location detection works
- Check battery usage (should be minimal)

### **3. Monitor Logs**

```bash
adb logcat | grep -E "MAP|LOCATION|AUTH"
```

**Look for:**
- ✅ Location auto-update starting
- ✅ Map service fetching nearby users
- ✅ No error messages

---

## ✅ **Success Criteria**

Your integration is successful if:

1. ✅ **All 5 screens** show real maps (not placeholders)
2. ✅ **Location auto-updates** in Supabase every 5 minutes
3. ✅ **30km radius filtering** works correctly
4. ✅ **Markers are clickable** and show user info
5. ✅ **No crashes** when navigating between screens
6. ✅ **Works on real device** with GPS enabled
7. ✅ **Error handling** shows fallback UI if map fails

---

## 🎉 **You're Done!**

Your Plot My Farm app now has:
- ✅ Real-time location tracking
- ✅ Interactive OpenStreetMap integration
- ✅ 30km radius filtering
- ✅ Custom farmer/buyer markers
- ✅ Automatic location updates
- ✅ Production-ready map features

**Next steps:**
1. Build the APK
2. Test on real device
3. Deploy to production!

---

**Questions?** Check the troubleshooting section or review the documentation files.

