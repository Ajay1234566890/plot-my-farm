# Authentication Flow Test Plan

## Test Execution Summary

**Date**: 2025-10-18
**Status**: ✅ READY FOR TESTING
**Environment**: Expo Development Server (npm start)

---

## Pre-Test Checklist

- ✅ Expo development server running (Terminal 2)
- ✅ All TypeScript files compile without errors
- ✅ No diagnostics errors found
- ✅ All imports are correct
- ✅ AuthProvider integrated in root layout
- ✅ Authentication routing configured

---

## Test Scenarios

### Test 1: App Startup & Login Screen
**Objective**: Verify app starts and displays login screen

**Steps**:
1. Start the app (Expo Go or emulator)
2. Verify login screen appears
3. Verify phone input field is visible
4. Verify "Send OTP" button is visible

**Expected Result**: ✅ Login screen displays correctly

**Actual Result**: [To be filled during testing]

---

### Test 2: Phone Number Validation
**Objective**: Verify phone number validation works

**Test Cases**:
- Invalid: "123" → Error: "Please enter a valid 10-digit phone number"
- Invalid: "12345" → Error: "Please enter a valid 10-digit phone number"
- Invalid: "abcdefghij" → Error: "Please enter a valid 10-digit phone number"
- Valid: "9876543210" → No error, OTP sent

**Expected Result**: ✅ Validation works correctly

**Actual Result**: [To be filled during testing]

---

### Test 3: OTP Sending
**Objective**: Verify OTP sending flow

**Steps**:
1. Enter valid phone number: "9876543210"
2. Tap "Send OTP" button
3. Verify loading indicator appears
4. Verify success alert appears
5. Verify OTP input field appears
6. Verify resend timer starts (60 seconds)

**Expected Result**: ✅ OTP sent successfully

**Actual Result**: [To be filled during testing]

---

### Test 4: OTP Verification
**Objective**: Verify OTP verification flow

**Steps**:
1. Enter OTP: "123456"
2. Tap "Verify OTP" button
3. Verify loading indicator appears
4. Verify navigation to role selection screen

**Expected Result**: ✅ OTP verified and navigated to role selection

**Actual Result**: [To be filled during testing]

---

### Test 5: Role Selection - Farmer
**Objective**: Verify farmer role selection

**Steps**:
1. Tap "Farmer" role card
2. Verify role is highlighted
3. Verify language dropdown is visible
4. Select language (e.g., "English")
5. Tap "Continue" button
6. Verify navigation to farmer registration

**Expected Result**: ✅ Farmer role selected and navigated to registration

**Actual Result**: [To be filled during testing]

---

### Test 6: Farmer Registration - Step 1 (Details)
**Objective**: Verify farmer registration details step

**Steps**:
1. Enter Full Name: "John Doe"
2. Enter Email: "john@example.com"
3. Enter Mobile: "9876543210"
4. Enter Farm Name: "Green Farm"
5. Enter Farm Size: "10"
6. Tap "Send OTP" button
7. Verify loading indicator appears
8. Verify navigation to OTP step

**Expected Result**: ✅ Details validated and OTP step displayed

**Actual Result**: [To be filled during testing]

---

### Test 7: Farmer Registration - Step 2 (OTP)
**Objective**: Verify farmer registration OTP step

**Steps**:
1. Enter OTP: "123456"
2. Tap "Verify OTP" button
3. Verify loading indicator appears
4. Verify navigation to profile step

**Expected Result**: ✅ OTP verified and navigated to profile step

**Actual Result**: [To be filled during testing]

---

### Test 8: Farmer Registration - Step 3 (Profile)
**Objective**: Verify farmer registration profile step

**Steps**:
1. Verify account summary displays
2. Verify all entered data is shown
3. Tap "Complete Registration" button
4. Verify loading indicator appears
5. Verify navigation to farmer-home

**Expected Result**: ✅ Registration completed and navigated to farmer home

**Actual Result**: [To be filled during testing]

---

### Test 9: Role Selection - Buyer
**Objective**: Verify buyer role selection

**Steps**:
1. Go back to login (logout if needed)
2. Complete login and OTP verification
3. Tap "Buyer" role card
4. Verify role is highlighted
5. Tap "Continue" button
6. Verify navigation to buyer profile setup

**Expected Result**: ✅ Buyer role selected and navigated to setup

**Actual Result**: [To be filled during testing]

---

### Test 10: Buyer Profile Setup - Step 1 (Personal)
**Objective**: Verify buyer profile personal information step

**Steps**:
1. Enter Name: "Jane Smith"
2. Enter Email: "jane@example.com"
3. Enter Phone: "9876543210"
4. Enter Address: "123 Main St"
5. Enter City: "Bangalore"
6. Enter State: "Karnataka"
7. Enter Pincode: "560001"
8. Tap "Next" button
9. Verify navigation to business step

**Expected Result**: ✅ Personal info validated and business step displayed

**Actual Result**: [To be filled during testing]

---

### Test 11: Buyer Profile Setup - Step 2 (Business)
**Objective**: Verify buyer profile business details step

**Steps**:
1. Enter Business Name: "Fresh Produce Co"
2. Select Buyer Type: "Retailer"
3. Tap "Next" button
4. Verify navigation to preferences step

