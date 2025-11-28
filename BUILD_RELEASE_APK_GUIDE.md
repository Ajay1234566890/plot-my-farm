# 🚀 Quick Start - Build Release APK

## Current Status
✅ Android project ready
✅ Build script created
⏳ Waiting for Java JDK 17 installation

---

## Step-by-Step Instructions

### 📥 Step 1: Install Java JDK 17 (If Not Already Done)

1. **Download**: https://adoptium.net/temurin/releases/
   - Operating System: **Windows**
   - Architecture: **x64**
   - Package Type: **JDK**
   - Version: **17 - LTS**

2. **Install**:
   - Run the downloaded `.msi` file
   - ✅ **IMPORTANT**: Check "Set JAVA_HOME variable"
   - Complete the installation

3. **Restart Terminal**:
   - Close ALL terminal windows
   - Open a NEW terminal

---

### 🔨 Step 2: Build Release APK

**Option A: Using the Automated Script (Recommended)**
```powershell
cd c:\Users\nagen\Desktop\saaiiiipmf\plot-my-farm
.\build-release-apk.bat
```

**Option B: Manual Build**
```powershell
cd c:\Users\nagen\Desktop\saaiiiipmf\plot-my-farm\android
.\gradlew.bat assembleRelease
```

---

### 📱 Step 3: Find Your APK

After successful build, your APK will be at:
```
c:\Users\nagen\Desktop\saaiiiipmf\plot-my-farm\android\app\build\outputs\apk\release\app-release.apk
```

---

## ⏱️ Build Time

- **First Build**: 5-10 minutes (downloads dependencies)
- **Subsequent Builds**: 2-3 minutes

---

## 📲 Installing on Android Device

### Method 1: USB Transfer
1. Connect your Android device via USB
2. Copy `app-release.apk` to your device
3. On device: Settings → Security → Enable "Install from unknown sources"
4. Open the APK file on your device
5. Tap "Install"

### Method 2: Email/Cloud
1. Email the APK to yourself
2. Open email on Android device
3. Download and install the APK

### Method 3: ADB (If device is connected)
```powershell
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

---

## ✅ Verification Checklist

After Java Installation:
- [ ] Open NEW terminal
- [ ] Run: `java -version`
- [ ] Should show: `openjdk version "17.x.x"`

After APK Build:
- [ ] Build completes without errors
- [ ] APK file exists in `android\app\build\outputs\apk\release\`
- [ ] APK size is reasonable (20-50 MB)

After Installation:
- [ ] App installs on device
- [ ] App launches without crashes
- [ ] Can login as farmer/buyer
- [ ] All features work

---

## 🔧 Troubleshooting

### "Java is not recognized"
**Solution**: 
1. Make sure you installed JDK (not JRE)
2. Restart your terminal
3. Check: `java -version`

### "JAVA_HOME is not set"
**Solution**:
1. Reinstall JDK
2. Check "Set JAVA_HOME variable" during installation
3. Or manually set it:
   ```powershell
   setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"
   ```

### Build fails with "SDK not found"
**Solution**:
```powershell
cd android
.\gradlew.bat --stop
.\gradlew.bat assembleRelease
```

### APK won't install on device
**Solution**:
1. Enable "Install from unknown sources" in device settings
2. If updating existing app, uninstall old version first
3. Make sure device has enough storage space

---

## 📊 What's Included in This Release

✅ All bug fixes:
- Back button navigation fixed
- Profile picture clickable
- Notifications navigate properly
- Market prices show correct bottom nav

✅ Features:
- Farmer and Buyer dashboards
- Crop management
- Market prices (real-time from government API)
- Messaging
- Offers and orders
- Profile management
- Multi-language support

---

## 🎯 Next Steps After Build

1. **Test the APK** on your Android device
2. **Verify all features** work correctly
3. **Check database connectivity**
4. **Test both farmer and buyer flows**

---

## 📞 Quick Commands Reference

```powershell
# Check Java version
java -version

# Build release APK (automated)
.\build-release-apk.bat

# Build release APK (manual)
cd android
.\gradlew.bat assembleRelease

# Install on connected device
adb install -r android\app\build\outputs\apk\release\app-release.apk

# View connected devices
adb devices
```

---

## ⚡ Ready to Build!

Once Java is installed and you've restarted your terminal, simply run:

```powershell
.\build-release-apk.bat
```

The script will:
1. ✅ Check if Java is installed
2. ✅ Clean previous builds
3. ✅ Build the release APK
4. ✅ Show you where the APK is located

---

**Last Updated**: 2025-11-28
**Status**: Ready for build (after Java installation)
