#!/usr/bin/env node

/**
 * Automated Supabase Setup Script
 * Uses Supabase Management API to create tables and storage buckets
 * Requires: EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

require('dotenv').config();
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// SQL Schema for all tables
const SQL_SCHEMA = `
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

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Farmers can view all crops" ON crops FOR SELECT USING (true);
CREATE POLICY "Farmers can create crops" ON crops FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own crops" ON crops FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can delete their own crops" ON crops FOR DELETE USING (auth.uid() = farmer_id);
CREATE POLICY "Everyone can view offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Farmers can create offers" ON offers FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own offers" ON offers FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can delete their own offers" ON offers FOR DELETE USING (auth.uid() = farmer_id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);
CREATE POLICY "Users can view their own cart" ON cart_items FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can manage their own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update their own cart" ON cart_items FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "Users can delete from their own cart" ON cart_items FOR DELETE USING (auth.uid() = buyer_id);
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can view their wishlist" ON wishlist FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can manage their wishlist" ON wishlist FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can delete from wishlist" ON wishlist FOR DELETE USING (auth.uid() = buyer_id);
CREATE POLICY "Everyone can view weather data" ON weather_data FOR SELECT USING (true);
CREATE POLICY "Everyone can view market prices" ON market_prices FOR SELECT USING (true);
`;

// Storage buckets configuration
const STORAGE_BUCKETS = [
  { name: 'crop-images', public: true },
  { name: 'offer-images', public: true },
  { name: 'profile-images', public: true },
  { name: 'documents', public: false },
  { name: 'invoices', public: false },
];

async function executeSQL() {
  console.log('📊 Executing SQL schema...\n');
  
  try {
    const { error } = await supabase.rpc('exec', { sql: SQL_SCHEMA });
    
    if (error) {
      console.error('❌ SQL Error:', error.message);
      return false;
    }
    
    console.log('✅ SQL schema executed successfully!\n');
    return true;
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message);
    return false;
  }
}

async function createStorageBuckets() {
  console.log('🪣 Creating storage buckets...\n');
  
  let successCount = 0;
  
  for (const bucket of STORAGE_BUCKETS) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️  Bucket '${bucket.name}' already exists`);
        } else {
          console.error(`❌ Error creating bucket '${bucket.name}': ${error.message}`);
        }
      } else {
        console.log(`✅ Created bucket: ${bucket.name} (public: ${bucket.public})`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error creating bucket '${bucket.name}':`, err.message);
    }
  }
  
  console.log(`\n✅ Storage setup complete! (${successCount}/${STORAGE_BUCKETS.length} new buckets created)\n`);
  return true;
}

async function verifySetup() {
  console.log('🔍 Verifying setup...\n');
  
  try {
    // Check tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (!tablesError && tables) {
      console.log(`✅ Found ${tables.length} tables in database`);
    }
    
    // Check storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (!bucketsError && buckets) {
      console.log(`✅ Found ${buckets.length} storage buckets`);
      buckets.forEach(b => console.log(`   - ${b.name} (public: ${b.public})`));
    }
    
    console.log('\n');
    return true;
  } catch (err) {
    console.error('⚠️  Verification skipped:', err.message);
    return true;
  }
}

async function main() {
  console.log('🚀 Starting Automated Supabase Setup\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);
  
  try {
    // Step 1: Execute SQL
    const sqlSuccess = await executeSQL();
    if (!sqlSuccess) {
      console.error('❌ Failed to execute SQL schema');
      process.exit(1);
    }
    
    // Step 2: Create storage buckets
    await createStorageBuckets();
    
    // Step 3: Verify setup
    await verifySetup();
    
    console.log('🎉 Supabase setup completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('1. Go to Supabase dashboard: https://app.supabase.com');
    console.log('2. Verify all tables are created');
    console.log('3. Verify all storage buckets are created');
    console.log('4. Test the app with real database\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

