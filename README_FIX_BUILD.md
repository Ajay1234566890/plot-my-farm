# 🚀 Android Build Fix & Release Guide

We have created a comprehensive automated script to resolve your build issues.

## 🛠️ Automated Fix Script

We created `fix-and-build.bat` which performs the following actions:
1. **Checks Node Version**: Attempts to switch to Node 20 using NVM (if available).
2. **Verifies Assets**: Scans `assets/` for corrupted PNG files that cause AAPT errors.
3. **Deep Clean**: Deletes `android`, `node_modules`, and `package-lock.json`.
4. **Fresh Install**: Reinstalls dependencies using `npm install --legacy-peer-deps`.
5. **Expo Prebuild**: Regenerates the Android project from scratch.
6. **Config Patching**: 
   - Copies the correct `network_security_config.xml`.
   - Patches `AndroidManifest.xml` to use the security config.
7. **Gradle Build**: Runs `gradlew clean` and `gradlew assembleRelease`.

## 🏃‍♂️ How to Run

1. Open your terminal (PowerShell or Command Prompt).
2. Navigate to your project root:
   ```powershell
   cd "c:\pmf safe folder\plot-my-farm"
   ```
3. Run the script:
   ```powershell
   .\fix-and-build.bat
   ```

## ⚠️ Important Notes

- **Node Version**: If you don't have NVM, please manually ensure you are using Node 18 or 20. Node 24 is known to cause issues with current React Native versions.
- **Corrupted Assets**: If the script stops at step 2, it means you have bad image files. Delete or replace the files listed in the error message.
- **First Build Time**: The first build after a clean install can take 10-15 minutes. Please be patient.

## 📱 After Build

The APK will be located at:
`android\app\build\outputs\apk\release\app-release.apk`

Transfer this file to your Android device and install it.
