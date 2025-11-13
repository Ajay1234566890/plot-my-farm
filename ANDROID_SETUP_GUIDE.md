# Android Setup and Run Guide

## Prerequisites

✅ **Already Installed:**
- Node.js and npm
- Android Studio (at `C:\Program Files\Android\Android Studio`)
- Android SDK (at `C:\Users\nagen\AppData\Local\Android\Sdk`)
- Android Emulator: `Medium_Phone_API_36.1`
- Java JDK 21 (bundled with Android Studio)

## Environment Variables

You need to set these environment variables for Android development:

### Option 1: Set Permanently (Recommended)

1. Open **System Properties** → **Environment Variables**
2. Add these **User Variables**:
   - `JAVA_HOME` = `C:\Program Files\Android\Android Studio\jbr`
   - `ANDROID_HOME` = `C:\Users\nagen\AppData\Local\Android\Sdk`
3. Edit the `Path` variable and add:
   - `%JAVA_HOME%\bin`
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
4. **Restart your terminal** for changes to take effect

### Option 2: Use the Provided Script

Run the provided bash script which sets variables temporarily:
```bash
bash run-android.sh
```

## Running the App

### Method 1: Using the Script (Easiest)

```bash
bash run-android.sh
```

This script will:
1. Set environment variables
2. Check for running emulators
3. Start an emulator if needed
4. Build and run the app

### Method 2: Manual Steps

1. **Start the Android Emulator:**
   ```bash
   "C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Medium_Phone_API_36.1
   ```

2. **Wait for emulator to boot** (30-60 seconds)

3. **In a new terminal, set environment variables and run:**
   ```bash
   export JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
   export ANDROID_HOME="C:\Users\nagen\AppData\Local\Android\Sdk"
   export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
   npx expo run:android
   ```

## First Build

⏱️ **The first build will take 5-10 minutes** because it needs to:
- Download Gradle dependencies
- Download Android SDK components
- Compile the app
- Install on emulator

Subsequent builds will be much faster (1-2 minutes).

## Troubleshooting

### Emulator Not Detected
```bash
"C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
```
Should show `emulator-5554    device`

### Java Not Found
Make sure `JAVA_HOME` is set correctly:
```bash
echo $JAVA_HOME
"$JAVA_HOME/bin/java.exe" -version
```

### Build Fails
1. Stop any running builds (Ctrl+C)
2. Clean the build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```
3. Try again

### Emulator is Slow
- Make sure you have at least 8GB RAM
- Enable hardware acceleration in BIOS (Intel VT-x or AMD-V)
- Use a lighter emulator (API 30 or lower)

## Quick Commands

**Check emulator status:**
```bash
"C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
```

**List available emulators:**
```bash
"C:\Users\nagen\AppData\Local\Android\Sdk\emulator\emulator.exe" -list-avds
```

**Kill all emulators:**
```bash
"C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe" kill-server
```

**Restart ADB:**
```bash
"C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe" kill-server
"C:\Users\nagen\AppData\Local\Android\Sdk\platform-tools\adb.exe" start-server
```

## Next Steps

Once the app is running:
1. The app will automatically install on the emulator
2. Metro bundler will start automatically
3. The app will launch on the emulator
4. You can make changes to the code and they will hot-reload

## Development Workflow

1. Keep the emulator running
2. Make code changes
3. Save files - changes will hot-reload automatically
4. For major changes, press `r` in the Metro terminal to reload
5. Press `m` to open the developer menu in the app

