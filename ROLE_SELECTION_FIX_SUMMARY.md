# Role Selection Logic Fix - Complete Summary

## 🎯 Problem Statement

**Issue**: When user selects "Farmer" role but enters a phone number registered as "Buyer", the app logs them in as a buyer (and vice versa). The app should support the same phone number for both roles and route based on the selected role.

**User Requirement**: 
> "we can have same mobile account for both according to the role we need to find the users"

---

## ✅ Solution Implemented

### 1. **Authentication Logic Update** (`contexts/auth-context.tsx`)

**Changed**: Removed fallback logic that checked the other role's table

**Before**:
```typescript
// If selectedRole is 'farmer', check farmers table
// If not found, CHECK BUYERS TABLE AS FALLBACK ← Problem!
// This caused wrong role routing
```

**After**:
```typescript
// ONLY check the selected role's table - NO FALLBACK
if (selectedRole === 'farmer') {
  // Check ONLY farmers table by phone
  // If not found, return null (trigger registration)
}
else if (selectedRole === 'buyer') {
  // Check ONLY buyers table by phone
  // If not found, return null (trigger registration)
}
```

**Result**: Users are now logged in based on `selectedRole + phone` combination, not just phone lookup.

---

### 2. **Database Schema Update** (`scripts/supabase-schema-v2.sql`)

**Added**: Separate `farmers` and `buyers` tables

```sql
-- Farmers table (allows same phone for both roles)
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,  -- No UNIQUE constraint!
  full_name TEXT,
  email TEXT,
  profile_image_url TEXT,
  farm_name TEXT,
  farm_size TEXT,
  bio TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buyers table (allows same phone for both roles)
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,  -- No UNIQUE constraint!
  full_name TEXT,
  email TEXT,
  profile_image_url TEXT,
  company_name TEXT,
  business_type TEXT,
  bio TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Key Points**:
- ✅ No UNIQUE constraint on phone field
- ✅ Same phone can exist in both tables
- ✅ Separate IDs for farmer and buyer profiles
- ✅ Indexes on phone fields for fast lookups

**Updated Foreign Keys**: All tables now reference `farmers(id)` or `buyers(id)` instead of `users(id)`:
- `farmer_crops.farmer_id` → `farmers(id)`
- `farmer_offers.farmer_id` → `farmers(id)`
- `buyer_purchase_requests.buyer_id` → `buyers(id)`
- `buyer_cart_items.buyer_id` → `buyers(id)`
- `buyer_wishlist.buyer_id` → `buyers(id)`
- `orders.buyer_id` → `buyers(id)`
- `orders.farmer_id` → `farmers(id)`
- And more...

---

## 🔄 How It Works Now

### User Flow Example:

**Scenario 1**: User with phone `+91 9876543210` wants to be both farmer and buyer

1. **First Registration (as Farmer)**:
   - Select "Farmer" role → Enter phone `+91 9876543210` → Complete farmer registration
   - Creates entry in `farmers` table with this phone

2. **Second Registration (as Buyer)**:
   - Select "Buyer" role → Enter phone `+91 9876543210` → Complete buyer registration
   - Creates entry in `buyers` table with same phone
   - ✅ No conflict! Same phone exists in both tables

3. **Login as Farmer**:
   - Select "Farmer" role → Enter phone `+91 9876543210`
   - Auth checks ONLY `farmers` table → Finds profile → Routes to `farmer-home`

4. **Login as Buyer**:
   - Select "Buyer" role → Enter phone `+91 9876543210`
   - Auth checks ONLY `buyers` table → Finds profile → Routes to `buyer-home`

---

## 📋 Files Modified

1. **`contexts/auth-context.tsx`** (Lines 172-224)
   - Removed fallback logic
   - Only checks selected role's table
   - Returns null if no profile found (triggers registration)

2. **`scripts/supabase-schema-v2.sql`**
   - Added `farmers` table (Lines 25-40)
   - Added `buyers` table (Lines 42-57)
   - Updated all foreign key references
   - Added indexes on phone fields
   - Added RLS policies for new tables
   - Added DROP POLICY statements

---

## 🚀 How to Apply Changes

### Step 1: Apply the Updated Schema

```bash
# Option 1: Automated
npm run apply:schema

# Option 2: Manual
# 1. Open Supabase Dashboard → SQL Editor
# 2. Copy scripts/supabase-schema-v2.sql
# 3. Paste and run
```

### Step 2: Test the Fix

1. **Test Same Phone for Both Roles**:
   ```
   - Select "Farmer" → Enter phone +91 1234567890 → Complete registration
   - Logout
   - Select "Buyer" → Enter phone +91 1234567890 → Complete registration
   - Logout
   - Select "Farmer" → Enter phone +91 1234567890 → Should go to farmer-home
   - Logout
   - Select "Buyer" → Enter phone +91 1234567890 → Should go to buyer-home
   ```

2. **Verify Database**:
   ```sql
   -- Check if same phone exists in both tables
   SELECT * FROM farmers WHERE phone = '+91 1234567890';
   SELECT * FROM buyers WHERE phone = '+91 1234567890';
   ```

---

## ✅ Expected Behavior

- ✅ Same phone number can have both farmer and buyer profiles
- ✅ User is routed based on selected role, not just phone lookup
- ✅ No more wrong role routing
- ✅ Each role has separate profile data
- ✅ Users can switch between roles by selecting different role at login

---

## 🎉 Summary

**Problem**: Role selection was ignored, users routed based on phone lookup only
**Solution**: 
1. Separate farmers/buyers tables (same phone allowed)
2. Auth checks only selected role's table (no fallback)
3. Route based on selectedRole + phone combination

**Result**: Users can now have both farmer and buyer accounts with the same phone number! 🚀

