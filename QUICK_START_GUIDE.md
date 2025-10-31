# 🚀 Quick Start Guide - New Navigation Flow

## What Was Fixed

✅ **ActivityIndicator Error** - Fixed import in farmer-registration.tsx  
✅ **Navigation Flow** - Restructured to: Splash → Role → Language → Login → Registration  
✅ **New Screens** - Created splash.tsx and select-language.tsx  
✅ **State Management** - Added language and splash tracking to auth context

---

## New User Journey

### First Time User
```
1. App Opens
   ↓
2. Splash Screen (Welcome)
   ↓
3. Select Role (Farmer/Buyer)
   ↓
4. Select Language (English/Hindi)
   ↓
5. Login (Phone + OTP)
   ↓
6. Registration (Role-specific)
   ↓
7. Home Screen (Dashboard)
```

### Returning User
```
1. App Opens
   ↓
2. Home Screen (Dashboard)
   (Splash skipped, already seen)
```

---

## How to Test

### Step 1: Clear Cache
```bash
npm start -- --clear
```

### Step 2: Wait for App to Load
- Wait 2-3 minutes for bundler
- App should reload on device/emulator

### Step 3: Test Complete Flow
1. **Splash Screen**
   - [ ] See welcome screen with features
   - [ ] Click "Get Started"

2. **Role Selection**
   - [ ] See Farmer and Buyer options
   - [ ] Select Farmer
   - [ ] Click Continue

3. **Language Selection**
   - [ ] See English and Hindi options
   - [ ] Select English
   - [ ] Click Continue

4. **Login**
   - [ ] Enter phone number (10 digits)
   - [ ] Click "Send OTP"
   - [ ] Enter OTP (any 6 digits for testing)
   - [ ] Click "Verify OTP"

5. **Farmer Registration**
   - [ ] Fill in all fields
   - [ ] Click "Complete Registration"

6. **Home Screen**
   - [ ] See Farmer Dashboard
   - [ ] See bottom navigation
   - [ ] Can navigate to other screens

### Step 4: Test Logout
1. Go to Profile screen
2. Click Logout
3. Confirm logout
4. Should return to splash screen (or select-role if splash already seen)

### Step 5: Test Returning User
1. Close app
2. Reopen app
3. Should go directly to home screen (no splash)

---

## Files Changed

| File | Changes |
|------|---------|
| `contexts/auth-context.tsx` | Added language and splash tracking |
| `app/farmer-registration.tsx` | Fixed ActivityIndicator import |
| `app/select-role.tsx` | Navigate to language selection |
| `app/login.tsx` | Navigate to registration after login |
| `app/index.tsx` | Check splash and language state |
| `app/_layout.tsx` | Updated navigation flow |
| `app/splash.tsx` | NEW - Welcome screen |
| `app/select-language.tsx` | NEW - Language selection |

---

## New Navigation Flow in Code

### Before
```
index → login → select-role → registration
```

### After
```
index → splash → select-role → select-language → login → registration
```

---

## Key Features

### Splash Screen
- Beautiful welcome screen
- Feature highlights
- "Get Started" button
- Only shows on first launch

### Language Selection
- English and Hindi options
- Visual selection with flags
- Saved to AsyncStorage
- Can be changed in settings later

### Improved Auth Flow
- Clear step-by-step process
- Better user onboarding
- Language preference stored
- Splash screen tracked

---

## Troubleshooting

### Issue: Still Seeing Old Flow
**Solution**: 
```bash
npm start -- --clear
```

### Issue: Splash Screen Not Showing
**Solution**: 
- Check that `hasSeenSplash` is false in AsyncStorage
- Clear app data and try again

### Issue: Language Not Saving
**Solution**:
- Check AsyncStorage is working
- Check browser console for errors

### Issue: ActivityIndicator Error Still Showing
**Solution**:
- Clear cache: `npm start -- --clear`
- Restart dev server

---

## Testing Scenarios

### Scenario 1: First Time User
1. Clear app data
2. Open app
3. Should see splash screen
4. Complete full flow
5. Should reach home screen

### Scenario 2: Returning User
1. Close app
2. Reopen app
3. Should skip splash
4. Should go directly to home

### Scenario 3: Logout and Relogin
1. Logout from profile
2. Should see splash screen
3. Complete flow again
4. Should reach home screen

### Scenario 4: Language Change
1. Complete registration
2. Go to settings
3. Change language
4. Should update in auth context

---

## Expected Behavior

### Loading State
- Show loading spinner
- Check auth state
- Check splash state

### Unauthenticated User
- Show splash (if not seen)
- Show role selection
- Show language selection
- Show login
- Show registration

### Authenticated User
- Skip all onboarding
- Go directly to home screen

### After Logout
- Clear user data
- Show splash screen (or role selection)
- Allow new login

---

## Next Steps

1. **Clear cache**: `npm start -- --clear`
2. **Test the flow**: Follow "How to Test" section
3. **Report issues**: Document any problems
4. **Proceed to Phase 5**: Implement remaining screens

---

## Summary

✅ **ActivityIndicator Error Fixed**  
✅ **Navigation Flow Restructured**  
✅ **Splash Screen Created**  
✅ **Language Selection Created**  
✅ **Auth Context Updated**  
✅ **Ready for Testing**

---

**Status**: ✅ COMPLETE  
**Next Action**: Run `npm start -- --clear` and test the app  
**Expected Result**: See splash screen on first launch

