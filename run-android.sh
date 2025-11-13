#!/bin/bash

# Set environment variables for Android development
export JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
export ANDROID_HOME="C:\Users\nagen\AppData\Local\Android\Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

echo "========================================"
echo "Android Development Environment Setup"
echo "========================================"
echo "JAVA_HOME: $JAVA_HOME"
echo "ANDROID_HOME: $ANDROID_HOME"
echo "========================================"
echo ""

# Check if emulator is running
echo "Checking for running emulators..."
"$ANDROID_HOME/platform-tools/adb.exe" devices
echo ""

# Check if any emulator is running, if not start one
DEVICE_COUNT=$("$ANDROID_HOME/platform-tools/adb.exe" devices | grep -c "device$")
if [ "$DEVICE_COUNT" -eq "0" ]; then
    echo "No emulator running. Starting emulator..."
    "$ANDROID_HOME/emulator/emulator.exe" -avd Medium_Phone_API_36.1 &
    echo "Waiting for emulator to boot..."
    sleep 30
fi

# Run the app
echo "Starting Expo Android build..."
npx expo run:android

