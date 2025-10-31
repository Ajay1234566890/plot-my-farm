# 🚀 Automated Supabase Setup Guide

## ✅ What's Been Done

### 1. Environment Variables ✅
- Created `.env` file with Supabase credentials
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Public API key for client
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations

### 2. Dependencies Installed ✅
- `@supabase/supabase-js` - Supabase JavaScript client

### 3. Supabase Client ✅
- Created `utils/supabase.ts` - Configured Supabase client

### 4. Automation Scripts Created ✅
- `scripts/setup-supabase-automated.js` - Uses Supabase SDK
- `scripts/setup-supabase-rest-api.js` - Uses REST API (more reliable)
- `scripts/supabase-schema.sql` - Manual SQL setup

### 5. NPM Scripts Added ✅
- `npm run setup:supabase` - Run automated setup (SDK method)
- `npm run setup:supabase:rest` - Run automated setup (REST API method)

---

## 🎯 Quick Start - Automated Setup

### Option 1: Using REST API (Recommended) ⭐

```bash
npm run setup:supabase:rest
```

**What it does:**
- ✅ Creates all 12 database tables
- ✅ Creates all indexes for performance
- ✅ Enables Row Level Security (RLS)
- ✅ Creates all RLS policies
- ✅ Creates all 5 storage buckets
- ✅ Verifies setup completion

**Expected Output:**
```
🚀 Starting Supabase Setup with REST API

📍 Supabase URL: https://dlwbvoqowqiugyjdfyax.supabase.co

📊 Executing SQL queries...
.................................................. 50/60
✅ SQL execution complete! (60 successful, 0 errors)

🪣 Creating storage buckets...
✅ Created bucket: crop-images (public: true)
✅ Created bucket: offer-images (public: true)
✅ Created bucket: profile-images (public: true)
✅ Created bucket: documents (public: false)
✅ Created bucket: invoices (public: false)

🎉 Supabase setup completed successfully!
```

### Option 2: Using Supabase SDK

```bash
npm run setup:supabase
```

**Note:** This method may require additional configuration depending on your Supabase setup.

---

## 📊 What Gets Created

### Database Tables (12)

1. **users** - User profiles and authentication
   - Stores farmer and buyer information
   - Linked to Supabase auth.users

2. **crops** - Farmer's crop inventory
   - Crop details, location, status
   - Linked to users (farmer_id)

3. **offers** - Crop offers for sale
   - Price, quantity, availability
   - Linked to users (farmer_id) and crops

4. **orders** - Purchase orders
   - Buyer and farmer information
   - Order status and delivery details

5. **cart_items** - Shopping cart
   - Buyer's cart items
   - Linked to offers

6. **messages** - Direct messaging
   - Sender and receiver information
   - Message content and read status

7. **notifications** - User notifications
   - Order, offer, message, system notifications
   - Read status tracking

8. **wishlist** - Saved offers
   - Buyer's wishlist items
   - Linked to offers

9. **reviews** - User reviews and ratings
   - Ratings (1-5 stars)
   - Comments and timestamps

10. **transport_requests** - Delivery logistics
    - Pickup and delivery locations
    - Driver assignment and status

11. **weather_data** - Weather information
    - Temperature, humidity, rainfall
    - Location-based data

12. **market_prices** - Market pricing data
    - Crop prices by location
    - Market information

### Storage Buckets (5)

| Bucket | Public | Purpose |
|--------|--------|---------|
| crop-images | Yes | Crop photos |
| offer-images | Yes | Offer photos |
| profile-images | Yes | User profile pictures |
| documents | No | Certifications, documents |
| invoices | No | Order invoices |

### Indexes (10)

- `idx_crops_farmer_id` - Fast farmer crop lookup
- `idx_offers_farmer_id` - Fast farmer offers lookup
- `idx_orders_buyer_id` - Fast buyer orders lookup
- `idx_orders_farmer_id` - Fast farmer orders lookup
- `idx_messages_sender_id` - Fast sender messages lookup
- `idx_messages_receiver_id` - Fast receiver messages lookup
- `idx_notifications_user_id` - Fast user notifications lookup
- `idx_wishlist_buyer_id` - Fast wishlist lookup
- `idx_reviews_reviewer_id` - Fast reviews lookup
- `idx_transport_requests_order_id` - Fast transport lookup

