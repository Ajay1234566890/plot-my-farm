# 🧪 Testing Guide - Verify All Fixes

## 🎯 Quick Test Checklist

### ✅ Step 1: Start the App
```bash
# In terminal
npm start

# Wait for:
✅ Metro bundler started
✅ Web server running on http://localhost:8081
✅ QR code displayed
```

---

### ✅ Step 2: Test Registration (Main Fix)

**On Mobile/Web:**

1. **Open the app**
   - Scan QR code with Expo Go (mobile)
   - OR open http://localhost:8081 (web)

2. **Select Role**
   - Click "I'm a Farmer" button
   - ✅ Should navigate to login screen

3. **Enter Phone Number**
   - Enter: `6303191808` (or your number)
   - Click "Send OTP"
   - ✅ Should show OTP input

4. **Enter OTP**
   - Enter: `123456` (or real OTP)
   - Click "Verify OTP"
   - ✅ Should navigate to farmer-registration

5. **Fill Registration Form**
   - Full Name: `Test Farmer`
   - Email: `test@example.com`
   - Farm Name: `Green Valley Farm`
   - Farm Size: `5`
   - Click "Send OTP" → Enter OTP → "Verify"
   - Upload profile image (optional)
   - Click "Complete Registration"

6. **Expected Result:**
   ```
   ✅ Success alert: "Registration successful"
   ✅ Navigates to farmer-home screen
   ✅ Shows farmer dashboard with:
      - Welcome message
      - Map view
      - Market prices
      - Nearby buyers
   ```

7. **Check Terminal Logs:**
   ```
   ✅ [REGISTER] Attempting registration for phone: 6303191808
   ✅ [REGISTER] Supabase auth user created/retrieved
   ✅ [REGISTER] Profile created in Supabase
   ✅ Registration successful for user: 6303191808
   ```

---

### ✅ Step 3: Verify Database Connection

**Run Debug Script:**
```bash
node debug-database.js
```

**Expected Output:**
```
📊 FARMERS TABLE:
✅ Found 1 farmers:

1. Farmer:
   ID: [your-user-id]
   Phone: 6303191808
   Name: Test Farmer
   Created: [timestamp]

🔍 SEARCHING FOR PHONE: 6303191808 in FARMERS
✅ Found farmer with phone 6303191808:
{
  "id": "[your-user-id]",
  "phone": "6303191808",
  "full_name": "Test Farmer",
  "farm_name": "Green Valley Farm",
  "farm_size": "5",
  ...
}

✅ Database debug complete!
```

---

### ✅ Step 4: Test Farmer Dashboard Features

**On Farmer Home Screen:**

1. **Map View**
   - ✅ Should show map with your location (mobile)
   - ⚠️ Shows "Map available on mobile" (web)

2. **Market Prices**
   - ✅ Should load real-time prices
   - ✅ Shows crop images and prices

3. **Nearby Buyers**
   - ✅ Shows list of nearby buyers
   - ✅ Can click to view details

4. **Navigation**
   - ✅ Bottom navigation works
   - ✅ Can navigate to other screens

---

### ✅ Step 5: Check for Errors

**In Browser Console (F12):**
```
✅ No red errors
⚠️ Yellow warnings are OK (location, API, etc.)
✅ Green success messages
```

**In Terminal:**
```
✅ No ❌ errors related to registration
⚠️ Some ⚠️ warnings are OK (location, map on web, etc.)
✅ Lots of ✅ success messages
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "User already registered" Error
**Status:** ✅ FIXED
**If you still see it:**
1. Clear app data
2. Restart Metro bundler: `npm start -- --clear`
3. Try registration again

### Issue 2: Can't Navigate to Farmer Home
**Check:**
1. Is user object set? Check logs for `✅ Registration successful`
2. Is AsyncStorage working? Check logs for `✅ [AUTH]`
3. Try logging out and logging in again

### Issue 3: Database Connection Failed
**Check:**
1. Is Supabase URL correct in `.env`?
2. Is Supabase anon key correct?
3. Run: `node debug-database.js` to verify

### Issue 4: Map Not Showing
**Expected:**
- ✅ Mobile: Map shows with location
- ⚠️ Web: Shows "Map available on mobile" message
**This is normal!** MapLibre only works on mobile.

---

## 📊 Success Criteria

### ✅ Registration Flow:
- [x] Can select farmer role
- [x] Can enter phone number
- [x] Can verify OTP
- [x] Can fill registration form
- [x] Registration completes successfully
- [x] Navigates to farmer-home

### ✅ Database:
- [x] Farmer profile created in `farmers` table
- [x] Auth user created in Supabase Auth
- [x] Profile data matches form input
- [x] Can query profile by phone number

### ✅ Dashboard:
- [x] Farmer home screen loads
- [x] Shows welcome message
- [x] Map view works (mobile) or shows message (web)
- [x] Market prices load
- [x] Navigation works

### ✅ Error Handling:
- [x] No critical errors in console
- [x] Graceful fallbacks for warnings
- [x] User can complete all flows

---

## 🎉 All Tests Passed?

If all the above tests pass:
```
✅ Registration error is FIXED
✅ Database is connected
✅ Frontend-backend communication works
✅ Farmer dashboard is functional
✅ App is ready for use!
```

---

## 📞 Need Help?

If any test fails:
1. Check the terminal logs for specific errors
2. Check browser console (F12) for frontend errors
3. Run `node debug-database.js` to verify database
4. Share the specific error message for help

---

**Testing Date:** 2025-11-26  
**Status:** Ready for Testing ✅

