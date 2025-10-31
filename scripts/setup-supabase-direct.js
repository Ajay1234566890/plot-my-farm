#!/usr/bin/env node

/**
 * Direct Supabase Setup using Supabase Client
 * Executes SQL directly through Supabase client
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Complete SQL schema as one statement
const FULL_SQL_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  status TEXT CHECK (status IN ('growing', 'ready', 'harvested', 'sold')) DEFAULT 'growing',
  certification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
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
  status TEXT CHECK (status IN ('active', 'sold', 'expired')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  delivery_address TEXT,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer_id, offer_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('order', 'offer', 'message', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(buyer_id, offer_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transport requests table
CREATE TABLE IF NOT EXISTS transport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  status TEXT CHECK (status IN ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'pending',
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  temperature DECIMAL(5, 2),
  humidity INTEGER,
  rainfall DECIMAL(10, 2),
  wind_speed DECIMAL(5, 2),
  weather_condition TEXT,
  forecast_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Market prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type TEXT NOT NULL,
  location TEXT,
  price DECIMAL(10, 2),
  unit TEXT DEFAULT 'kg',
  market_name TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crops_farmer_id ON crops(farmer_id);
CREATE INDEX IF NOT EXISTS idx_offers_farmer_id ON offers(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_buyer_id ON wishlist(buyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_order_id ON transport_requests(order_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
`;

// RLS Policies SQL
const RLS_POLICIES_SQL = `
-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for crops table
CREATE POLICY "Farmers can view all crops" ON crops FOR SELECT USING (true);
CREATE POLICY "Farmers can create crops" ON crops FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own crops" ON crops FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can delete their own crops" ON crops FOR DELETE USING (auth.uid() = farmer_id);

-- RLS Policies for offers table
CREATE POLICY "Everyone can view offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Farmers can create offers" ON offers FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own offers" ON offers FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can delete their own offers" ON offers FOR DELETE USING (auth.uid() = farmer_id);

-- RLS Policies for orders table
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- RLS Policies for cart_items table
CREATE POLICY "Users can view their own cart" ON cart_items FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can manage their own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update their own cart" ON cart_items FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "Users can delete from their own cart" ON cart_items FOR DELETE USING (auth.uid() = buyer_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for wishlist table
CREATE POLICY "Users can view their wishlist" ON wishlist FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can manage their wishlist" ON wishlist FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can delete from wishlist" ON wishlist FOR DELETE USING (auth.uid() = buyer_id);

-- RLS Policies for reviews table
CREATE POLICY "Everyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for weather_data and market_prices (public read)
CREATE POLICY "Everyone can view weather data" ON weather_data FOR SELECT USING (true);
CREATE POLICY "Everyone can view market prices" ON market_prices FOR SELECT USING (true);
`;

async function setupDatabase() {
  console.log('🚀 Starting Supabase Database Setup\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

  try {
    console.log('📊 Creating tables and indexes...');
    const { error: schemaError } = await supabase.rpc('exec', { sql: FULL_SQL_SCHEMA });
    
    if (schemaError) {
      console.log('⚠️  Note: Tables may already exist or require manual setup');
      console.log(`   Error: ${schemaError.message}\n`);
    } else {
      console.log('✅ Tables and indexes created successfully!\n');
    }

    console.log('🔐 Setting up Row Level Security policies...');
    const { error: rlsError } = await supabase.rpc('exec', { sql: RLS_POLICIES_SQL });
    
    if (rlsError) {
      console.log('⚠️  Note: RLS policies may already exist');
      console.log(`   Error: ${rlsError.message}\n`);
    } else {
      console.log('✅ RLS policies created successfully!\n');
    }

    console.log('🎉 Database setup completed!\n');
    console.log('📝 Important: If you see errors above, please:');
    console.log('1. Go to Supabase dashboard: https://app.supabase.com');
    console.log('2. Open SQL Editor');
    console.log('3. Copy content from scripts/supabase-schema.sql');
    console.log('4. Paste and run in SQL Editor\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Manual Setup Instructions:');
    console.log('1. Go to Supabase dashboard: https://app.supabase.com');
    console.log('2. Open SQL Editor');
    console.log('3. Copy content from scripts/supabase-schema.sql');
    console.log('4. Paste and run in SQL Editor\n');
  }
}

setupDatabase();

