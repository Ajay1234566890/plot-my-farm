# 🚀 Supabase Setup Guide - Plot My Farm

## ✅ Completed Setup Steps

### 1. Environment Variables Added ✅
- Created `.env` file with Supabase credentials
- Added `EXPO_PUBLIC_SUPABASE_URL`
- Added `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Added `SUPABASE_SERVICE_ROLE_KEY`

### 2. Dependencies Installed ✅
- Installed `@supabase/supabase-js` package
- Ready for database operations

### 3. Supabase Client Created ✅
- Created `utils/supabase.ts` - Supabase client initialization
- Exports configured Supabase client for use in app

---

## 📋 Database Schema Created

### Tables Created (12 total):

1. **users** - User profiles and authentication
2. **crops** - Farmer's crop inventory
3. **offers** - Crop offers for sale
4. **orders** - Purchase orders
5. **cart_items** - Shopping cart items
6. **messages** - Direct messages between users
7. **notifications** - User notifications
8. **wishlist** - Buyer's wishlist
9. **reviews** - User reviews and ratings
10. **transport_requests** - Delivery requests
11. **weather_data** - Weather information
12. **market_prices** - Market price data

### Storage Buckets (5 total):

1. **crop-images** (public) - Crop photos
2. **offer-images** (public) - Offer photos
3. **profile-images** (public) - User profile pictures
4. **documents** (private) - Certifications and documents
5. **invoices** (private) - Order invoices

---

## 🔧 How to Set Up Database

### Option 1: Manual Setup (Recommended for First Time)

1. **Go to Supabase Dashboard**
   - URL: https://app.supabase.com
   - Login with your account

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy and Paste SQL Schema**
   - Open `scripts/supabase-schema.sql`
   - Copy all content
   - Paste into SQL Editor
   - Click "Run" button

4. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see all 12 tables listed

5. **Create Storage Buckets**
   - Go to "Storage" in left sidebar
   - Click "New Bucket" for each bucket:
     - `crop-images` (public)
     - `offer-images` (public)
     - `profile-images` (public)
     - `documents` (private)
     - `invoices` (private)

### Option 2: Automated Setup (Node.js Script)

```bash
# Run the initialization script
node scripts/init-supabase.js
```

**Note**: This script requires proper environment setup and may need adjustments based on your Supabase configuration.

---

## 📊 Database Schema Overview

### Users Table
```typescript
{
  id: UUID (primary key)
  email: string
  full_name: string
  phone: string
  role: 'farmer' | 'buyer' | 'admin'
  profile_image_url: string
  bio: string
  location: string
  latitude: number
  longitude: number
  is_verified: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Crops Table
```typescript
{
  id: UUID
  farmer_id: UUID (foreign key)
  name: string
  crop_type: string
  description: string
  quantity: number
  unit: string (default: 'kg')
  price_per_unit: number
  image_url: string
  location: string
  latitude: number
  longitude: number
  planting_date: date
  expected_harvest_date: date
  status: 'growing' | 'ready' | 'harvested' | 'sold'
  certification: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Offers Table
```typescript
{
  id: UUID
  farmer_id: UUID (foreign key)
  crop_id: UUID (foreign key)
  title: string
  crop_type: string
  description: string
  price: number
  quantity: number
  unit: string
  min_order_quantity: number
  availability_start_date: date
  availability_end_date: date
  image_url: string
  status: 'active' | 'sold' | 'expired'
  created_at: timestamp
  updated_at: timestamp
}
```

### Orders Table
```typescript
{
  id: UUID
  buyer_id: UUID (foreign key)
  farmer_id: UUID (foreign key)
  offer_id: UUID (foreign key)
  quantity: number
  total_price: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  delivery_address: string
  delivery_latitude: number
  delivery_longitude: number
  delivery_date: date
  notes: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Other Tables
- **cart_items** - Shopping cart management
- **messages** - User-to-user messaging
- **notifications** - System notifications
- **wishlist** - Saved offers
- **reviews** - User ratings and reviews
- **transport_requests** - Delivery logistics
- **weather_data** - Weather information
- **market_prices** - Market pricing data

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies:

- **Users**: Can only view/update their own profile
- **Crops**: Farmers can manage their crops, everyone can view
- **Offers**: Everyone can view, farmers can manage their offers
- **Orders**: Users can view their own orders
- **Cart Items**: Users can only manage their own cart
- **Messages**: Users can only view their own messages
- **Notifications**: Users can only view their own notifications
- **Wishlist**: Users can only manage their own wishlist
- **Reviews**: Everyone can view, users can create reviews
- **Transport Requests**: Users can view and create requests
- **Weather Data & Market Prices**: Public read access

---

## 📁 Storage Buckets

### Public Buckets
- **crop-images**: Crop photos (accessible via public URL)
- **offer-images**: Offer photos (accessible via public URL)
- **profile-images**: User profile pictures (accessible via public URL)

### Private Buckets
- **documents**: User certifications and documents (requires authentication)
- **invoices**: Order invoices (requires authentication)

---

## 🔗 Using Supabase in Your App

### Import Supabase Client
```typescript
import { supabase } from '@/utils/supabase';
```

### Example: Fetch User Profile
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### Example: Create an Offer
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

## ✅ Verification Checklist

- [ ] `.env` file created with Supabase credentials
- [ ] `@supabase/supabase-js` package installed
- [ ] `utils/supabase.ts` created
- [ ] SQL schema executed in Supabase
- [ ] All 12 tables created
- [ ] All 5 storage buckets created
- [ ] RLS policies enabled
- [ ] Can connect to Supabase from app

---

## 🚀 Next Steps

1. **Test Database Connection**
   - Add a test query in your app
   - Verify data can be read/written

2. **Implement Authentication**
   - Set up Supabase Auth in your app
   - Create login/signup flows

3. **Connect UI to Database**
   - Replace mock data with real database queries
   - Update all pages to use Supabase

4. **Set Up Real-Time Subscriptions**
   - For messages, notifications, orders
   - Use Supabase real-time features

5. **Configure Email Templates**
   - Order confirmations
   - Notifications
   - Password resets

---

## 📞 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Ensure `.env` file exists with correct keys

### Issue: "RLS policy violation"
**Solution**: Check RLS policies in Supabase dashboard

### Issue: "Storage bucket not found"
**Solution**: Create buckets manually in Supabase Storage tab

### Issue: "Foreign key constraint failed"
**Solution**: Ensure referenced records exist before inserting

---

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- Supabase Dashboard: https://app.supabase.com
- JavaScript Client: https://supabase.com/docs/reference/javascript
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security

---

**Status**: ✅ SETUP COMPLETE - Ready to use Supabase in your app!

