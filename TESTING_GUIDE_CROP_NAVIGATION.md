# 🧪 Testing Guide - Crop Navigation Flow

## Pre-Testing Setup

### Step 1: Clear Browser Cache
1. Open DevTools: **F12**
2. Go to **Application** tab
3. Click **Clear site data**
4. Confirm deletion

### Step 2: Refresh Page
- Press **Ctrl+R** (Windows/Linux) or **Cmd+R** (Mac)
- Wait for app to fully load

### Step 3: Verify App is Running
- Check terminal shows: `Web is waiting on http://localhost:8081`
- App should load without errors

---

## 🌾 Farmer Flow Testing

### Test 1: Navigate to My Farms
**Steps:**
1. Login with farmer credentials
2. Verify farmer-home page loads
3. Look at bottom navigation (should show: Home, My Farms, Mic, Messages, Profile)
4. Click **"My Farms"** tab in bottom navigation

**Expected Result:**
- ✅ Navigate to my-farms page
- ✅ See list of farms with cards
- ✅ Each farm card shows: name, location, size, crops, status, yield, harvest date
- ✅ Bottom navigation still visible

**Actual Result:**
- [ ] Pass / [ ] Fail

---

### Test 2: Click Manage Button
**Steps:**
1. On my-farms page, locate a farm card
2. Click the green **"Manage"** button

**Expected Result:**
- ✅ Navigate to `/edit-crop` page
- ✅ See form with fields: Crop Name, Quantity, Unit, Price, Harvest Date
- ✅ Form is empty (ready for new crop or editing)
- ✅ Bottom navigation still visible
- ✅ **NO error in console**

**Actual Result:**
- [ ] Pass / [ ] Fail

**Error Check:**
- [ ] No "Mic is not defined" error
- [ ] No navigation errors
- [ ] No console errors

---

### Test 3: Verify Edit Crop Page
**Steps:**
1. On edit-crop page, verify all form fields are present
2. Try filling in some data
3. Click "Save" button

**Expected Result:**
- ✅ Form accepts input
- ✅ Save button shows success message
- ✅ No errors

**Actual Result:**
- [ ] Pass / [ ] Fail

---

## 🛒 Buyer Flow Testing

### Test 4: Navigate to Nearby Crops
**Steps:**
1. Logout from farmer account
2. Login with buyer credentials
3. Verify buyer-home page loads
4. Look at bottom navigation (should show: Home, Crops, Mic, Orders, Profile)
5. Click **"Crops"** tab in bottom navigation

**Expected Result:**
- ✅ Navigate to nearby-crops page
- ✅ See list of available crops
- ✅ Each crop card shows: name, farm, price, quantity, image
- ✅ Each crop card has a blue **"View Details"** button
- ✅ Bottom navigation still visible

**Actual Result:**
- [ ] Pass / [ ] Fail

---

### Test 5: Click View Details Button
**Steps:**
1. On nearby-crops page, locate a crop card
2. Click the blue **"View Details"** button

**Expected Result:**
- ✅ Navigate to `/crop-details` page
- ✅ See crop details: name, description, origin, farmer info, availability, rating, reviews
- ✅ See **"Add to Cart"** or **"Buy Now"** button (buyer action)
- ✅ Bottom navigation still visible
- ✅ **NO error in console**

**Actual Result:**
- [ ] Pass / [ ] Fail

**Error Check:**
- [ ] No "Mic is not defined" error
- [ ] No navigation errors
- [ ] No console errors

---

### Test 6: Verify Crop Details Page
**Steps:**
1. On crop-details page, verify all information is displayed
2. Check farmer profile section
3. Check rating and reviews section
4. Try clicking "Add to Cart" or purchase button

**Expected Result:**
- ✅ All crop information displays correctly
- ✅ Farmer profile shows correctly
- ✅ Rating and reviews display
- ✅ Purchase button is functional
- ✅ No errors

**Actual Result:**
- [ ] Pass / [ ] Fail

---

## 🔄 Cross-Flow Testing

### Test 7: Farmer → Buyer Flow
**Steps:**
1. Login as farmer
2. Navigate through farmer pages (My Farms, Edit Crop, etc.)
3. Logout
4. Login as buyer
5. Navigate through buyer pages (Nearby Crops, Crop Details, etc.)

**Expected Result:**
- ✅ All pages load correctly
- ✅ No navigation errors
- ✅ No state conflicts
- ✅ Bottom navigation updates based on role

**Actual Result:**
- [ ] Pass / [ ] Fail

---

### Test 8: Bottom Navigation Consistency
**Steps:**
1. Login as farmer
2. Navigate to each farmer page using bottom navigation
3. Verify bottom navigation is visible on all pages
4. Verify active tab is highlighted
5. Logout and repeat for buyer

**Expected Result:**
- ✅ Bottom navigation visible on all pages
- ✅ Active tab is highlighted in role color (green for farmer, blue for buyer)
- ✅ All tabs are clickable
- ✅ Navigation is smooth

**Actual Result:**
- [ ] Pass / [ ] Fail

---

## 🐛 Error Checking

### Console Errors to Check
- [ ] No "Mic is not defined" errors
- [ ] No "undefined is not a function" errors
- [ ] No "Cannot read property" errors
- [ ] No navigation errors
- [ ] No import errors

### Network Errors to Check
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] No timeout errors

---

## 📊 Test Summary

| Test | Description | Status |
|------|-------------|--------|
| Test 1 | Navigate to My Farms | [ ] Pass / [ ] Fail |
| Test 2 | Click Manage Button | [ ] Pass / [ ] Fail |
| Test 3 | Verify Edit Crop Page | [ ] Pass / [ ] Fail |
| Test 4 | Navigate to Nearby Crops | [ ] Pass / [ ] Fail |
| Test 5 | Click View Details Button | [ ] Pass / [ ] Fail |
| Test 6 | Verify Crop Details Page | [ ] Pass / [ ] Fail |
| Test 7 | Farmer → Buyer Flow | [ ] Pass / [ ] Fail |
| Test 8 | Bottom Navigation Consistency | [ ] Pass / [ ] Fail |

---

## ✅ Final Checklist

- [ ] All tests passed
- [ ] No console errors
- [ ] No navigation errors
- [ ] Farmer flow works correctly
- [ ] Buyer flow works correctly
- [ ] Bottom navigation works on all pages
- [ ] App is ready for production

---

## 📝 Notes

- Clear cache between tests if you encounter issues
- Use F12 DevTools to check console for errors
- Test on both web and mobile (if available)
- Report any failures with screenshots

---

## 🚀 Status

**Ready for Testing**: ✅ YES  
**App URL**: http://localhost:8081  
**Last Updated**: 2025-10-22

