# 🔧 Clear AsyncStorage for Testing - Complete Guide

## 🎯 Problem Identified

The app is skipping the onboarding flow because it's loading persisted authentication data from AsyncStorage. This is **correct behavior for production**, but for testing, you need to clear this data to test the complete onboarding flow.

---

## 📊 What's Being Persisted

The auth context stores the following data in AsyncStorage:

```typescript
// From contexts/auth-context.tsx (lines 49-65)
const storedUser = await AsyncStorage.getItem('user');           // User object with role
const storedLanguage = await AsyncStorage.getItem('language');   // Selected language
const storedSplash = await AsyncStorage.getItem('hasSeenSplash'); // Splash screen flag
const storedRole = await AsyncStorage.getItem('selectedRole');   // Selected role
```

When the app loads, it restores this data, which makes the app think you're already signed in.

---

## ✅ Solution 1: Clear AsyncStorage via Browser DevTools (EASIEST)

### Step 1: Open DevTools
```
Press F12 in browser
```

### Step 2: Go to Application Tab
```
DevTools → Application tab
```

### Step 3: Clear Storage
```
Application → Storage → Local Storage
Right-click → Clear All
```

Or:

```
Application → Storage → Clear site data
```

### Step 4: Refresh Page
```
Press Ctrl+R or Cmd+R
```

### Step 5: Test Onboarding Flow
- You should now see the splash screen
- Complete the onboarding flow

---

## ✅ Solution 2: Add Debug Reset Button to App

I can add a debug reset button to the app that clears AsyncStorage. This is useful for testing.

### Option A: Add Reset Button to Splash Screen
```typescript
// In app/splash.tsx, add a debug button:
<TouchableOpacity onPress={async () => {
  await AsyncStorage.clear();
  router.replace('/');
}}>
  <Text>DEBUG: Reset App</Text>
</TouchableOpacity>
```

### Option B: Add Reset Button to Home Screen
```typescript
// In app/farmer-home.tsx or app/buyer-home.tsx, add:
<TouchableOpacity onPress={async () => {
  await AsyncStorage.clear();
  router.replace('/');
}}>
  <Text>DEBUG: Reset App</Text>
</TouchableOpacity>
```

---

## ✅ Solution 3: Clear AsyncStorage via Console

### Step 1: Open DevTools Console
```
Press F12 → Console tab
```

### Step 2: Run JavaScript Command
```javascript
// Clear all AsyncStorage data
localStorage.clear();
```

### Step 3: Refresh Page
```
Press Ctrl+R
```

---

## ✅ Solution 4: Programmatic Reset (For Testing)

Add this to your app/index.tsx for testing:

```typescript
// Add a query parameter to reset the app
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('reset') === 'true') {
    AsyncStorage.clear().then(() => {
      window.location.href = window.location.pathname;
    });
  }
}, []);
```

Then access: `http://localhost:8081?reset=true`

---

## 📝 What Gets Cleared

When you clear AsyncStorage, the following data is removed:

| Data | Purpose | Effect |
|------|---------|--------|
| user | Logged-in user object | User becomes unsigned in |
| language | Selected language | Language resets to null |
| hasSeenSplash | Splash screen flag | Splash screen shows again |
| selectedRole | Selected role | Role resets to null |

---

## 🎯 After Clearing AsyncStorage

### Expected Flow:
1. App loads
2. `isLoading` is true → Shows loading spinner
3. `isLoading` becomes false
4. `isSignedIn` is false (no user in AsyncStorage)
5. `hasSeenSplash` is false (not set in AsyncStorage)
6. Navigate to `/splash` ✅
7. User sees splash screen

### Then:
1. Click "Get Started"
2. Navigate to `/select-role` ✅
3. Select role (farmer or buyer)
4. Navigate to `/login` ✅
5. Enter phone and OTP
6. Navigate to registration screen ✅
7. Complete registration
8. Navigate to home screen ✅

---

## 🚀 Quick Steps to Test Onboarding

### Step 1: Clear AsyncStorage
```
F12 → Application → Storage → Clear site data
```

### Step 2: Refresh Page
```
Ctrl+R
```

### Step 3: Test Complete Flow
1. See splash screen ✅
2. Click "Get Started"
3. Select "Buyer" role
4. Select language
5. Click "Continue"
6. Enter phone: 9876543210
7. Click "Send OTP"
8. Enter OTP: 123456
9. Click "Verify OTP"
10. Complete buyer setup
11. See buyer-home ✅

---

## 📊 AsyncStorage Data Structure

When you're signed in, AsyncStorage contains:

```json
{
  "user": {
    "id": "1",
    "name": "User",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "farmer",
    "profileImage": undefined
  },
  "language": "en",
  "hasSeenSplash": true,
  "selectedRole": "farmer"
}
```

After clearing, all these keys are removed.

---

## 🔍 How to Check AsyncStorage Contents

### In Browser DevTools:
```
F12 → Application → Local Storage → http://localhost:8081
```

You'll see all stored key-value pairs.

### In Console:
```javascript
// Get all AsyncStorage data
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

---

## ✅ Verification Steps

### After Clearing AsyncStorage:

1. **Check DevTools**:
   - F12 → Application → Local Storage
   - Should be empty (or only have non-app data)

2. **Check Console**:
   - F12 → Console
   - Run: `localStorage.getItem('user')`
   - Should return: `null`

3. **Check App Behavior**:
   - Should show splash screen
   - Should show role selection
   - Should show login screen

---

## 🛠️ Troubleshooting

### Still Seeing Farmer Home?

1. **Make sure you cleared the right storage**:
   - F12 → Application → Local Storage (not Session Storage)
   - Make sure it's for `http://localhost:8081`

2. **Hard refresh after clearing**:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Check console for errors**:
   - F12 → Console
   - Look for any error messages

### AsyncStorage Not Clearing?

1. **Try clearing browser cache**:
   ```bash
   rm -r node_modules/.cache
   rm -r .expo
   npm run web
   ```

2. **Try incognito/private mode**:
   - Open browser in incognito mode
   - Fresh AsyncStorage (no persisted data)

---

## 📝 Summary

| Method | Difficulty | Speed | Recommended |
|--------|-----------|-------|-------------|
| DevTools Clear | Easy | Fast | ✅ YES |
| Console Command | Easy | Fast | ✅ YES |
| Query Parameter | Medium | Fast | ⚠️ For testing |
| Debug Button | Medium | Fast | ⚠️ For testing |

---

## 🎯 Recommended Workflow

### For Each Test Session:

1. **Clear AsyncStorage**:
   ```
   F12 → Application → Clear site data
   ```

2. **Refresh Page**:
   ```
   Ctrl+R
   ```

3. **Test Onboarding Flow**:
   - See splash screen
   - Complete role selection
   - Complete login
   - Complete registration
   - See home screen

4. **Repeat for Different Roles**:
   - Clear AsyncStorage again
   - Test farmer flow
   - Clear AsyncStorage again
   - Test buyer flow

---

**Status**: ✅ SOLUTION PROVIDED  
**Date**: 2025-10-18  
**Next**: Clear AsyncStorage and test! 🚀

