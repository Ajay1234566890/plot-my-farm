-- =====================================================
-- CREATE SEPARATE FARMER AND BUYER TABLES - FIXED VERSION
-- =====================================================
-- This script creates separate tables for farmers and buyers
-- instead of a single users table with roles
-- FIXED: Removed incorrect foreign key constraints
-- =====================================================

-- Drop existing users table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Create farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  farm_name TEXT,
  farm_size TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  profile_image_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create buyers table
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  business_type TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  profile_image_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmers_phone ON farmers(phone);
CREATE INDEX IF NOT EXISTS idx_buyers_phone ON buyers(phone);
CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers(location);
CREATE INDEX IF NOT EXISTS idx_buyers_location ON buyers(location);

-- =====================================================
-- UPDATE FOREIGN KEY CONSTRAINTS - ONLY FOR TABLES THAT HAVE THE COLUMNS
-- =====================================================

-- Update crops table to reference farmers (has farmer_id column)
ALTER TABLE crops DROP CONSTRAINT IF EXISTS crops_farmer_id_fkey;
ALTER TABLE crops ADD CONSTRAINT crops_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Update offers table to reference farmers (has farmer_id column)
ALTER TABLE offers DROP CONSTRAINT IF EXISTS offers_farmer_id_fkey;
ALTER TABLE offers ADD CONSTRAINT offers_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Update orders table to reference both farmers and buyers (has both buyer_id and farmer_id columns)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_farmer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Update cart_items table to reference buyers (has buyer_id column)
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_buyer_id_fkey;
ALTER TABLE cart_items ADD CONSTRAINT cart_items_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Update wishlist table to reference buyers (has buyer_id column)
ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_buyer_id_fkey;
ALTER TABLE wishlist ADD CONSTRAINT wishlist_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- =====================================================
-- TABLES THAT NEED SPECIAL HANDLING (NO FOREIGN KEY UPDATES)
-- =====================================================

-- messages table: sender_id and receiver_id can reference either farmers or buyers
-- reviews table: reviewer_id and reviewed_user_id can reference either farmers or buyers
-- notifications table: user_id can reference either farmers or buyers
-- transport_requests table: driver_id can reference either farmers or buyers

-- These will be handled in application logic, not database constraints

-- =====================================================
-- RLS POLICIES FOR FARMERS TABLE
-- =====================================================

-- Enable RLS on farmers table
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- Farmers can view their own profile
CREATE POLICY "Farmers can view own profile" ON farmers
    FOR SELECT USING (auth.uid() = id);

-- Farmers can update their own profile
CREATE POLICY "Farmers can update own profile" ON farmers
    FOR UPDATE USING (auth.uid() = id);

-- Farmers can insert their own profile
CREATE POLICY "Farmers can insert own profile" ON farmers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Everyone can view farmer profiles (for buyers to see)
CREATE POLICY "Anyone can view farmer profiles" ON farmers
    FOR SELECT USING (true);

-- =====================================================
-- RLS POLICIES FOR BUYERS TABLE
-- =====================================================

-- Enable RLS on buyers table
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own profile
CREATE POLICY "Buyers can view own profile" ON buyers
    FOR SELECT USING (auth.uid() = id);

-- Buyers can update their own profile
CREATE POLICY "Buyers can update own profile" ON buyers
    FOR UPDATE USING (auth.uid() = id);

-- Buyers can insert their own profile
CREATE POLICY "Buyers can insert own profile" ON buyers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Everyone can view buyer profiles (for farmers to see)
CREATE POLICY "Anyone can view buyer profiles" ON buyers
    FOR SELECT USING (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the tables were created correctly:

-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name IN ('farmers', 'buyers') 
-- ORDER BY table_name, ordinal_position;

-- SELECT * FROM farmers LIMIT 5;
-- SELECT * FROM buyers LIMIT 5;

-- =====================================================
-- SUMMARY
-- =====================================================
-- This script creates:
-- 1. farmers table with farm-specific fields (farm_name, farm_size)
-- 2. buyers table with business-specific fields (company_name, business_type)
-- 3. Both tables use phone as primary identifier (no email required)
-- 4. Proper RLS policies for data security
-- 5. Updated foreign key constraints ONLY for tables that have the correct columns
-- 6. Special handling noted for tables with mixed references
-- =====================================================
