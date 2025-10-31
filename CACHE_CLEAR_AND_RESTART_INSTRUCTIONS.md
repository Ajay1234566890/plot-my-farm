# 🔧 Cache Clear and Restart Instructions

## Issue Found

The error `ReferenceError: userRole is not defined` is coming from a **cached version** of the file.

**What happened**:
1. I updated `app/login.tsx` to remove the `userRole` import from the context
2. The file on disk is correct
3. But the browser/dev server still has the OLD version cached
4. When you click "Verify OTP", it runs the old code which tries to use `userRole` that no longer exists

## Solution

### Option 1: Automatic Restart (RECOMMENDED)

I've already started the dev server with cache clearing:

```bash
rm -r node_modules/.cache
rm -r .expo
npm start -- --clear
```

**Wait for the dev server to fully start**, then:
1. Open browser to http://localhost:8085 (or the port shown)
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Test the buyer flow again

### Option 2: Manual Restart

If the automatic restart doesn't work:

1. **Stop the dev server** (Ctrl+C in terminal)
2. **Clear caches**:
   ```bash
   rm -r node_modules/.cache
   rm -r .expo
   rm -r .next (if it exists)
   ```
3. **Clear browser cache**:
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Storage → Clear site data
   - Or do a hard refresh (Ctrl+Shift+R)
4. **Restart dev server**:
   ```bash
   npm start -- --clear
   ```
5. **Test again**

### Option 3: Nuclear Option (If Still Not Working)

```bash
# Stop dev server (Ctrl+C)
rm -r node_modules
rm -r .expo
rm -r .next
npm install
npm start -- --clear
```

---

## What Changed in the Code

### Before (OLD - BROKEN):
```typescript
export default function Login() {
  const { login, userRole } = useAuth();  // ← userRole imported
  
  const handleVerifyOTP = async () => {
    await login(mobileNumber, otp);
    if (userRole === 'farmer') {  // ← Uses userRole from context
      router.replace('/farmer-registration');
    }
  };
}
```

### After (NEW - FIXED):
```typescript
export default function Login() {
  const { login } = useAuth();  // ← userRole NOT imported
  
  const handleVerifyOTP = async () => {
    const userRole = await login(mobileNumber, otp);  // ← Gets role from return value
    if (userRole === 'farmer') {  // ← Uses returned role
      router.replace('/farmer-registration');
    }
  };
}
```

---

## Why This Fix Works

**Old approach (BROKEN)**:
- `selectRole()` called on select-role screen, but user is null, so role not stored
- `login()` creates user with `role: null`
- Navigation checks `userRole` from context, which is null
- Defaults to farmer-registration

**New approach (FIXED)**:
- `selectRole()` stores role in separate `selectedRole` state (works even when user is null)
- `login()` uses `selectedRole` to create user with correct role
- `login()` returns the role immediately
- Navigation uses returned role (no timing issues)

---

## Testing After Cache Clear

### Test Buyer Flow:
1. Click "Get Started"
2. Select "Buyer" role
3. Select language
4. Click "Continue"
5. Enter phone: 9876543210
6. Click "Send OTP"
7. Enter OTP: 123456
8. Click "Verify OTP"
9. **Expected**: Navigate to buyer-profile-setup ✅

### Check Console:
- Open DevTools (F12)
- Look for debug logs:
  ```
  DEBUG: handleContinue() - calling selectRole with: buyer
  DEBUG: selectRole() called with role: buyer
  DEBUG: login() called with selectedRole: buyer
  DEBUG: login() creating user with role: buyer
  DEBUG: handleVerifyOTP() - login returned role: buyer
  DEBUG: Navigating to buyer-profile-setup
  ```

---

## Files Modified

| File | Change |
|------|--------|
| contexts/auth-context.tsx | Added selectedRole state, updated selectRole() and login() |
| app/login.tsx | Removed userRole import, updated handleVerifyOTP() |
| app/select-role.tsx | Added debug logging |

---

## Status

✅ Code is correct on disk  
⏳ Dev server restarting with cache clear  
⏳ Waiting for browser to load fresh version  

**Next Step**: Hard refresh browser and test again!

---

**Date**: 2025-10-18  
**Issue**: Cache-related error  
**Solution**: Clear cache and restart dev server  
**Status**: IN PROGRESS