**Expected Result**: ✅ Business info validated and preferences step displayed

**Actual Result**: [To be filled during testing]

---

### Test 12: Buyer Profile Setup - Step 3 (Preferences)
**Objective**: Verify buyer profile preferences step

**Steps**:
1. Select crops: "Tomato", "Wheat", "Potato"
2. Verify selected crops are highlighted
3. Tap "Complete" button
4. Verify loading indicator appears
5. Verify navigation to buyer-home

**Expected Result**: ✅ Preferences saved and navigated to buyer home

**Actual Result**: [To be filled during testing]

---

### Test 13: Form Validation - Farmer Registration
**Objective**: Verify all validation errors display correctly

**Test Cases**:
- Empty Name → Error: "Name is required"
- Invalid Email → Error: "Please enter a valid email"
- Invalid Phone → Error: "Please enter a valid phone number"
- Empty Farm Name → Error: "Farm name is required"
- Invalid Farm Size → Error: "Farm size must be a positive number"

**Expected Result**: ✅ All validations work correctly

**Actual Result**: [To be filled during testing]

---

### Test 14: Form Validation - Buyer Profile Setup
**Objective**: Verify all validation errors display correctly

**Test Cases**:
- Empty Name → Error: "Name is required"
- Invalid Email → Error: "Please enter a valid email"
- Invalid Phone → Error: "Please enter a valid phone number"
- Invalid Pincode → Error: "Please enter a valid 6-digit pincode"
- Empty Business Name → Error: "Business name is required"

**Expected Result**: ✅ All validations work correctly

**Actual Result**: [To be filled during testing]

---

### Test 15: Navigation Back Buttons
**Objective**: Verify back button functionality

**Steps**:
1. Test back button on each screen
2. Verify correct navigation
3. Verify data is preserved when going back

**Expected Result**: ✅ Back buttons work correctly

**Actual Result**: [To be filled during testing]

---

### Test 16: Session Persistence
**Objective**: Verify session persists after app restart

**Steps**:
1. Complete farmer registration
2. Close app
3. Reopen app
4. Verify user is still logged in
5. Verify farmer-home is displayed

**Expected Result**: ✅ Session persists correctly

**Actual Result**: [To be filled during testing]

---

### Test 17: Logout Functionality
**Objective**: Verify logout clears session

**Steps**:
1. Navigate to profile/settings
2. Tap logout button
3. Verify navigation to login screen
4. Verify AsyncStorage is cleared

**Expected Result**: ✅ Logout works correctly

**Actual Result**: [To be filled during testing]

---

## Error Scenarios

### Error Test 1: Network Error
**Scenario**: OTP sending fails due to network error

**Expected Behavior**: Error message displayed, user can retry

---

### Error Test 2: Invalid OTP
**Scenario**: User enters wrong OTP

**Expected Behavior**: Error message displayed, user can resend OTP

---

### Error Test 3: Duplicate Phone
**Scenario**: User tries to register with existing phone number

**Expected Behavior**: Error message displayed, user can use different phone

---

## Performance Tests

### Performance Test 1: Screen Load Time
**Objective**: Verify screens load quickly

**Expected**: < 500ms per screen

---

### Performance Test 2: Form Submission
**Objective**: Verify form submission completes quickly

**Expected**: < 1000ms per submission

---

## Accessibility Tests

### Accessibility Test 1: Touch Targets
**Objective**: Verify all buttons are easily tappable

**Expected**: Minimum 44x44 points

---

### Accessibility Test 2: Text Contrast
**Objective**: Verify text is readable

**Expected**: WCAG AA compliance

---

## Test Results Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | App Startup | [ ] | |
| 2 | Phone Validation | [ ] | |
| 3 | OTP Sending | [ ] | |
| 4 | OTP Verification | [ ] | |
| 5 | Farmer Role Selection | [ ] | |
| 6 | Farmer Reg - Step 1 | [ ] | |
| 7 | Farmer Reg - Step 2 | [ ] | |
| 8 | Farmer Reg - Step 3 | [ ] | |
| 9 | Buyer Role Selection | [ ] | |
| 10 | Buyer Setup - Step 1 | [ ] | |
| 11 | Buyer Setup - Step 2 | [ ] | |
| 12 | Buyer Setup - Step 3 | [ ] | |
| 13 | Farmer Validation | [ ] | |
| 14 | Buyer Validation | [ ] | |
| 15 | Back Buttons | [ ] | |
| 16 | Session Persistence | [ ] | |
| 17 | Logout | [ ] | |

---

## Overall Test Status

**Total Tests**: 17
**Passed**: [ ]
**Failed**: [ ]
**Skipped**: [ ]

**Overall Result**: [ ] PASS / [ ] FAIL

---

## Issues Found

[To be filled during testing]

---

## Recommendations

[To be filled after testing]

---

## Sign-Off

**Tested By**: [Your Name]
**Date**: [Date]
**Status**: [APPROVED / NEEDS FIXES]

---

**Next Steps**: 
- [ ] Fix any issues found
- [ ] Re-test failed scenarios
- [ ] Proceed to Phase 3 (Farmer Features)

---

**Last Updated**: 2025-10-18

