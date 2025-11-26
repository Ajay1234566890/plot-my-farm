# 🔍 Quick Debug Steps - Unmatched Route Error

## 🎯 Follow These Steps EXACTLY

### Step 1: Stop the App
```bash
# Press Ctrl+C in the terminal where Metro is running
```

### Step 2: Clear Everything
```bash
# Clear Metro cache and restart
npx expo start -c
```

### Step 3: Clear App Data on Phone
**On Android Emulator:**
```bash
# In a new terminal
adb shell pm clear host.exp.exponent
```

**On Physical Android Phone:**
1. Long press the Expo Go app
2. App info → Storage → Clear data
3. Restart Expo Go

**On iOS:**
1. Delete and reinstall Expo Go app

### Step 4: Open the App Fresh
1. Scan the QR code again
2. App should open to splash screen

### Step 5: Watch Terminal Logs CAREFULLY
Keep the terminal visible and watch for these logs:

**Expected Flow:**
```
🚀 [AUTH] Starting app initialization...
✅ [AUTH] App initialization complete, setting isLoading to false
🔄 [INDEX] App initialization complete, routing user...
📊 [INDEX] Auth state: { isSignedIn: false, hasUser: false, userRole: null }
👋 [INDEX] First time user, navigating to splash
```

### Step 6: Complete Registration
1. Click "Get Started" on splash
2. Select "I'm a Farmer"
3. Enter phone: `6303191808`
4. Click "Send OTP"
5. Enter OTP: `123456`
6. Click "Verify OTP"
7. Fill registration form:
   - Full Name: `Test Farmer`
   - Email: `test@example.com`
   - Farm Name: `Green Valley`
   - Farm Size: `5`
8. Click "Send OTP" → Enter `123456` → "Verify"
9. Click "Complete Registration"

### Step 7: Watch for These Logs
```
🔄 [FARMER-REG] Starting registration...
📝 [REGISTER] Attempting registration for phone: 6303191808
🔍 [REGISTER] Checking if profile already exists in table: farmers
🔄 [REGISTER] No existing profile found, creating new user...
🔄 [REGISTER] Creating Supabase auth user...
✅ [REGISTER] Supabase auth user created/retrieved: [user-id]
🔄 [REGISTER] Creating profile in table: farmers
📝 [REGISTER] Profile data to insert: {...}
✅ [REGISTER] Profile created in Supabase: {...}
📝 [REGISTER] Setting user in state: {...}
💾 [REGISTER] Saving user to AsyncStorage...
✅ [REGISTER] User saved to AsyncStorage, verification: SUCCESS
✅ Registration successful for user: 6303191808
✅ [FARMER-REG] Registration completed successfully
🔄 [FARMER-REG] Navigating to farmer-home...
```

### Step 8: Click OK on Success Alert
Watch for:
```
🔄 [FARMER-REG] User pressed OK, navigating now...
```

### Step 9: Check Navigation
Watch for:
```
🔄 [INDEX] App initialization complete, routing user...
📊 [INDEX] Auth state: { 
  isSignedIn: true, 
  hasUser: true, 
  userRole: 'farmer',
  userId: '[user-id]',
  userName: 'Test Farmer'
}
✅ [INDEX] User is signed in with role: farmer
🚜 [INDEX] User is a farmer, navigating to farmer-home
```

---

## ✅ SUCCESS = You See Farmer Dashboard

If you see the farmer home screen with:
- Welcome message
- Map view (or "Map available on mobile" on web)
- Market prices
- Bottom navigation

**🎉 SUCCESS! Error is fixed!**

---

## ❌ FAILURE = You See "Unmatched Route"

### If You See "Unmatched Route", Check:

**1. Did registration complete?**
Look for: `✅ Registration successful for user: 6303191808`
- ✅ YES → Go to check 2
- ❌ NO → Registration failed, check error logs

**2. Was user saved to AsyncStorage?**
Look for: `✅ [REGISTER] User saved to AsyncStorage, verification: SUCCESS`
- ✅ YES → Go to check 3
- ❌ NO → AsyncStorage failed, this is the problem

**3. Did navigation happen?**
Look for: `🔄 [FARMER-REG] User pressed OK, navigating now...`
- ✅ YES → Go to check 4
- ❌ NO → User didn't click OK, or alert didn't show

**4. What did index.tsx see?**
Look for: `📊 [INDEX] Auth state: {...}`
- If `isSignedIn: false` → User state not persisted
- If `hasUser: false` → User object is null
- If `userRole: null` → Role not set

---

## 🔧 Quick Fixes Based on Logs

### If "User saved to AsyncStorage, verification: FAILED"
**Problem:** AsyncStorage not working
**Fix:**
```bash
# Reinstall AsyncStorage
npm install @react-native-async-storage/async-storage
npx expo start -c
```

### If "isSignedIn: false" in index.tsx
**Problem:** User state not persisting between screens
**Fix:** Check if you're clearing AsyncStorage somewhere

### If Navigation doesn't happen
**Problem:** Alert not showing or router not working
**Fix:** Try clicking anywhere on screen after registration

---

## 📸 Share These Logs

If error persists, copy and share:

1. **All logs from registration** (from "Starting registration" to "Registration successful")
2. **All logs from navigation** (from "Navigating to farmer-home" to index.tsx logs)
3. **Screenshot of the error**
4. **What you see in the app** (splash? select-role? unmatched route?)

---

**Debug Date:** 2025-11-26  
**Status:** Ready for Testing

