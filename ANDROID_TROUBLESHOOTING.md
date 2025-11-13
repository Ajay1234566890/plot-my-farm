# Android Emulator Troubleshooting Guide for Plot My Farm

## 🎯 Quick Fix Steps

### 1. **Ensure Emulator is Running**

```powershell
# Check if emulator is running
C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe devices

# If not running, start it:
C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1
```

### 2. **Run the App**

**Option A: Using Expo (Recommended)**
```bash
npx expo start --clear
# Then press 'a' for Android
```

**Option B: Direct Build**
```bash
npx expo run:android
```

---

## 🔧 Common Issues & Solutions

### Issue 1: App Crashes on Launch

**Symptoms:**
- App opens then immediately closes
- White screen or blank screen
- "Unfortunately, app has stopped" error

**Solutions:**

1. **Clear all caches:**
```bash
# Clear Metro cache
npx expo start --clear

# Clear Android build cache
cd android
.\gradlew.bat clean
cd ..

# Clear npm cache
npm cache clean --force
```

2. **Reinstall the app:**
```bash
# Uninstall from emulator
C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe uninstall com.ajaypamarthi.myapp

# Rebuild and install
npx expo run:android
```

### Issue 2: Emulator Freezes or Hangs

**Solutions:**

1. **Restart the emulator:**
```bash
# Kill emulator
taskkill /F /IM qemu-system-x86_64.exe

# Restart
C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1
```

2. **Cold boot the emulator:**
```bash
C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1 -no-snapshot-load
```

3. **Wipe emulator data (last resort):**
```bash
C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1 -wipe-data
```

### Issue 3: Metro Bundler Issues

**Symptoms:**
- "Unable to resolve module"
- "Metro bundler has encountered an error"
- Stuck at "Building JavaScript bundle"

**Solutions:**

1. **Kill all Node processes:**
```powershell
taskkill /F /IM node.exe
```

2. **Clear Metro cache:**
```bash
npx expo start --clear
```

3. **Delete and reinstall node_modules:**
```bash
rm -rf node_modules
npm install
```

### Issue 4: Gradle Build Failures

**Symptoms:**
- "JAVA_HOME is not set"
- "Gradle build failed"
- "Could not resolve dependencies"

**Solutions:**

1. **Set JAVA_HOME (if needed):**
```powershell
# Find Java path
$javaPath = "C:\Program Files\Android\Android Studio\jbr"
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")
```

2. **Clean Gradle cache:**
```bash
cd android
.\gradlew.bat clean --no-daemon
cd ..
```

3. **Delete Gradle cache:**
```bash
rm -rf android\.gradle
rm -rf android\build
rm -rf android\app\build
```

### Issue 5: ADB Connection Issues

**Symptoms:**
- "device offline"
- "no devices/emulators found"
- "adb server version doesn't match"

**Solutions:**

1. **Restart ADB server:**
```bash
C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe kill-server
C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe start-server
C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
```

2. **Reconnect to emulator:**
```bash
C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe connect emulator-5554
```

---

## ⚙️ Optimal Configuration

### Gradle Settings (android/gradle.properties)

```properties
# Memory settings for better performance
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m

# Enable parallel builds
org.gradle.parallel=true

# Enable caching
org.gradle.caching=true

# Use daemon
org.gradle.daemon=true
```

### Emulator Performance Tips

1. **Use Hardware Acceleration:**
   - Ensure HAXM (Intel) or AEHD is installed
   - Check: Emulator is using GPU acceleration

2. **Allocate More RAM:**
   - Open AVD Manager
   - Edit Medium_Phone_API_36.1
   - Increase RAM to 2048 MB or more

3. **Enable Snapshot:**
   - Saves emulator state for faster boot
   - Already enabled by default

---

## 🚀 Best Practices for Stable Development

1. **Always use `--clear` flag when starting:**
   ```bash
   npx expo start --clear
   ```

2. **Keep emulator running:**
   - Don't close emulator between builds
   - Faster hot reload

3. **Use development build:**
   - Faster than production builds
   - Better error messages

4. **Monitor logs:**
   ```bash
   # View Android logs
   C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe logcat
   
   # Filter for your app
   C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe logcat | findstr "ReactNative"
   ```

5. **Regular cleanup:**
   - Clear caches weekly
   - Restart emulator daily
   - Clean build when switching branches

---

## 📊 System Requirements Check

**Minimum Requirements:**
- RAM: 8 GB (16 GB recommended)
- Disk Space: 10 GB free
- CPU: Intel/AMD with virtualization support
- GPU: Dedicated GPU recommended

**Check Virtualization:**
```powershell
# Check if virtualization is enabled
systeminfo | findstr /C:"Virtualization"
```

---

## 🆘 Emergency Reset

If nothing works, perform a complete reset:

```bash
# 1. Kill all processes
taskkill /F /IM node.exe
taskkill /F /IM qemu-system-x86_64.exe

# 2. Delete all caches
rm -rf node_modules
rm -rf .expo
rm -rf android\.gradle
rm -rf android\build
rm -rf android\app\build

# 3. Reinstall
npm install

# 4. Rebuild
npx expo prebuild --clean
npx expo run:android
```

---

## ✅ Verification Checklist

Before running the app, verify:

- [ ] Emulator is running (`adb devices` shows device)
- [ ] No other Metro bundlers running
- [ ] node_modules installed
- [ ] Android SDK properly configured
- [ ] Enough disk space (>5 GB free)
- [ ] Enough RAM available (>4 GB free)

---

## 📞 Getting Help

If issues persist:

1. Check Metro bundler logs
2. Check Android logcat
3. Check Expo diagnostics: `npx expo-doctor`
4. Check React Native doctor: `npx react-native doctor`


