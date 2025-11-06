# 🚀 Expo Dev Client Setup Complete - Next Steps

## ✅ What Was Just Installed

**Package:** `expo-dev-client` v6.0.17
**Status:** ✅ Successfully installed and configured

### Changes Made:
1. ✅ Installed `expo-dev-client` package
2. ✅ Added `expo-dev-client` plugin to `app.json`

---

## 📱 What is Expo Dev Client?

Expo Dev Client is a **custom development build** that replaces Expo Go. It allows you to:

✅ Use **ANY native library** (including MapLibre, Mapbox, custom modules)
✅ Keep **Expo ecosystem benefits** (EAS Build, OTA Updates)
✅ Add **custom native code** without full ejection
✅ Test with **your own development app** instead of Expo Go

---

## 🎯 Next Steps - Build Your Custom Dev Client

### **Step 1: Build Native Projects (Prebuild)**

You need to generate the `android/` and `ios/` folders:

```bash
# This creates native folders with expo-dev-client configured
npx expo prebuild
```

**What this does:**
- Creates `android/` folder with native Android project
- Creates `ios/` folder with native iOS project
- Configures expo-dev-client in both
- Applies all plugins from app.json

---

### **Step 2: Build and Run Development Client**

#### **Option A: Local Development Build (Android)**

```bash
# Build and install on connected Android device/emulator
npx expo run:android

# This will:
# 1. Build the custom dev client APK
# 2. Install it on your device
# 3. Start the Metro bundler
```

#### **Option B: Local Development Build (iOS - Mac only)**

```bash
# Build and install on iOS simulator/device
npx expo run:ios
```

#### **Option C: Cloud Build with EAS (Recommended for iOS)**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS
eas build:configure

# Build development client for Android
eas build --profile development --platform android

# Build development client for iOS
eas build --profile development --platform ios
```

---

## 🗺️ Now You Can Install Map Libraries!

### **Option 1: react-native-maps (Still Works!)**

```bash
npx expo install react-native-maps
```

Add to `app.json`:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

---

### **Option 2: MapLibre (Now Available!)**

```bash
npm install @maplibre/maplibre-react-native
```

Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-dev-client",
      "@maplibre/maplibre-react-native"
    ]
  }
}
```

Then rebuild:
```bash
npx expo prebuild --clean
npx expo run:android
```

---

### **Option 3: Mapbox (Now Available!)**

```bash
npm install @rnmapbox/maps
```

Configure in `app.json` and rebuild.

---

## 🔄 Development Workflow Changes

### **Before (Expo Go):**
```bash
npm start
# Scan QR code with Expo Go app
```

### **After (Expo Dev Client):**
```bash
# First time: Build dev client
npx expo run:android

# Daily development:
npm start
# Scan QR code with YOUR custom dev client app
```

---

## 📊 Comparison: Before vs After

| Feature | Expo Go (Before) | Dev Client (Now) |
|---------|------------------|------------------|
| **react-native-maps** | ✅ Yes | ✅ Yes |
| **MapLibre** | ❌ No | ✅ **YES!** |
| **Mapbox** | ❌ No | ✅ **YES!** |
| **Custom Native Modules** | ❌ No | ✅ **YES!** |
| **Testing App** | Expo Go | Your custom app |
| **Build Time** | Instant | ~5-10 min first time |
| **EAS Build** | ✅ Yes | ✅ Yes |
| **OTA Updates** | ✅ Yes | ✅ Yes |

---

## ⚠️ Important Notes

### **1. You Can't Use Expo Go Anymore**
- After adding custom native modules, Expo Go won't work
- You need to use your custom dev client app

### **2. Rebuild After Adding Native Modules**
```bash
# Clean rebuild when adding new native libraries
npx expo prebuild --clean
npx expo run:android
```

### **3. Native Folders Are Now Part of Your Project**
- `android/` and `ios/` folders will be created
- You can modify native code if needed
- Add to `.gitignore` if using EAS Build (recommended)

---

## 🎯 Recommended Next Steps for Plot My Farm

### **Immediate Actions:**

1. **Generate Native Projects**
   ```bash
   npx expo prebuild
   ```

2. **Build Development Client for Android**
   ```bash
   npx expo run:android
   ```

3. **Choose Your Map Library**
   - For simplicity: `react-native-maps`
   - For advanced features: `MapLibre` or `Mapbox`

4. **Get API Keys**
   - Google Maps API key (for react-native-maps)
   - OR MapLibre/Mapbox token

5. **Install Map Library**
   ```bash
   npx expo install react-native-maps
   # OR
   npm install @maplibre/maplibre-react-native
   ```

6. **Rebuild if Using MapLibre/Mapbox**
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```

---

## 🗺️ Quick Map Implementation Example

### **Using react-native-maps:**

```tsx
import MapView, { Marker } from 'react-native-maps';
import { useWeather } from '@/contexts/weather-context';

export default function BuyerHome() {
  const { locationData } = useWeather();
  
  return (
    <MapView
      style={{ width: '100%', height: 250 }}
      initialRegion={{
        latitude: locationData?.coordinates.latitude || 17.3850,
        longitude: locationData?.coordinates.longitude || 78.4867,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: locationData?.coordinates.latitude || 17.3850,
          longitude: locationData?.coordinates.longitude || 78.4867,
        }}
        title="Your Location"
      />
    </MapView>
  );
}
```

---

## 🐛 Troubleshooting

### **Issue: "expo-dev-client not found"**
```bash
npm install
npx expo prebuild --clean
```

### **Issue: Build fails**
```bash
# Clear cache and rebuild
npx expo prebuild --clean
cd android && ./gradlew clean && cd ..
npx expo run:android
```

### **Issue: Metro bundler conflicts**
```bash
# Clear Metro cache
npx expo start --clear
```

---

## 📚 Resources

- [Expo Dev Client Docs](https://docs.expo.dev/develop/development-builds/introduction/)
- [react-native-maps Docs](https://github.com/react-native-maps/react-native-maps)
- [MapLibre React Native](https://github.com/maplibre/maplibre-react-native)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

## ✅ Summary

You've successfully upgraded from **Expo Go** to **Expo Dev Client**! 🎉

**What you gained:**
- ✅ Ability to use ANY native library
- ✅ MapLibre and Mapbox support
- ✅ Custom native modules
- ✅ Still keep Expo ecosystem benefits

**Next step:** Run `npx expo prebuild` to generate native projects!

---

**Need help?** Check the troubleshooting section or Expo documentation.

