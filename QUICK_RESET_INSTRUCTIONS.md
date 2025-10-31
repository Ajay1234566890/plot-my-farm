# ⚡ Quick Reset Instructions - 30 Seconds

## 🎯 Problem
App is showing farmer-home directly instead of splash screen because it's loading persisted data from AsyncStorage.

## ✅ Solution - 3 Easy Steps

### Step 1: Open DevTools
```
Press F12
```

### Step 2: Clear Storage
```
DevTools → Application tab → Storage → Clear site data
```

Or:

```
DevTools → Application tab → Local Storage → Right-click → Clear All
```

### Step 3: Refresh Page
```
Press Ctrl+R
```

---

## 🎉 Result

After these 3 steps:
- ✅ AsyncStorage is cleared
- ✅ App reloads
- ✅ You see splash screen
- ✅ Complete onboarding flow works

---

## 🧪 Test the Flow

1. Click "Get Started"
2. Select "Buyer" role
3. Select language
4. Click "Continue"
5. Enter phone: 9876543210
6. Click "Send OTP"
7. Enter OTP: 123456
8. Click "Verify OTP"
9. Complete buyer setup
10. See buyer-home ✅

---

## 📝 What Gets Cleared

- ❌ user (logged-in user object)
- ❌ language (selected language)
- ❌ hasSeenSplash (splash screen flag)
- ❌ selectedRole (selected role)

---

## 🔄 Repeat for Different Roles

To test farmer flow:
1. Clear AsyncStorage again (F12 → Application → Clear site data)
2. Refresh (Ctrl+R)
3. Select "Farmer" role
4. Complete farmer registration
5. See farmer-home ✅

---

## 🛠️ Alternative Methods

### Method 2: Console Command
```
F12 → Console tab
Type: localStorage.clear()
Press Enter
Refresh: Ctrl+R
```

### Method 3: Query Parameter
```
http://localhost:8081?reset=true
```

---

## ✅ Verify It Worked

After clearing and refreshing:
- ✅ See splash screen (not farmer-home)
- ✅ See role selection screen
- ✅ See login screen
- ✅ Complete onboarding flow

---

**Time**: 30 seconds  
**Difficulty**: Easy  
**Status**: Ready to test! 🚀

