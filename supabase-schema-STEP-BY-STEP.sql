-- ============================================
-- Plot My Farm - Supabase Schema Setup
-- STEP-BY-STEP VERSION (Run each section separately)
-- ============================================

-- ============================================
-- STEP 1: Create Users Table
-- Copy and run this first
-- ============================================

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

-- ============================================
-- STEP 2: Create Indexes for Performance
-- Copy and run this second
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- STEP 3: Create Distance Calculation Function
-- Copy and run this third
-- ============================================

CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 FLOAT8,
    lon1 FLOAT8,
    lat2 FLOAT8,
    lon2 FLOAT8
) RETURNS FLOAT8 AS $$
DECLARE
    earth_radius FLOAT8 := 6371000; -- Earth's radius in meters
    dlat FLOAT8;
    dlon FLOAT8;
    a FLOAT8;
    c FLOAT8;
BEGIN
    -- Haversine formula
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    
    a := sin(dlat/2) * sin(dlat/2) + 
         cos(radians(lat1)) * cos(radians(lat2)) * 
         sin(dlon/2) * sin(dlon/2);
    
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- STEP 4: Create Nearby Users Function
-- Copy and run this fourth
-- ============================================

CREATE OR REPLACE FUNCTION get_nearby_users(
    user_lat FLOAT8,
    user_lon FLOAT8,
    radius_meters FLOAT8 DEFAULT 30000,
    filter_role TEXT DEFAULT NULL
) RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    location TEXT,
    distance FLOAT8
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.latitude,
        u.longitude,
        u.location,
        calculate_distance(user_lat, user_lon, u.latitude, u.longitude) as distance
    FROM users u
    WHERE 
        u.latitude IS NOT NULL 
        AND u.longitude IS NOT NULL
        AND (filter_role IS NULL OR u.role = filter_role)
        AND calculate_distance(user_lat, user_lon, u.latitude, u.longitude) <= radius_meters
    ORDER BY distance ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 5: Enable Row Level Security
-- Copy and run this fifth
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view other users' locations" ON users;
CREATE POLICY "Users can view other users' locations"
ON users FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own location" ON users;
CREATE POLICY "Users can update their own location"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 6: Create Analytics Events Table
-- Copy and run this sixth
-- ============================================

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

DROP POLICY IF EXISTS "Users can insert their own analytics events" ON analytics_events;
CREATE POLICY "Users can insert their own analytics events"
ON analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own analytics events" ON analytics_events;
CREATE POLICY "Users can view their own analytics events"
ON analytics_events FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- STEP 7: Create Orders Table
-- Copy and run this seventh
-- ============================================

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

DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);

-- ============================================
-- STEP 8: Create Farmer Profiles Table
-- Copy and run this eighth
-- ============================================

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

DROP POLICY IF EXISTS "Users can view farmer profiles" ON farmer_profiles;
CREATE POLICY "Users can view farmer profiles"
ON farmer_profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Farmers can update their own profile" ON farmer_profiles;
CREATE POLICY "Farmers can update their own profile"
ON farmer_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- STEP 9: Create Buyer Profiles Table
-- Copy and run this ninth
-- ============================================

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

DROP POLICY IF EXISTS "Users can view buyer profiles" ON buyer_profiles;
CREATE POLICY "Users can view buyer profiles"
ON buyer_profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Buyers can update their own profile" ON buyer_profiles;
CREATE POLICY "Buyers can update their own profile"
ON buyer_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- STEP 10: Insert Sample Test Data (OPTIONAL)
-- Copy and run this last (only for testing)
-- ============================================

-- Insert test farmers (Hyderabad area)
INSERT INTO users (id, email, full_name, role, latitude, longitude, location)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'farmer1@test.com', 'Ravi Kumar', 'farmer', 17.3850, 78.4867, 'Hyderabad, Telangana'),
    ('22222222-2222-2222-2222-222222222222', 'farmer2@test.com', 'Lakshmi Devi', 'farmer', 17.4065, 78.4772, 'Secunderabad, Telangana'),
    ('33333333-3333-3333-3333-333333333333', 'farmer3@test.com', 'Suresh Reddy', 'farmer', 17.3616, 78.4747, 'Banjara Hills, Hyderabad')
ON CONFLICT (email) DO NOTHING;

-- Insert test buyers (Hyderabad area)
INSERT INTO users (id, email, full_name, role, latitude, longitude, location)
VALUES 
    ('44444444-4444-4444-4444-444444444444', 'buyer1@test.com', 'Ramesh Traders', 'buyer', 17.4239, 78.4738, 'Begumpet, Hyderabad'),
    ('55555555-5555-5555-5555-555555555555', 'buyer2@test.com', 'Fresh Mart', 'buyer', 17.4126, 78.4479, 'Ameerpet, Hyderabad'),
    ('66666666-6666-6666-6666-666666666666', 'buyer3@test.com', 'Organic Store', 'buyer', 17.4400, 78.3489, 'Madhapur, Hyderabad')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify everything is working
-- ============================================

-- Check users table
SELECT COUNT(*) as total_users, 
       COUNT(CASE WHEN role = 'farmer' THEN 1 END) as farmers,
       COUNT(CASE WHEN role = 'buyer' THEN 1 END) as buyers
FROM users;

-- Test nearby users function (from Hyderabad center)
SELECT full_name, role, location, ROUND(distance::numeric, 2) as distance_meters
FROM get_nearby_users(17.3850, 78.4867, 30000, NULL)
LIMIT 10;

-- ============================================
-- SUCCESS! 
-- Your database is now ready for Plot My Farm!
-- ============================================

