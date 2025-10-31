# 🎉 Supabase Complete Setup - Plot My Farm

## ✅ Setup Status

### Completed ✅
- [x] `.env` file created with Supabase credentials
- [x] `@supabase/supabase-js` package installed
- [x] `utils/supabase.ts` client created
- [x] Storage buckets created (5/5)
- [x] Automation scripts created
- [x] NPM scripts added

### Remaining ⏳
- [ ] Database tables created (manual or automated)
- [ ] RLS policies configured
- [ ] Test database connection

---

## 🚀 Quick Setup - 3 Options

### Option 1: Automated Setup (Recommended) ⭐

```bash
npm run setup:supabase:direct
```

**What it does:**
- Creates all 12 database tables
- Creates all indexes
- Enables RLS
- Creates all RLS policies

**Status:** ✅ Storage buckets already created

---

### Option 2: Manual SQL Setup (Most Reliable)

1. **Go to Supabase Dashboard**
   - URL: https://app.supabase.com
   - Login with your account

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy SQL Schema**
   - Open `scripts/supabase-schema.sql` in your editor
   - Copy all content

4. **Paste and Execute**
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - Wait for completion

5. **Verify**
   - Go to "Table Editor"
   - Verify all 12 tables exist

---

### Option 3: REST API Setup

```bash
npm run setup:supabase:rest
```

**Status:** ✅ Already completed (storage buckets created)

---

## 📊 What's Already Created

### Storage Buckets ✅ (5/5)

| Bucket | Public | Status |
|--------|--------|--------|
| crop-images | Yes | ✅ Created |
| offer-images | Yes | ✅ Created |
| profile-images | Yes | ✅ Created |
| documents | No | ✅ Created |
| invoices | No | ✅ Created |

### Environment Variables ✅

```env
EXPO_PUBLIC_SUPABASE_URL=https://dlwbvoqowqiugyjdfyax.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Client ✅

```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export { supabase };
```

---

## 📋 Database Tables to Create

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('farmer', 'buyer', 'admin')),
  profile_image_url TEXT,
  bio TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Crops Table
```sql
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  description TEXT,
  quantity DECIMAL(10, 2),
  unit TEXT DEFAULT 'kg',
  price_per_unit DECIMAL(10, 2),
  image_url TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  planting_date DATE,
  expected_harvest_date DATE,
  status TEXT CHECK (status IN ('growing', 'ready', 'harvested', 'sold')),
  certification TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Offers Table
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id),
  crop_id UUID REFERENCES crops(id),
  title TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  min_order_quantity DECIMAL(10, 2),
  availability_start_date DATE,
  availability_end_date DATE,
  image_url TEXT,
  status TEXT CHECK (status IN ('active', 'sold', 'expired')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  farmer_id UUID NOT NULL REFERENCES users(id),
  offer_id UUID REFERENCES offers(id),
  quantity DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5-12. Other Tables
- **cart_items** - Shopping cart
- **messages** - Direct messaging
- **notifications** - User notifications
- **wishlist** - Saved offers
- **reviews** - User reviews
- **transport_requests** - Delivery logistics
- **weather_data** - Weather information
- **market_prices** - Market pricing

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies:

```sql
-- Example: Users can only view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Example: Farmers can create crops
CREATE POLICY "Farmers can create crops" ON crops
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Example: Everyone can view offers
CREATE POLICY "Everyone can view offers" ON offers
  FOR SELECT USING (true);
```

---

## 🔗 Using Supabase in Your App

### Import Client
```typescript
import { supabase } from '@/utils/supabase';
```

### Fetch Data
```typescript
const { data, error } = await supabase
  .from('offers')
  .select('*')
  .eq('status', 'active');
```

### Insert Data
```typescript
const { data, error } = await supabase
  .from('offers')
  .insert([{
    farmer_id: userId,
    title: 'Fresh Tomatoes',
    crop_type: 'Tomatoes',
    price: 45,
    quantity: 100,
    status: 'active'
  }]);
```

### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('crop-images')
  .upload(`${userId}/${filename}`, file);
```

---

## ✅ Verification Checklist

After setup:

- [ ] Go to https://app.supabase.com
- [ ] Check "Table Editor" - see all 12 tables
- [ ] Check "Storage" - see all 5 buckets
- [ ] Run test query in SQL Editor:
  ```sql
  SELECT * FROM users LIMIT 1;
  ```
- [ ] Test app connection:
  ```typescript
  const { data } = await supabase.from('users').select('*').limit(1);
  console.log(data);
  ```

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `utils/supabase.ts` | Supabase client |
| `scripts/supabase-schema.sql` | SQL schema (manual setup) |
| `scripts/setup-supabase-automated.js` | Automated setup (SDK) |
| `scripts/setup-supabase-rest-api.js` | Automated setup (REST API) |
| `scripts/setup-supabase-direct.js` | Direct setup |
| `SUPABASE_SETUP_GUIDE.md` | Setup guide |
| `SUPABASE_QUICK_REFERENCE.md` | Quick reference |
| `SUPABASE_AUTOMATED_SETUP.md` | Automated setup guide |

---

## 🎯 Next Steps

1. **Create Database Tables**
   - Run one of the setup options above
   - Verify tables in Supabase dashboard

2. **Test Connection**
   - Add test query in your app
   - Verify data can be read/written

3. **Implement Authentication**
   - Set up Supabase Auth
   - Create login/signup flows

4. **Connect UI to Database**
   - Replace mock data with real queries
   - Update all pages to use Supabase

5. **Set Up Real-Time Features**
   - Messages real-time updates
   - Order notifications
   - Live offer updates

---

## 📞 Troubleshooting

### Tables Not Created
- Check `.env` file has correct credentials
- Try manual SQL setup option
- Check Supabase dashboard for errors

### Storage Buckets Not Found
- Already created! ✅
- Check Supabase Storage tab

### Connection Errors
- Verify Supabase URL is correct
- Check internet connection
- Verify API keys are valid

### RLS Policy Errors
- Ensure user is authenticated
- Check RLS policies in Supabase
- Verify user ID matches policy conditions

---

## 📚 Resources

- Supabase Docs: https://supabase.com/docs
- Dashboard: https://app.supabase.com
- JavaScript Client: https://supabase.com/docs/reference/javascript
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security

---

## 🎉 Summary

✅ **Completed:**
- Environment setup
- Storage buckets (5/5)
- Supabase client
- Automation scripts

⏳ **Next:**
- Create database tables
- Configure RLS policies
- Test connection
- Connect UI to database

**Status**: Ready for database table creation!

**Last Updated**: 2025-10-22

