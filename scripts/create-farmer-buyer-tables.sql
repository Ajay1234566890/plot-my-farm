-- =====================================================
-- CREATE SEPARATE FARMER AND BUYER TABLES
-- =====================================================
-- This script creates separate tables for farmers and buyers
-- instead of a single users table with roles
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

-- Update existing table references to use farmers/buyers
-- Update crops table to reference farmers
ALTER TABLE crops DROP CONSTRAINT IF EXISTS crops_farmer_id_fkey;
ALTER TABLE crops ADD CONSTRAINT crops_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Update offers table to reference farmers
ALTER TABLE offers DROP CONSTRAINT IF EXISTS offers_farmer_id_fkey;
ALTER TABLE offers ADD CONSTRAINT offers_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;

-- Update orders table to reference both farmers and buyers
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_farmer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_farmer_id_fkey 
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Update cart_items table to reference buyers
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_buyer_id_fkey;
ALTER TABLE cart_items ADD CONSTRAINT cart_items_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Update messages table - SPECIAL HANDLING NEEDED
-- Note: messages table has sender_id and receiver_id which can reference either farmers or buyers
-- Cannot create simple foreign key constraints - handle in application logic

-- Update notifications table - SPECIAL HANDLING NEEDED
-- Note: notifications table has user_id which can reference either farmers or buyers
-- Cannot create simple foreign key constraints - handle in application logic

-- Update wishlist table to reference buyers
ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_buyer_id_fkey;
ALTER TABLE wishlist ADD CONSTRAINT wishlist_buyer_id_fkey 
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE;

-- Update reviews table - SPECIAL HANDLING NEEDED
-- Note: reviews table has reviewer_id and reviewed_user_id which can reference either farmers or buyers
-- Cannot create simple foreign key constraints - handle in application logic

-- Update transport_requests table - SPECIAL HANDLING NEEDED
-- Note: transport_requests table has driver_id which can reference either farmers or buyers
-- Cannot create simple foreign key constraints - handle in application logic

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
-- 5. Updated foreign key constraints for existing tables
-- =====================================================
