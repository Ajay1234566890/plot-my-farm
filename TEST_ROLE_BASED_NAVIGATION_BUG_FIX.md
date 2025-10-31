# 🧪 Testing Guide: Role-Based Navigation Bug Fix

## Bug Fixed

**Issue**: Buyer role selection incorrectly navigated to farmer-registration instead of buyer-profile-setup

**Root Cause**: `login()` function was not preserving the selected role

**Fix**: Modified `contexts/auth-context.tsx` to preserve `user.role` during login

---

## Pre-Testing Checklist

- [ ] Code changes applied: `contexts/auth-context.tsx` line 88
- [ ] No compilation errors
- [ ] No TypeScript errors
- [ ] App builds successfully

---

## Test Case 1: Farmer Flow (Should Still Work)

### Steps:
1. Run `npm start -- --clear`
2. Wait for app to load
3. Click "Get Started" on splash screen
4. On select-role screen:
   - [ ] Click "Farmer" role card
   - [ ] Verify it's highlighted in green
   - [ ] Select language (any language)
   - [ ] Click "Continue"
5. On login screen:
   - [ ] Enter phone: 9876543210
   - [ ] Click "Send OTP"
   - [ ] Enter OTP: 123456
   - [ ] Click "Verify OTP"
6. **Expected Result**: Navigate to farmer-registration screen

### Verification:
- [ ] Screen title shows "Farmer Registration" or similar
- [ ] Form fields for farmer details are visible
- [ ] No errors in console
- [ ] Navigation was smooth

### Result: ✅ PASS / ❌ FAIL

---

## Test Case 2: Buyer Flow (CRITICAL - This Was Broken)

### Steps:
1. Run `npm start -- --clear`
2. Wait for app to load
3. Click "Get Started" on splash screen
4. On select-role screen:
   - [ ] Click "Buyer" role card
   - [ ] Verify it's highlighted in green
   - [ ] Select language (any language)
   - [ ] Click "Continue"
5. On login screen:
   - [ ] Enter phone: 9876543210
   - [ ] Click "Send OTP"
   - [ ] Enter OTP: 123456
   - [ ] Click "Verify OTP"
6. **Expected Result**: Navigate to buyer-profile-setup screen (NOT farmer-registration)

### Verification:
- [ ] Screen title shows "Personal Information" or "Buyer Profile Setup"
- [ ] Form fields for buyer details are visible (name, email, address, etc.)
- [ ] NOT showing farmer registration form
- [ ] No errors in console
- [ ] Navigation was smooth

### Result: ✅ PASS / ❌ FAIL

---

## Test Case 3: Farmer Registration Completion

### Steps:
1. Complete Test Case 1 (Farmer Flow)
2. On farmer-registration screen:
   - [ ] Fill in all required fields
   - [ ] Click "Continue" or "Next" buttons
   - [ ] Complete all steps
   - [ ] Click "Complete Registration"
3. **Expected Result**: Navigate to farmer-home screen

### Verification:
- [ ] Screen shows farmer home/dashboard
- [ ] Bottom navigation visible
- [ ] No errors in console

### Result: ✅ PASS / ❌ FAIL

---

## Test Case 4: Buyer Profile Setup Completion

### Steps:
1. Complete Test Case 2 (Buyer Flow)
2. On buyer-profile-setup screen:
   - [ ] Fill in all required fields
   - [ ] Click "Next" buttons
   - [ ] Complete all steps
   - [ ] Click "Complete Setup"
3. **Expected Result**: Navigate to buyer-home screen

### Verification:
- [ ] Screen shows buyer home/dashboard
- [ ] Bottom navigation visible
- [ ] No errors in console

### Result: ✅ PASS / ❌ FAIL

---

## Test Case 5: Role Persistence After Logout

