# 🚀 Quick Start - APK Build Guide

## ⚡ 5-Minute Setup

### Step 1: Verify Database (2 minutes)
```bash
npm run verify:database
```

**Expected Output**:
```
✅ Database connection successful
✅ All 12 tables found
✅ All 5 storage buckets found
✅ CRUD operations working
✅ RLS policies configured
```

### Step 2: Test Connectivity (1 minute)
1. Start app: `npm start`
2. Navigate to: `/test-database`
3. Verify all tests pass

### Step 3: Build APK (2 minutes)
```bash
# Option A: Quick preview build
eas build --platform android --type preview

# Option B: Production build
eas build --platform android --type app-bundle
```

---

## 📋 Pre-Build Checklist

- [ ] Database verified: `npm run verify:database`
- [ ] Test component passes: `/test-database`
- [ ] .env file exists with credentials
- [ ] app.json configured
- [ ] eas.json configured (if using EAS)
- [ ] No console errors
- [ ] All navigation flows work

---

## 🎯 Build Options

### Option 1: Local Build (Fastest)
```bash
# Install EAS CLI
npm install -g eas-cli

# Build locally
eas build --platform android --local

# Install on device
adb install -r app-release.apk
```

**Time**: 10-15 minutes
**Best for**: Testing

### Option 2: EAS Build (Recommended)
```bash
# Login to EAS
eas login

# Build in cloud
eas build --platform android --type preview

# Download APK from email
```

**Time**: 5-10 minutes
**Best for**: Production

### Option 3: Expo Go (Fastest Testing)
```bash
# Start development server
npm start

# Scan QR code with Expo Go app
```

**Time**: 1 minute
**Best for**: Quick testing

---

## 📱 Testing on Device

### Android Emulator
```bash
# Start emulator
emulator -avd Pixel_4_API_30

# Run app
npm run android
```

### Physical Device
```bash
# Enable USB debugging
# Connect device

# Install APK
adb install -r app-release.apk

# Or run directly
npm run android
```

---

## ✅ Verification Steps

### After Build
1. [ ] APK file created
2. [ ] File size reasonable (< 100MB)
3. [ ] No build errors
4. [ ] No warnings

### After Installation
1. [ ] App installs successfully
2. [ ] App launches without crashes
3. [ ] Database connection works
4. [ ] All screens load
5. [ ] Navigation works
6. [ ] No console errors

### Feature Testing
1. [ ] Farmer login works
2. [ ] Buyer login works
3. [ ] Can create crops/offers
4. [ ] Can browse offers
5. [ ] Can place orders
6. [ ] Can send messages
7. [ ] Can upload images
8. [ ] Notifications work

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
eas build --platform android --type preview
```

### App Crashes on Startup
```bash
# Check logs
npm start

# Verify .env file
cat .env

# Verify database
npm run verify:database
```

### Database Connection Issues
1. Check internet connection
2. Verify Supabase project is active
3. Check API keys in .env
4. Run: `npm run verify:database`

### APK Installation Fails
```bash
# Uninstall previous version
adb uninstall com.plotmyfarm.app

# Install new APK
adb install -r app-release.apk
```

---

## 📊 Build Configuration

### app.json
```json
{
  "expo": {
    "name": "Plot My Farm",
    "slug": "plot-my-farm",
    "version": "1.0.0",
    "android": {
      "package": "com.plotmyfarm.app"
    }
  }
}
```

### eas.json
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 🎯 Next Steps

### Immediate
1. Run: `npm run verify:database`
2. Test: `/test-database`
3. Build: `eas build --platform android --type preview`

### After Build
1. Download APK
2. Install on device
3. Test all features
4. Verify database connectivity

### Before Play Store
1. Create app listing
2. Add screenshots
3. Write description
4. Set pricing
5. Submit for review

---

## 📞 Quick Commands

```bash
# Verify database
npm run verify:database

# Start development
npm start

# Build APK (preview)
eas build --platform android --type preview

# Build APK (production)
eas build --platform android --type app-bundle

# Install on device
adb install -r app-release.apk

# View logs
npm start

# Clear cache
npm cache clean --force
```

---

## ✅ Status

- [x] Database verified
- [x] Environment configured
- [x] Navigation tested
- [x] Connectivity confirmed
- [x] Ready for build

---

## 🎉 You're Ready!

Everything is set up and ready for APK build. Follow the steps above and you'll have a working APK in minutes.

**Start with**: `npm run verify:database`

---

**Last Updated**: 2025-10-22
**Status**: READY FOR BUILD

