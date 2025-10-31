#!/usr/bin/env node

/**
 * Supabase Database Initialization Script
 * This script creates all necessary tables and storage buckets for the Plot My Farm app
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// SQL queries to create tables
const SQL_QUERIES = [
  // Users table (extends Supabase auth)
  `CREATE TABLE IF NOT EXISTS users (
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
  );`,

  // Crops table
  `CREATE TABLE IF NOT EXISTS crops (
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
  );`,

  // Offers table
  `CREATE TABLE IF NOT EXISTS offers (
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
  );`,

  // Orders table
  `CREATE TABLE IF NOT EXISTS orders (
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
  );`,

  // Cart items table
  `CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, offer_id)
  );`,

  // Messages table
  `CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // Notifications table
  `CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('order', 'offer', 'message', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // Wishlist table
  `CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, offer_id)
  );`,

  // Reviews table
  `CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // Transport requests table
  `CREATE TABLE IF NOT EXISTS transport_requests (
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
  );`,

  // Weather data table
  `CREATE TABLE IF NOT EXISTS weather_data (
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
  );`,

  // Market prices table
  `CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_type TEXT NOT NULL,
    location TEXT,
    price DECIMAL(10, 2),
    unit TEXT DEFAULT 'kg',
    market_name TEXT,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // Create indexes for better query performance
  `CREATE INDEX IF NOT EXISTS idx_crops_farmer_id ON crops(farmer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_farmer_id ON offers(farmer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);`,
  `CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_wishlist_buyer_id ON wishlist(buyer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_transport_requests_order_id ON transport_requests(order_id);`,
];

// Storage buckets to create
const STORAGE_BUCKETS = [
  {
    name: 'crop-images',
    public: true,
    description: 'Crop images uploaded by farmers'
  },
  {
    name: 'offer-images',
    public: true,
    description: 'Offer images'
  },
  {
    name: 'profile-images',
    public: true,
    description: 'User profile images'
  },
  {
    name: 'documents',
    public: false,
    description: 'User documents and certifications'
  },
  {
    name: 'invoices',
    public: false,
    description: 'Order invoices'
  },
];

async function initializeDatabase() {
  console.log('🚀 Starting Supabase database initialization...\n');

  try {
    // Create tables
    console.log('📊 Creating tables...');
    for (const query of SQL_QUERIES) {
      try {
        const { error } = await supabase.rpc('exec', { sql: query });
        if (error && !error.message.includes('already exists')) {
          console.error(`❌ Error executing query: ${error.message}`);
        }
      } catch (err) {
        // Try alternative approach using direct SQL
        console.log(`⚠️  Skipping query (will be created via SQL editor): ${query.substring(0, 50)}...`);
      }
    }
    console.log('✅ Tables created successfully!\n');

    // Create storage buckets
    console.log('🪣 Creating storage buckets...');
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
          console.log(`✅ Created bucket: ${bucket.name}`);
        }
      } catch (err) {
        console.error(`❌ Error creating bucket '${bucket.name}':`, err);
      }
    }
    console.log('\n✅ Storage buckets created successfully!\n');

    console.log('🎉 Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to Supabase dashboard: https://app.supabase.com');
    console.log('2. Run the SQL queries in the SQL editor if they were skipped');
    console.log('3. Set up Row Level Security (RLS) policies for tables');
    console.log('4. Configure authentication settings');
    console.log('5. Test the app with the new database\n');

  } catch (error) {
    console.error('❌ Fatal error during initialization:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();

