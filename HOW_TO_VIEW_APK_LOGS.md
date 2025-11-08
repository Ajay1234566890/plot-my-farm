# How to View Logs from Installed APK

When you install and run the release APK on your Android device, you can view real-time logs using **Android Debug Bridge (ADB)**. This is essential for debugging issues that only occur in the release build.

---

## Prerequisites

1. **Enable Developer Options** on your Android device:
   - Go to **Settings → About Phone**
   - Tap **Build Number** 7 times
   - Developer Options will be enabled

2. **Enable USB Debugging**:
   - Go to **Settings → Developer Options**
   - Enable **USB Debugging**

3. **Install ADB** on your computer (if not already installed):
   - ADB comes with Android Studio
   - Or download standalone: https://developer.android.com/tools/releases/platform-tools

---

## Method 1: View Logs via USB Cable (Recommended)

### Step 1: Connect Your Device
```powershell
# Connect your Android device via USB cable
# Accept the "Allow USB Debugging" prompt on your device
```

### Step 2: Verify Connection
```powershell
adb devices
```
You should see your device listed:
```
List of devices attached
ABC123XYZ    device
```

### Step 3: View Real-Time Logs
```powershell
# View all logs from your app
adb logcat | Select-String "com.ajaypamarthi.myapp"

# Or filter by specific tags
adb logcat | Select-String "ReactNativeJS|MapLibre|MLRNCamera"

# Clear old logs and start fresh
adb logcat -c
adb logcat
```

### Step 4: Filter Logs by Priority
```powershell
# Show only errors and warnings
adb logcat *:E *:W

# Show errors, warnings, and info
adb logcat *:E *:W *:I
```

### Step 5: Save Logs to File
```powershell
# Save logs to a file for later analysis
adb logcat > app_logs.txt

# Save logs for 30 seconds then stop
adb logcat -d > app_logs.txt
```

---

## Method 2: View Logs Wirelessly (No USB Cable)

### Step 1: Connect via USB First
```powershell
adb devices
```

### Step 2: Enable Wireless Debugging
```powershell
# Get your device's IP address (Settings → About Phone → Status → IP Address)
# Let's say it's 192.168.1.100

adb tcpip 5555
adb connect 192.168.1.100:5555
```

### Step 3: Disconnect USB and View Logs
```powershell
# Now you can disconnect the USB cable
adb logcat
```

---

## Method 3: Use Android Studio Logcat (Easiest)

1. Open **Android Studio**
2. Go to **View → Tool Windows → Logcat**
3. Connect your device via USB
4. Select your device from the dropdown
5. Filter by package name: `com.ajaypamarthi.myapp`
6. Click the app icon to see only your app's logs

---

## Useful ADB Logcat Commands

```powershell
# Clear all logs
adb logcat -c

# View logs with timestamps
adb logcat -v time

# View logs with thread info
adb logcat -v threadtime

# Filter by tag (e.g., ReactNativeJS)
adb logcat ReactNativeJS:V *:S

# Filter by multiple tags
adb logcat ReactNativeJS:V MapLibre:V MLRNCamera:V *:S

# Show only errors
adb logcat *:E

# Show errors and warnings
adb logcat *:E *:W

# Search for specific text
adb logcat | Select-String "MapLibre"
adb logcat | Select-String "error|crash" -CaseSensitive:$false

# Save last 1000 lines to file
adb logcat -d -t 1000 > last_1000_logs.txt
```

---

## Common Log Tags to Watch

| Tag | Description |
|-----|-------------|
| `ReactNativeJS` | JavaScript console logs (console.log, console.error) |
| `ReactNative` | React Native core logs |
| `MapLibre` | MapLibre library logs |
| `MLRNCamera` | MapLibre Camera component logs |
| `AndroidRuntime` | App crashes and exceptions |
| `System.err` | System errors |

---

## Debugging MapLibre Issues

### Check if MapLibre Native Module is Registered
```powershell
adb logcat | Select-String "MapLibre|MLRN"
```

Look for:
- ✅ `MapLibre native module registered`
- ❌ `Native module of @maplibre/maplibre-react-native library was not registered properly`

### Check for View Config Errors
```powershell
adb logcat | Select-String "View config not found|MLRNCamera"
```

### Check for Crashes
```powershell
adb logcat | Select-String "FATAL|AndroidRuntime"
```

---

## APK Location

Your release APK is located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

**Current APK Size**: 63.51 MB  
**Last Built**: Check the file's LastWriteTime

---

## Quick Start Guide

1. **Install the APK** on your device
2. **Connect via USB** and enable USB debugging
3. **Open PowerShell** in your project directory
4. **Run**: `adb logcat -c` (clear old logs)
5. **Open the app** on your device
6. **Run**: `adb logcat | Select-String "ReactNativeJS|MapLibre"`
7. **Navigate to the home page** and watch for errors

---

## Troubleshooting

### "adb: command not found"
- Add Android SDK platform-tools to your PATH
- Or use full path: `C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe`

### "no devices/emulators found"
- Check USB cable connection
- Enable USB Debugging on device
- Accept "Allow USB Debugging" prompt
- Try different USB port
- Run: `adb kill-server` then `adb start-server`

### "device unauthorized"
- Disconnect and reconnect USB
- Accept the authorization prompt on your device
- Run: `adb devices` again

---

## Next Steps

After viewing the logs, look for:
1. **MapLibre registration errors**
2. **View config errors** (MLRNCamera, MLRNMapView)
3. **JavaScript errors** in ReactNativeJS tag
4. **Native crashes** in AndroidRuntime tag

Share the relevant log output so I can help fix the issues!

