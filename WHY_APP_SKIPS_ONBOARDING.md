# 📚 Why the App Skips Onboarding - Complete Explanation

## 🎯 The Issue

When you run `npm run web`, the app loads and immediately navigates to farmer-home, bypassing the onboarding flow (splash → role selection → login → registration).

**Console Output**:
```
DEBUG: Navigating to farmer-home
```

---

## 🔍 Root Cause Analysis

### How the App Initializes

**File**: `contexts/auth-context.tsx` (lines 45-74)

```typescript
useEffect(() => {
  const bootstrapAsync = async () => {
    try {
      // 1. Load persisted user from AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      
      // 2. Load persisted language
      const storedLanguage = await AsyncStorage.getItem('language');
      
      // 3. Load splash screen flag
      const storedSplash = await AsyncStorage.getItem('hasSeenSplash');
      
      // 4. Load selected role
      const storedRole = await AsyncStorage.getItem('selectedRole');

      // 5. Restore user if it exists
      if (storedUser) {
        setUser(JSON.parse(storedUser));  // ← User is now signed in!
      }
      
      // 6. Restore other data
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      }
      if (storedSplash) {
        setHasSeenSplash(JSON.parse(storedSplash));
      }
      if (storedRole) {
        setSelectedRole(storedRole);
      }
    } finally {
      setIsLoading(false);  // ← Loading complete
    }
  };

  bootstrapAsync();
}, []);
```

### What Happens Next

**File**: `app/index.tsx` (lines 10-30)

```typescript
const { isSignedIn, isLoading, hasSeenSplash, user } = useAuth();

useEffect(() => {
  if (!isLoading) {
    if (isSignedIn && user) {
      // ← If user exists, navigate to home screen
      if (user.role === 'farmer') {
        console.log('DEBUG: Navigating to farmer-home');
        router.replace('/farmer-home');  // ← THIS IS WHAT HAPPENS
      } else if (user.role === 'buyer') {
        router.replace('/buyer-home');
      }
    } else if (!hasSeenSplash) {
      router.replace('/splash');
    } else {
      router.replace('/select-role');
    }
  }
}, [isLoading, isSignedIn, hasSeenSplash, user, router]);
```

---

## 📊 The Flow

### When App Loads:

```
1. App starts
   ↓
2. Auth context initializes
   ↓
3. Load data from AsyncStorage
   ↓
4. storedUser exists? → YES
   ↓
5. setUser(storedUser)
   ↓
6. isSignedIn becomes true
   ↓
7. app/index.tsx checks: isSignedIn && user?
   ↓
8. YES → Check user.role
   ↓
9. user.role === 'farmer'?
   ↓
10. YES → Navigate to /farmer-home ✅
```

---

## 💾 What's Stored in AsyncStorage

When you complete the onboarding flow and sign in, the app stores:

```json
{
  "user": {
    "id": "1",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "farmer",
    "language": "en",
    "profileImage": null,
    "farmName": "My Farm",
    "farmSize": "10 acres",
    "location": "City, State"
  },
  "language": "en",
  "hasSeenSplash": true,
  "selectedRole": "farmer"
}
```

When the app loads next time, it restores this data, making you "already signed in".

---

## ✅ Why This Is Correct Behavior

### For Production:
- ✅ Users don't need to log in every time
- ✅ Session persists across app restarts
- ✅ Better user experience
- ✅ Faster app startup

### For Testing:
- ❌ Can't test the onboarding flow
- ❌ Can't test role selection
- ❌ Can't test login screen
- ❌ Can't test registration

---

## 🔧 The Solution

### Clear AsyncStorage to Reset the App

When you clear AsyncStorage:

```
Before:
{
  "user": { ... },
  "language": "en",
  "hasSeenSplash": true,
  "selectedRole": "farmer"
}

After:
{
  // Empty!
}
```

### What Happens After Clearing:

```
1. App loads
   ↓
2. Auth context initializes
   ↓
3. Load data from AsyncStorage
   ↓
4. storedUser exists? → NO
   ↓
5. user remains null
   ↓
6. isSignedIn becomes false
   ↓
7. app/index.tsx checks: isSignedIn && user?
   ↓
8. NO → Check hasSeenSplash
   ↓
9. hasSeenSplash === false?
   ↓
10. YES → Navigate to /splash ✅
```

---

## 📝 Step-by-Step: What Happens During Onboarding

### Step 1: Splash Screen
```
- App loads
- isSignedIn = false
- hasSeenSplash = false
- Navigate to /splash
- User sees splash screen
```

### Step 2: Role Selection
```
- User clicks "Get Started"
- selectRole('buyer') is called
- selectedRole = 'buyer' (stored in AsyncStorage)
- Navigate to /select-role
- User selects role
- Navigate to /login
```

### Step 3: Login
```
- User enters phone: 9876543210
- User enters OTP: 123456
- login() is called
- User object is created with role: 'buyer'
- user is stored in AsyncStorage
- isSignedIn = true
- Navigate to /buyer-profile-setup
```

### Step 4: Registration
```
- User completes buyer profile
- User object is updated
- Navigate to /buyer-home
- User sees buyer home screen
```

### Step 5: Next App Load
```
- App loads
- Auth context loads user from AsyncStorage
- isSignedIn = true
- user.role = 'buyer'
- Navigate directly to /buyer-home
- User sees buyer home screen (no onboarding)
```

---

## 🎯 Key Takeaway

| Scenario | Behavior | Reason |
|----------|----------|--------|
| First app load (no AsyncStorage) | Show splash screen | No user data stored |
| After onboarding (AsyncStorage has user) | Show home screen | User data restored |
| After clearing AsyncStorage | Show splash screen | No user data to restore |

---

## 🚀 How to Test Onboarding

### For Each Test:

1. **Clear AsyncStorage**:
   ```
   F12 → Application → Clear site data
   ```

2. **Refresh Page**:
   ```
   Ctrl+R
   ```

3. **Test Onboarding Flow**:
   - See splash screen ✅
   - Select role ✅
   - Complete login ✅
   - Complete registration ✅
   - See home screen ✅

4. **Repeat for Different Roles**:
   - Clear AsyncStorage
   - Test farmer flow
   - Clear AsyncStorage
   - Test buyer flow

---

## 📊 AsyncStorage Lifecycle

```
App First Load
    ↓
No AsyncStorage data
    ↓
Show splash screen
    ↓
User completes onboarding
    ↓
User data stored in AsyncStorage
    ↓
App Second Load
    ↓
AsyncStorage data exists
    ↓
Show home screen directly
    ↓
User clears AsyncStorage
    ↓
App Third Load
    ↓
No AsyncStorage data
    ↓
Show splash screen again
```

---

## ✅ Verification

### Check What's in AsyncStorage:

```javascript
// In browser console (F12)
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

### Expected Output (When Signed In):
```
user {"id":"1","name":"User","role":"farmer",...}
language "en"
hasSeenSplash "true"
selectedRole "farmer"
```

### Expected Output (After Clearing):
```
// Empty or only non-app data
```

---

## 🎓 Summary

**Why the app skips onboarding**:
- AsyncStorage contains persisted user data
- Auth context loads this data on app startup
- App thinks you're already signed in
- Navigates directly to home screen

**How to fix it**:
- Clear AsyncStorage
- Refresh the page
- App will show splash screen
- Complete onboarding flow

**This is correct behavior** - it's just that for testing, you need to clear the persisted data.

---

**Status**: ✅ EXPLAINED  
**Date**: 2025-10-18  
**Next**: Clear AsyncStorage and test! 🚀

