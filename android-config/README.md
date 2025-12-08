# Android Configuration Files for MapLibre

This directory contains Android-specific configuration files that will be copied to the appropriate locations during the Expo prebuild process.

## Files

### 1. AndroidManifest.xml
- **Purpose:** Defines app permissions and configuration
- **Copied to:** `android/app/src/main/AndroidManifest.xml`
- **Key features:**
  - Location permissions (FINE, COARSE)
  - Network permissions (INTERNET, NETWORK_STATE, WIFI_STATE)
  - Camera and storage permissions
  - Network security config reference

### 2. network_security_config.xml
- **Purpose:** Allows cleartext traffic for MapTiler domains
- **Copied to:** `android/app/src/main/res/xml/network_security_config.xml`
- **Key features:**
  - Enables HTTP/HTTPS for MapTiler API
  - Required for tiles, fonts, and glyphs to load
  - Covers all MapTiler subdomains

### 3. proguard-rules.pro
- **Purpose:** ProGuard rules for release builds
- **Copied to:** `android/app/proguard-rules.pro`
- **Key features:**
  - Keeps MapLibre classes from being obfuscated
  - Preserves necessary code for production builds

## How to Apply

These files are automatically copied during prebuild:

```bash
npx expo prebuild --clean
```

Or manually copy them to the android directory if needed.

## Important Notes

- The `network_security_config.xml` is **critical** for MapLibre to work
- Without it, map tiles and glyphs will fail to load
- The AndroidManifest must reference it: `android:networkSecurityConfig="@xml/network_security_config"`
- All MapTiler domains must be whitelisted for cleartext traffic

## Verification

After prebuild, verify these files exist:
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/res/xml/network_security_config.xml`
- `android/app/proguard-rules.pro`
