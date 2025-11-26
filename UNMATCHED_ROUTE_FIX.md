# 🔧 Unmatched Route Error Fix

## ❌ Error You're Seeing

**Screen Shows:**
```
Unmatched Route
Page could not be found.
exp://192.168.1.34:8082/-/
```

**What This Means:**
- The app is trying to navigate to a route that doesn't exist
- OR the navigation is happening before the route is registered
- OR there's a timing issue with state updates

---

## 🔍 Root Causes

### Possible Cause 1: Navigation Timing Issue
- Registration completes
- App tries to navigate to `/farmer-home`
- But user state hasn't fully updated yet
- Index.tsx redirects back to root
- Root route doesn't exist → "Unmatched Route"

### Possible Cause 2: State Not Persisting
- User registers successfully
- User state is set in memory
- But AsyncStorage hasn't saved it yet
- App refreshes or navigates
- User state is lost → redirects to wrong route

### Possible Cause 3: Router Replace Issue
- Using `router.replace()` too quickly
- Navigation stack gets confused
- Route doesn't match any registered screen

---

## ✅ Fixes Applied

### Fix 1: Added Delay in Registration Navigation
**File:** `app/farmer-registration.tsx`

```typescript
// Wait for state to update before navigating
await new Promise(resolve => setTimeout(resolve, 500));

// Show alert with callback navigation
Alert.alert(t('common.success'), t('success.registrationSuccess'), [
  {
    text: 'OK',
    onPress: () => {
      console.log('🔄 [FARMER-REG] User pressed OK, navigating now...');
      router.replace('/farmer-home');
    }
  }
]);
```

**Why:** Ensures user state is fully saved before navigation

### Fix 2: Improved Index.tsx Navigation Logic
**File:** `app/index.tsx`

```typescript
// Add delay to ensure state is fully updated
const navigationTimeout = setTimeout(() => {
  if (isSignedIn && user && user.role) {
    // Navigate based on role
    if (user.role === 'farmer') {
      router.replace('/farmer-home');
    } else if (user.role === 'buyer') {
      router.replace('/buyer-home');
    }
  } else {
    // Navigate to onboarding
    router.replace('/select-role');
  }
}, 100);
```

**Why:** Prevents premature navigation before state is ready

### Fix 3: Better Logging
Added comprehensive console logs to track:
- When registration starts
- When registration completes
- When navigation happens
- What the user state is at each step

---

## 🧪 How to Test

### Step 1: Clear App Data
```bash
# On Android emulator
adb shell pm clear host.exp.exponent

# OR restart the app with cache cleared
npx expo start -c
```

### Step 2: Try Registration Again
1. Open app
2. Select "Farmer" role
3. Enter phone: `6303191808`
4. Enter OTP: `123456`
5. Fill registration form
6. Click "Complete Registration"

### Step 3: Watch Terminal Logs
Look for this sequence:
```
🔄 [FARMER-REG] Starting registration...
📝 [REGISTER] Attempting registration for phone: 6303191808
✅ [REGISTER] Profile created in Supabase
✅ Registration successful for user: 6303191808
✅ [FARMER-REG] Registration completed successfully
🔄 [FARMER-REG] Navigating to farmer-home...
🔄 [FARMER-REG] User pressed OK, navigating now...
🔄 [INDEX] App initialization complete, routing user...
✅ [INDEX] User is signed in with role: farmer
🚜 [INDEX] User is a farmer, navigating to farmer-home
```

### Step 4: Expected Result
- ✅ Registration success alert shows
- ✅ Click "OK" button
- ✅ App navigates to farmer-home
- ✅ Farmer dashboard loads
- ✅ No "Unmatched Route" error

---

## 🐛 If Error Still Occurs

### Check 1: Is User State Set?
Look for this in logs:
```
✅ [REGISTER] Profile created in Supabase
✅ Registration successful for user: 6303191808
```

If you see this, user state IS set.

### Check 2: Is Navigation Happening?
Look for this in logs:
```
🔄 [FARMER-REG] Navigating to farmer-home...
```

If you DON'T see this, navigation isn't happening.

### Check 3: Is Index.tsx Redirecting?
Look for this in logs:
```
🔄 [INDEX] App initialization complete, routing user...
📊 [INDEX] Auth state: { isSignedIn: true, hasUser: true, userRole: 'farmer' }
```

If `isSignedIn: false` or `hasUser: false`, state wasn't saved.

---

## 🔧 Additional Fixes to Try

### If State Not Persisting:
```typescript
// In auth-context.tsx register function
// Make sure AsyncStorage.setItem completes
await AsyncStorage.setItem('user', JSON.stringify(newUser));
console.log('✅ [REGISTER] User saved to AsyncStorage');

// Verify it was saved
const verify = await AsyncStorage.getItem('user');
console.log('🔍 [REGISTER] Verified saved user:', verify);
```

### If Navigation Not Working:
```typescript
// Try using push instead of replace
router.push('/farmer-home');

// OR try with a longer delay
await new Promise(resolve => setTimeout(resolve, 1000));
router.replace('/farmer-home');
```

### If Index.tsx Keeps Redirecting:
```typescript
// Add a flag to prevent re-navigation
const [hasNavigated, setHasNavigated] = useState(false);

if (!hasNavigated && !isLoading) {
  setHasNavigated(true);
  // Navigate...
}
```

---

## 📊 Success Criteria

✅ Registration completes without errors
✅ Success alert shows
✅ After clicking OK, navigates to farmer-home
✅ Farmer dashboard loads
✅ No "Unmatched Route" error
✅ Logs show complete flow from registration to home

---

**Fix Date:** 2025-11-26  
**Status:** Testing Required  
**Files Modified:** 
- `app/farmer-registration.tsx`
- `app/index.tsx`

