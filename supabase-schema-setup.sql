-- ============================================
-- Plot My Farm - Supabase Schema Setup
-- MapLibre + Location Tracking Integration
-- ============================================

-- 1. Create users table if it doesn't exist
-- Run this in Supabase SQL Editor

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

-- Add columns if table already exists but columns are missing
DO $$
BEGIN
    -- Add latitude column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'latitude'
    ) THEN
        ALTER TABLE users ADD COLUMN latitude FLOAT8;
    END IF;

    -- Add longitude column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'longitude'
    ) THEN
        ALTER TABLE users ADD COLUMN longitude FLOAT8;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'location'
    ) THEN
        ALTER TABLE users ADD COLUMN location TEXT;
    END IF;

    -- Add role column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role TEXT;
    END IF;
END $$;

-- 2. Create index for faster location queries
CREATE INDEX IF NOT EXISTS idx_users_location 
ON users (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. Create index for role filtering
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users (role) 
WHERE role IS NOT NULL;

-- 4. Create function to calculate distance (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 FLOAT8, 
    lon1 FLOAT8, 
    lat2 FLOAT8, 
    lon2 FLOAT8
) RETURNS FLOAT8 AS $$
DECLARE
    earth_radius FLOAT8 := 6371000; -- Earth radius in meters
    dlat FLOAT8;
    dlon FLOAT8;
    a FLOAT8;
    c FLOAT8;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    
    a := sin(dlat/2) * sin(dlat/2) + 
         cos(radians(lat1)) * cos(radians(lat2)) * 
         sin(dlon/2) * sin(dlon/2);
    
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. Create function to get nearby users
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

-- 6. Enable Row Level Security (RLS) for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Create policy to allow users to read other users' locations
CREATE POLICY "Users can view other users' locations"
ON users FOR SELECT
USING (true);

-- 8. Create policy to allow users to update their own location
CREATE POLICY "Users can update their own location"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 9. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Test Queries
-- ============================================

-- Test 1: Get all users with location data
SELECT id, full_name, role, latitude, longitude, location
FROM users
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Test 2: Get nearby farmers (example: from Hyderabad coordinates)
SELECT * FROM get_nearby_users(
    17.3850,  -- Hyderabad latitude
    78.4867,  -- Hyderabad longitude
    30000,    -- 30km radius
    'farmer'  -- Only farmers
);

-- Test 3: Get nearby buyers
SELECT * FROM get_nearby_users(
    17.3850,  -- Hyderabad latitude
    78.4867,  -- Hyderabad longitude
    30000,    -- 30km radius
    'buyer'   -- Only buyers
);

-- Test 4: Update a user's location (replace with your user ID)
UPDATE users
SET 
    latitude = 17.3850,
    longitude = 78.4867,
    location = 'Hyderabad, Telangana, India'
WHERE id = 'your-user-id-here';

-- ============================================
-- Sample Data (for testing)
-- ============================================

-- Insert test farmers
INSERT INTO users (email, full_name, role, latitude, longitude, location)
VALUES 
    ('farmer1@test.com', 'Ravi Kumar', 'farmer', 17.3850, 78.4867, 'Hyderabad, India'),
    ('farmer2@test.com', 'Lakshmi Devi', 'farmer', 17.4000, 78.5000, 'Secunderabad, India'),
    ('farmer3@test.com', 'Suresh Reddy', 'farmer', 17.3700, 78.4700, 'Banjara Hills, India')
ON CONFLICT (email) DO NOTHING;

-- Insert test buyers
INSERT INTO users (email, full_name, role, latitude, longitude, location)
VALUES 
    ('buyer1@test.com', 'Priya Sharma', 'buyer', 17.3900, 78.4900, 'Jubilee Hills, India'),
    ('buyer2@test.com', 'Amit Patel', 'buyer', 17.4100, 78.5100, 'Begumpet, India'),
    ('buyer3@test.com', 'Sneha Rao', 'buyer', 17.3600, 78.4600, 'Gachibowli, India')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Verification Queries
-- ============================================

-- Check if all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('latitude', 'longitude', 'location', 'role')
ORDER BY column_name;

-- Check if indexes exist
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users' 
AND indexname LIKE 'idx_users_%';

-- Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('calculate_distance', 'get_nearby_users')
ORDER BY routine_name;

-- ============================================
-- Analytics Tables
-- ============================================

-- Create analytics_events table for tracking map usage
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    screen_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);

-- Enable RLS for analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own events
CREATE POLICY "Users can insert their own analytics events"
ON analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own events
CREATE POLICY "Users can view their own analytics events"
ON analytics_events FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- Orders Table (for route tracking)
-- ============================================

-- Create orders table if it doesn't exist
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

-- Add columns for delivery tracking if they don't exist
DO $$
BEGIN
    -- Add pickup location columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'pickup_latitude'
    ) THEN
        ALTER TABLE orders ADD COLUMN pickup_latitude FLOAT8;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'pickup_longitude'
    ) THEN
        ALTER TABLE orders ADD COLUMN pickup_longitude FLOAT8;
    END IF;

    -- Add delivery location columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'delivery_latitude'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_latitude FLOAT8;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'delivery_longitude'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_longitude FLOAT8;
    END IF;

    -- Add driver location columns (real-time tracking)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'driver_latitude'
    ) THEN
        ALTER TABLE orders ADD COLUMN driver_latitude FLOAT8;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'driver_longitude'
    ) THEN
        ALTER TABLE orders ADD COLUMN driver_longitude FLOAT8;
    END IF;

    -- Add estimated arrival time
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'estimated_arrival'
    ) THEN
        ALTER TABLE orders ADD COLUMN estimated_arrival TIMESTAMPTZ;
    END IF;
END $$;

-- ============================================
-- User Profiles Tables (for AI matching)
-- ============================================

-- Create farmer_profiles table
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    crops_available TEXT[] DEFAULT ARRAY[]::TEXT[],
    farm_size_acres FLOAT8,
    organic_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create buyer_profiles table
CREATE TABLE IF NOT EXISTS buyer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferred_crops TEXT[] DEFAULT ARRAY[]::TEXT[],
    business_type TEXT,
    bulk_buyer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user_id ON buyer_profiles(user_id);

-- Enable RLS
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for farmer_profiles
CREATE POLICY "Users can view all farmer profiles"
ON farmer_profiles FOR SELECT
USING (true);

CREATE POLICY "Farmers can update their own profile"
ON farmer_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for buyer_profiles
CREATE POLICY "Users can view all buyer profiles"
ON buyer_profiles FOR SELECT
USING (true);

CREATE POLICY "Buyers can update their own profile"
ON buyer_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Cleanup (if needed)
-- ============================================

-- Drop test data
-- DELETE FROM users WHERE email LIKE '%@test.com';

-- Drop functions
-- DROP FUNCTION IF EXISTS get_nearby_users;
-- DROP FUNCTION IF EXISTS calculate_distance;

-- Drop indexes
-- DROP INDEX IF EXISTS idx_users_location;
-- DROP INDEX IF EXISTS idx_users_role;

