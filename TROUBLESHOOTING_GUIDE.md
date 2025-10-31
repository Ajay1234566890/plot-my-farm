# 🔧 Troubleshooting Guide

## Issue: App Still Showing React Native Welcome Page

### Step 1: Clear Cache and Rebuild

```bash
# Option A: Using npm
npm start -- --clear

# Option B: Using expo
expo start --clear

# Option C: Manual cache clear
rm -rf node_modules
npm install
npm start -- --clear
```

### Step 2: Check if App Reloads

After running the clear cache command:
1. The app should reload
2. You should see a loading spinner
3. Then either login screen or home screen

---

## Issue: Still Seeing Welcome Page After Cache Clear

### Check 1: Verify `_layout.tsx` is Updated

Run this command to check the file:
```bash
cat app/_layout.tsx | head -20
```

You should see:
```typescript
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
// ... (NO unstable_settings)
```

**If you see `unstable_settings`**, the file wasn't updated properly.

---

### Check 2: Verify Auth Context is Working

Check if the auth context is properly initialized:

```bash
# Look for any errors in the console
# You should see:
# - "Auth context initialized"
# - "User loaded from storage" (if user exists)
# - "No user found" (if first time)
```

---

### Check 3: Check for Console Errors

Look at the console output for any errors:

```
❌ If you see: "Cannot find module 'app/_layout.tsx'"
   → Solution: Restart the dev server

❌ If you see: "AuthProvider not found"
   → Solution: Check that AuthProvider is properly imported

❌ If you see: "Stack navigation error"
   → Solution: Check that all screens are properly registered
```

---

## Issue: App Shows Loading Spinner Forever

### Cause: Auth Context Not Initializing

**Solution**:

1. Check `contexts/auth-context.tsx` - Make sure `isLoading` is set to `false` after initialization
2. Check AsyncStorage - Make sure it's properly installed:
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

3. Check for errors in console - Look for any AsyncStorage errors

---

## Issue: App Shows Login Screen But Can't Login

### Check 1: Verify Login Screen Exists

```bash
ls -la app/login.tsx
```

Should show the file exists.

---

### Check 2: Check Login Screen Code

The login screen should have:
```typescript
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  // ... rest of code
}
```

---

### Check 3: Test Login Flow

1. Enter phone number
2. Enter OTP
3. Click login button
4. Should redirect to role selection screen

If it doesn't work:
- Check browser console for errors
- Check that `useAuth()` hook is working
- Check that `router.push()` is working

---

## Issue: App Shows Home Screen But Navigation Doesn't Work

### Check 1: Verify Bottom Navigation

The bottom navigation should have buttons that navigate to other screens.

**If buttons don't work**:
1. Check that `useRouter()` is imported
2. Check that `router.push()` is being called
3. Check that screen names match registered screens in `_layout.tsx`

---

### Check 2: Verify Screen Registration

All screens should be registered in `_layout.tsx`:

```typescript
<Stack.Screen name="farmer-home" options={{ headerShown: false }} />
<Stack.Screen name="buyer-home" options={{ headerShown: false }} />
// ... etc
```

If a screen is missing:
1. Add it to `_layout.tsx`
2. Restart the dev server

---

## Issue: Specific Screen Not Loading

### Solution:

1. **Check if screen file exists**:
   ```bash
   ls -la app/screen-name.tsx
   ```

2. **Check if screen is registered in `_layout.tsx`**:
   ```bash
   grep "screen-name" app/_layout.tsx
   ```

3. **Check for syntax errors in screen**:
   ```bash
   npm run type-check
   ```

4. **Check for import errors**:
   - Make sure all imports are correct
   - Make sure all components are imported

---

## Quick Fixes Checklist

- [ ] Cleared cache with `npm start -- --clear`
- [ ] Restarted dev server
- [ ] Checked `_layout.tsx` is updated
- [ ] Checked auth context is working
- [ ] Checked console for errors
- [ ] Verified all screens are registered
- [ ] Verified screen files exist
- [ ] Verified imports are correct

---

## Still Having Issues?

### Collect Debug Information

1. **Check console output**:
   ```bash
   npm start 2>&1 | tee debug.log
   ```

2. **Check for errors**:
   - Look for red error messages
   - Look for yellow warning messages
   - Look for any stack traces

3. **Check device logs** (if using physical device):
   ```bash
   # For iOS
   xcrun simctl spawn booted log stream --predicate 'process == "YourApp"'
   
   # For Android
   adb logcat | grep YourApp
   ```

---

## Common Error Messages

### Error: "Cannot find module 'app/_layout.tsx'"
**Solution**: Restart dev server with `npm start -- --clear`

### Error: "AuthProvider not found"
**Solution**: Check that AuthProvider is imported in `_layout.tsx`

### Error: "Stack navigation error"
**Solution**: Check that all screens are registered in `_layout.tsx`

### Error: "useRouter must be used inside Router"
**Solution**: Make sure component is inside Stack navigation

### Error: "useAuth must be used inside AuthProvider"
**Solution**: Make sure component is inside AuthProvider

---

## Prevention Tips

1. **Always clear cache** after major changes:
   ```bash
   npm start -- --clear
   ```

2. **Check console regularly** for errors

3. **Test navigation** after adding new screens

4. **Verify imports** are correct

5. **Use TypeScript** to catch errors early:
   ```bash
   npm run type-check
   ```

---

## Getting Help

If you're still having issues:

1. **Check the documentation**:
   - APP_NAVIGATION_FIX_REPORT.md
   - COMPREHENSIVE_SCREEN_STATUS_REPORT.md

2. **Check the console** for specific error messages

3. **Try the quick fixes** above

4. **Restart everything**:
   ```bash
   npm start -- --clear
   ```

---

**Last Updated**: 2025-10-18  
**Status**: Ready to help troubleshoot

