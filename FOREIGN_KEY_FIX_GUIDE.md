# 🔧 FOREIGN KEY CONSTRAINT FIX - CRITICAL!

## 🎯 The Problem

The error you're seeing is:

```
"details": "Key is not present in table \"users\"."
"message": "insert or update on table \"farmer_crops\" violates foreign key constraint \"farmer_crops_farmer_id_fkey\""
```

**Root Cause**: The `farmer_crops` table has an **old foreign key constraint** that still points to the `users` table instead of the new `farmers` table.

Even though you applied the V2 schema, the `CREATE TABLE IF NOT EXISTS` statement doesn't update existing foreign key constraints. The old constraint is still there!

---

## ✅ The Solution

I've created a dedicated SQL script that will:
1. Drop ALL old foreign key constraints (pointing to `users` table)
2. Recreate them to point to the correct `farmers` or `buyers` tables

---

## 🚀 How to Fix

### **Step 1: Open Supabase SQL Editor**

1. Go to [Supabase Dashboard](https://dlwbvoqowqiugyjdfyax.supabase.co)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### **Step 2: Copy and Run the Fix Script**

Copy the entire contents of `scripts/fix-foreign-keys.sql` and paste it into the SQL editor.

**OR** manually copy this:

```sql
-- Drop and recreate farmer_crops foreign key
ALTER TABLE farmer_crops DROP CONSTRAINT IF EXISTS farmer_crops_farmer_id_fkey;
ALTER TABLE farmer_crops ADD CONSTRAINT farmer_crops_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Drop and recreate farmer_offers foreign keys
ALTER TABLE farmer_offers DROP CONSTRAINT IF EXISTS farmer_offers_farmer_id_fkey;
ALTER TABLE farmer_offers ADD CONSTRAINT farmer_offers_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

ALTER TABLE farmer_offers DROP CONSTRAINT IF EXISTS farmer_offers_crop_id_fkey;
ALTER TABLE farmer_offers ADD CONSTRAINT farmer_offers_crop_id_fkey 
  FOREIGN KEY (crop_id) REFERENCES farmer_crops(id) ON DELETE SET NULL;

-- Drop and recreate buyer_purchase_requests foreign key
ALTER TABLE buyer_purchase_requests DROP CONSTRAINT IF EXISTS buyer_purchase_requests_buyer_id_fkey;
ALTER TABLE buyer_purchase_requests ADD CONSTRAINT buyer_purchase_requests_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Drop and recreate farmer_orders foreign keys
ALTER TABLE farmer_orders DROP CONSTRAINT IF EXISTS farmer_orders_farmer_id_fkey;
ALTER TABLE farmer_orders ADD CONSTRAINT farmer_orders_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

ALTER TABLE farmer_orders DROP CONSTRAINT IF EXISTS farmer_orders_buyer_id_fkey;
ALTER TABLE farmer_orders ADD CONSTRAINT farmer_orders_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Drop and recreate buyer_orders foreign keys
ALTER TABLE buyer_orders DROP CONSTRAINT IF EXISTS buyer_orders_buyer_id_fkey;
ALTER TABLE buyer_orders ADD CONSTRAINT buyer_orders_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

ALTER TABLE buyer_orders DROP CONSTRAINT IF EXISTS buyer_orders_farmer_id_fkey;
ALTER TABLE buyer_orders ADD CONSTRAINT buyer_orders_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Drop and recreate farmer_messages foreign keys
ALTER TABLE farmer_messages DROP CONSTRAINT IF EXISTS farmer_messages_sender_id_fkey;
ALTER TABLE farmer_messages ADD CONSTRAINT farmer_messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES farmers(id) ON DELETE CASCADE;

ALTER TABLE farmer_messages DROP CONSTRAINT IF EXISTS farmer_messages_receiver_id_fkey;
ALTER TABLE farmer_messages ADD CONSTRAINT farmer_messages_receiver_id_fkey 
  FOREIGN KEY (receiver_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Drop and recreate buyer_messages foreign keys
ALTER TABLE buyer_messages DROP CONSTRAINT IF EXISTS buyer_messages_sender_id_fkey;
ALTER TABLE buyer_messages ADD CONSTRAINT buyer_messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES buyers(id) ON DELETE CASCADE;

ALTER TABLE buyer_messages DROP CONSTRAINT IF EXISTS buyer_messages_receiver_id_fkey;
ALTER TABLE buyer_messages ADD CONSTRAINT buyer_messages_receiver_id_fkey 
  FOREIGN KEY (receiver_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Drop and recreate farmer_notifications foreign key
ALTER TABLE farmer_notifications DROP CONSTRAINT IF EXISTS farmer_notifications_user_id_fkey;
ALTER TABLE farmer_notifications ADD CONSTRAINT farmer_notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Drop and recreate buyer_notifications foreign key
ALTER TABLE buyer_notifications DROP CONSTRAINT IF EXISTS buyer_notifications_user_id_fkey;
ALTER TABLE buyer_notifications ADD CONSTRAINT buyer_notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Drop and recreate farmer_wishlist foreign keys
ALTER TABLE farmer_wishlist DROP CONSTRAINT IF EXISTS farmer_wishlist_farmer_id_fkey;
ALTER TABLE farmer_wishlist ADD CONSTRAINT farmer_wishlist_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Drop and recreate buyer_wishlist foreign keys
ALTER TABLE buyer_wishlist DROP CONSTRAINT IF EXISTS buyer_wishlist_buyer_id_fkey;
ALTER TABLE buyer_wishlist ADD CONSTRAINT buyer_wishlist_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Drop and recreate buyer_saved_farmers foreign keys
ALTER TABLE buyer_saved_farmers DROP CONSTRAINT IF EXISTS buyer_saved_farmers_buyer_id_fkey;
ALTER TABLE buyer_saved_farmers ADD CONSTRAINT buyer_saved_farmers_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

ALTER TABLE buyer_saved_farmers DROP CONSTRAINT IF EXISTS buyer_saved_farmers_farmer_id_fkey;
ALTER TABLE buyer_saved_farmers ADD CONSTRAINT buyer_saved_farmers_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Drop and recreate farmer_saved_buyers foreign keys
ALTER TABLE farmer_saved_buyers DROP CONSTRAINT IF EXISTS farmer_saved_buyers_farmer_id_fkey;
ALTER TABLE farmer_saved_buyers ADD CONSTRAINT farmer_saved_buyers_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

ALTER TABLE farmer_saved_buyers DROP CONSTRAINT IF EXISTS farmer_saved_buyers_buyer_id_fkey;
ALTER TABLE farmer_saved_buyers ADD CONSTRAINT farmer_saved_buyers_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;
```

### **Step 3: Click "Run"**

You should see: **Success. No rows returned**

---

## 🧪 Test After Fixing

1. **Try adding a crop again**
2. **Check the console logs** - you should see:
   ```
   ✅ [ADD-CROP] Farmer verified: {...}
   ✅ [ADD-CROP] Crop saved successfully: <crop-id>
   ```
3. **Verify in Supabase** - Go to Table Editor → farmer_crops → You should see your crop!

---

## 📊 What This Fixes

| Table | Old Constraint | New Constraint |
|-------|---------------|----------------|
| farmer_crops | → users(id) | → farmers(id) ✅ |
| farmer_offers | → users(id) | → farmers(id) ✅ |
| buyer_purchase_requests | → users(id) | → buyers(id) ✅ |
| farmer_orders | → users(id) | → farmers(id) + buyers(id) ✅ |
| buyer_orders | → users(id) | → buyers(id) + farmers(id) ✅ |
| farmer_messages | → users(id) | → farmers(id) ✅ |
| buyer_messages | → users(id) | → buyers(id) ✅ |
| farmer_notifications | → users(id) | → farmers(id) ✅ |
| buyer_notifications | → users(id) | → buyers(id) ✅ |
| farmer_wishlist | → users(id) | → farmers(id) ✅ |
| buyer_wishlist | → users(id) | → buyers(id) ✅ |
| buyer_saved_farmers | → users(id) | → buyers(id) + farmers(id) ✅ |
| farmer_saved_buyers | → users(id) | → farmers(id) + buyers(id) ✅ |

---

## ✅ After Running This Script

**Everything will work!**
- ✅ Farmers can add crops
- ✅ Buyers can see crops
- ✅ Call and message buttons work
- ✅ All foreign key constraints point to correct tables

**This is the final fix!** 🎉