### Row Level Security (RLS) Policies (27)

All tables have RLS enabled with specific policies:

**Users Table:**
- Users can view their own profile
- Users can update their own profile

**Crops Table:**
- Farmers can view all crops
- Farmers can create crops
- Farmers can update their own crops
- Farmers can delete their own crops

**Offers Table:**
- Everyone can view offers
- Farmers can create offers
- Farmers can update their own offers
- Farmers can delete their own offers

**Orders Table:**
- Users can view their own orders
- Buyers can create orders
- Users can update their own orders

**Cart Items Table:**
- Users can view their own cart
- Users can manage their own cart
- Users can update their own cart
- Users can delete from their own cart

**Messages Table:**
- Users can view their messages
- Users can send messages

**Notifications Table:**
- Users can view their notifications

**Wishlist Table:**
- Users can view their wishlist
- Users can manage their wishlist
- Users can delete from wishlist

**Reviews Table:**
- Everyone can view reviews
- Users can create reviews

**Weather & Market Data:**
- Everyone can view (public read access)

---

## 🔧 Troubleshooting

### Issue: "Missing required environment variables"
**Solution:**
1. Check `.env` file exists in project root
2. Verify all three keys are present:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Issue: "Connection refused"
**Solution:**
1. Verify Supabase URL is correct
2. Check internet connection
3. Verify service role key is valid

### Issue: "Permission denied" or "RLS policy violation"
**Solution:**
1. Ensure service role key is used (not anon key)
2. Check RLS policies are created correctly
3. Verify user authentication

### Issue: "Storage bucket already exists"
**Solution:**
- This is normal! Script will skip existing buckets
- No action needed

### Issue: "Table already exists"
**Solution:**
- This is normal! Script uses `CREATE TABLE IF NOT EXISTS`
- No action needed

---

## ✅ Verification Checklist

After running the setup script:

- [ ] Script completed without fatal errors
- [ ] Go to Supabase dashboard: https://app.supabase.com
- [ ] Check "Table Editor" - see all 12 tables
- [ ] Check "Storage" - see all 5 buckets
- [ ] Check "SQL Editor" - run test query:
  ```sql
  SELECT * FROM users LIMIT 1;
  ```
- [ ] Test app connection to database

---

## 🔗 Using Database in Your App

### Import Supabase Client
```typescript
import { supabase } from '@/utils/supabase';
```

### Example: Fetch Offers
```typescript
const { data: offers, error } = await supabase
  .from('offers')
  .select('*')
  .eq('status', 'active');
```

### Example: Create Offer
```typescript
const { data, error } = await supabase
  .from('offers')
  .insert([
    {
      farmer_id: userId,
      title: 'Fresh Tomatoes',
      crop_type: 'Tomatoes',
      price: 45,
      quantity: 100,
      status: 'active'
    }
  ]);
```

### Example: Upload Image
```typescript
const { data, error } = await supabase.storage
  .from('crop-images')
  .upload(`${userId}/${filename}`, file);
```

---

## 📚 Next Steps

1. **Test Database Connection**
   - Add test query in your app
   - Verify data can be read/written

2. **Implement Authentication**
   - Set up Supabase Auth
   - Create login/signup flows

3. **Connect UI to Database**
   - Replace mock data with real queries
   - Update all pages to use Supabase

4. **Set Up Real-Time Features**
   - Messages real-time updates
   - Order notifications
   - Live offer updates

5. **Configure Email Templates**
   - Order confirmations
   - Password resets
   - Notifications

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Dashboard: https://app.supabase.com
- JavaScript Client: https://supabase.com/docs/reference/javascript

---

**Status**: ✅ AUTOMATED SETUP READY

**Last Updated**: 2025-10-22

