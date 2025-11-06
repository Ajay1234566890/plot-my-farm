# 🗄️ Database Setup Guide - Plot My Farm

## ⚠️ **IMPORTANT: Fix for "relation users does not exist" Error**

The error you encountered means the `users` table doesn't exist in your Supabase database yet. I've created a **step-by-step SQL file** that will fix this.

---

## 🚀 **Quick Fix - Run This Now**

### **Option 1: Run All at Once (Recommended)**

1. **Open Supabase SQL Editor:**
   https://supabase.com/dashboard/project/dlwbvoqowqiugyjdfyax/sql

2. **Copy the ENTIRE file:**
   Open `supabase-schema-STEP-BY-STEP.sql` in your project

3. **Paste and Run:**
   - Paste all content into SQL Editor
   - Click "Run" button
   - Wait for completion (should take 5-10 seconds)

4. **Verify Success:**
   You should see "Success. No rows returned" or similar message

---

## 🔧 **Option 2: Run Step-by-Step (If Option 1 Fails)**

If running all at once gives errors, run each step separately:

### **Step 1: Create Users Table**
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('farmer', 'buyer', 'admin')),
    latitude FLOAT8,
    longitude FLOAT8,
    location TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Step 2: Create Indexes**
```sql
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### **Step 3: Create Distance Function**
```sql
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 FLOAT8, lon1 FLOAT8, lat2 FLOAT8, lon2 FLOAT8
) RETURNS FLOAT8 AS $$
DECLARE
    earth_radius FLOAT8 := 6371000;
    dlat FLOAT8; dlon FLOAT8; a FLOAT8; c FLOAT8;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### **Step 4: Create Nearby Users Function**
```sql
CREATE OR REPLACE FUNCTION get_nearby_users(
    user_lat FLOAT8, user_lon FLOAT8, radius_meters FLOAT8 DEFAULT 30000, filter_role TEXT DEFAULT NULL
) RETURNS TABLE (id UUID, email TEXT, full_name TEXT, role TEXT, latitude FLOAT8, longitude FLOAT8, location TEXT, distance FLOAT8) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.full_name, u.role, u.latitude, u.longitude, u.location,
           calculate_distance(user_lat, user_lon, u.latitude, u.longitude) as distance
    FROM users u
    WHERE u.latitude IS NOT NULL AND u.longitude IS NOT NULL
      AND (filter_role IS NULL OR u.role = filter_role)
      AND calculate_distance(user_lat, user_lon, u.latitude, u.longitude) <= radius_meters
    ORDER BY distance ASC;
END;
$$ LANGUAGE plpgsql;
```

### **Step 5: Enable Row Level Security**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view other users' locations" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own location" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
```

### **Step 6: Create Analytics Table**
```sql
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    screen_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own analytics events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own analytics events" ON analytics_events FOR SELECT USING (auth.uid() = user_id);
```

### **Step 7: Create Orders Table**
```sql
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    pickup_latitude FLOAT8,
    pickup_longitude FLOAT8,
    delivery_latitude FLOAT8,
    delivery_longitude FLOAT8,
    driver_latitude FLOAT8,
    driver_longitude FLOAT8,
    estimated_arrival TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);
```

### **Step 8: Create Farmer Profiles Table**
```sql
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    crops_available TEXT[] DEFAULT ARRAY[]::TEXT[],
    farm_size_acres FLOAT8,
    organic_certified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON farmer_profiles(user_id);
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view farmer profiles" ON farmer_profiles FOR SELECT USING (true);
CREATE POLICY "Farmers can update their own profile" ON farmer_profiles FOR UPDATE USING (auth.uid() = user_id);
```

### **Step 9: Create Buyer Profiles Table**
```sql
CREATE TABLE IF NOT EXISTS buyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    preferred_crops TEXT[] DEFAULT ARRAY[]::TEXT[],
    business_type TEXT,
    bulk_buyer BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view buyer profiles" ON buyer_profiles FOR SELECT USING (true);
CREATE POLICY "Buyers can update their own profile" ON buyer_profiles FOR UPDATE USING (auth.uid() = user_id);
```

---

## ✅ **Verify Setup**

After running the SQL, verify everything is working:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'analytics_events', 'orders', 'farmer_profiles', 'buyer_profiles');

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('calculate_distance', 'get_nearby_users');
```

You should see:
- ✅ 5 tables (users, analytics_events, orders, farmer_profiles, buyer_profiles)
- ✅ 2 functions (calculate_distance, get_nearby_users)

---

## 🧪 **Test with Sample Data (Optional)**

To test the map features, insert some sample users:

```sql
-- Insert test farmers
INSERT INTO users (email, full_name, role, latitude, longitude, location)
VALUES 
    ('farmer1@test.com', 'Ravi Kumar', 'farmer', 17.3850, 78.4867, 'Hyderabad, Telangana'),
    ('farmer2@test.com', 'Lakshmi Devi', 'farmer', 17.4065, 78.4772, 'Secunderabad, Telangana')
ON CONFLICT (email) DO NOTHING;

-- Insert test buyers
INSERT INTO users (email, full_name, role, latitude, longitude, location)
VALUES 
    ('buyer1@test.com', 'Ramesh Traders', 'buyer', 17.4239, 78.4738, 'Begumpet, Hyderabad'),
    ('buyer2@test.com', 'Fresh Mart', 'buyer', 17.4126, 78.4479, 'Ameerpet, Hyderabad')
ON CONFLICT (email) DO NOTHING;

-- Test nearby users function
SELECT full_name, role, location, ROUND(distance::numeric, 2) as distance_meters
FROM get_nearby_users(17.3850, 78.4867, 30000, NULL);
```

---

## 🎯 **After Database Setup**

Once the database is set up, you can proceed with building the APK:

```bash
eas build -p android --profile preview
```

---

## 📊 **What Was Created**

| Table/Function | Purpose |
|----------------|---------|
| **users** | Store user profiles with location data |
| **analytics_events** | Track all map interactions |
| **orders** | Store orders with delivery tracking |
| **farmer_profiles** | Extended farmer information |
| **buyer_profiles** | Extended buyer information |
| **calculate_distance()** | Haversine distance formula |
| **get_nearby_users()** | Find users within radius |

---

## 🔒 **Security (Row Level Security)**

All tables have RLS enabled:
- ✅ Users can view all locations (for map)
- ✅ Users can only update their own data
- ✅ Users can only view their own analytics
- ✅ Users can only view their own orders

---

## 🎉 **Success!**

After running the SQL:
- ✅ Database schema is complete
- ✅ All tables created
- ✅ All functions created
- ✅ All indexes created
- ✅ Row Level Security enabled
- ✅ **Ready for APK build!**

---

**Next Step:** Run `eas build -p android --profile preview` to build your APK!