### Steps:
1. Complete Test Case 2 (Buyer Flow) and reach buyer-home
2. Go to settings screen
3. Click logout
4. Confirm logout
5. On select-role screen:
   - [ ] Select "Buyer" role again
   - [ ] Select language
   - [ ] Click "Continue"
6. On login screen:
   - [ ] Enter phone: 9876543210
   - [ ] Click "Send OTP"
   - [ ] Enter OTP: 123456
   - [ ] Click "Verify OTP"
7. **Expected Result**: Navigate to buyer-profile-setup screen again

### Verification:
- [ ] Correctly navigates to buyer-profile-setup
- [ ] Role is properly preserved
- [ ] No errors in console

### Result: ✅ PASS / ❌ FAIL

---

## Test Case 6: Console Error Check

### Steps:
1. Open browser console (F12 or right-click → Inspect)
2. Complete Test Case 1 (Farmer Flow)
3. Complete Test Case 2 (Buyer Flow)
4. Check console for errors

### Verification:
- [ ] No red error messages
- [ ] No warnings about undefined role
- [ ] No navigation errors
- [ ] No TypeScript errors

### Result: ✅ PASS / ❌ FAIL

---

## Test Case 7: Multiple Role Switches

### Steps:
1. Run `npm start -- --clear`
2. Select "Farmer" role → Login → Verify goes to farmer-registration
3. Go back to select-role
4. Select "Buyer" role → Login → Verify goes to buyer-profile-setup
5. Go back to select-role
6. Select "Farmer" role → Login → Verify goes to farmer-registration

### Verification:
- [ ] Each role selection correctly navigates to appropriate screen
- [ ] No role confusion
- [ ] No errors in console

### Result: ✅ PASS / ❌ FAIL

---

## Summary Report

### Test Results:

| Test Case | Description | Result |
|-----------|-------------|--------|
| 1 | Farmer Flow | ✅ PASS / ❌ FAIL |
| 2 | Buyer Flow (CRITICAL) | ✅ PASS / ❌ FAIL |
| 3 | Farmer Registration Completion | ✅ PASS / ❌ FAIL |
| 4 | Buyer Profile Setup Completion | ✅ PASS / ❌ FAIL |
| 5 | Role Persistence After Logout | ✅ PASS / ❌ FAIL |
| 6 | Console Error Check | ✅ PASS / ❌ FAIL |
| 7 | Multiple Role Switches | ✅ PASS / ❌ FAIL |

### Overall Status:
- [ ] All tests passed ✅
- [ ] Some tests failed ❌

### Issues Found (if any):
```
[List any issues found during testing]
```

### Notes:
```
[Add any additional notes or observations]
```

---

## What to Report Back

Please test both flows and report:

```
FARMER FLOW TEST:
- Farmer role selected: [YES/NO]
- Navigated to farmer-registration: [YES/NO]
- Completed registration: [YES/NO]
- Navigated to farmer-home: [YES/NO]
- Status: [PASS/FAIL]

BUYER FLOW TEST (CRITICAL):
- Buyer role selected: [YES/NO]
- Navigated to buyer-profile-setup: [YES/NO]
- Completed profile setup: [YES/NO]
- Navigated to buyer-home: [YES/NO]
- Status: [PASS/FAIL]

CONSOLE ERRORS:
- Any errors: [YES/NO]
- Error messages: [list any]

OVERALL STATUS:
- Bug fixed: [YES/NO]
- Ready for Phase 1 testing: [YES/NO]
```

---

## Important Notes

1. **Critical Test**: Test Case 2 (Buyer Flow) is the most important - this was the broken flow
2. **Clear Cache**: Always run `npm start -- --clear` before testing
3. **Check Console**: Look for any error messages in the browser console
4. **Test Both Flows**: Test both farmer and buyer to ensure nothing broke
5. **Report All Issues**: Even small issues should be reported

---

**Date**: 2025-10-18  
**Status**: READY FOR TESTING  
**Priority**: HIGH (Critical Bug Fix)

Test both flows and report back! 🚀

