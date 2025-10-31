#!/usr/bin/env node

/**
 * Supabase Setup using REST API
 * Uses Supabase REST API with service role key for database and storage setup
 */

require('dotenv').config();
const https = require('https');
const { URL } = require('url');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Helper function to make HTTPS requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// SQL queries split into smaller chunks for reliability
const SQL_QUERIES = [
  // Extensions
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  
  // Users table
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

  // Indexes
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

  // Enable RLS
  `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE crops ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE offers ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE orders ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE messages ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;`,
];

// RLS Policies
const RLS_POLICIES = [
  { table: 'users', policy: 'Users can view their own profile', definition: 'auth.uid() = id', operation: 'SELECT' },
  { table: 'users', policy: 'Users can update their own profile', definition: 'auth.uid() = id', operation: 'UPDATE' },
  { table: 'crops', policy: 'Farmers can view all crops', definition: 'true', operation: 'SELECT' },
  { table: 'crops', policy: 'Farmers can create crops', definition: 'auth.uid() = farmer_id', operation: 'INSERT' },
  { table: 'crops', policy: 'Farmers can update their own crops', definition: 'auth.uid() = farmer_id', operation: 'UPDATE' },
  { table: 'crops', policy: 'Farmers can delete their own crops', definition: 'auth.uid() = farmer_id', operation: 'DELETE' },
  { table: 'offers', policy: 'Everyone can view offers', definition: 'true', operation: 'SELECT' },
  { table: 'offers', policy: 'Farmers can create offers', definition: 'auth.uid() = farmer_id', operation: 'INSERT' },
  { table: 'offers', policy: 'Farmers can update their own offers', definition: 'auth.uid() = farmer_id', operation: 'UPDATE' },
  { table: 'offers', policy: 'Farmers can delete their own offers', definition: 'auth.uid() = farmer_id', operation: 'DELETE' },
  { table: 'orders', policy: 'Users can view their own orders', definition: 'auth.uid() = buyer_id OR auth.uid() = farmer_id', operation: 'SELECT' },
  { table: 'orders', policy: 'Buyers can create orders', definition: 'auth.uid() = buyer_id', operation: 'INSERT' },
  { table: 'orders', policy: 'Users can update their own orders', definition: 'auth.uid() = buyer_id OR auth.uid() = farmer_id', operation: 'UPDATE' },
  { table: 'cart_items', policy: 'Users can view their own cart', definition: 'auth.uid() = buyer_id', operation: 'SELECT' },
  { table: 'cart_items', policy: 'Users can manage their own cart', definition: 'auth.uid() = buyer_id', operation: 'INSERT' },
  { table: 'cart_items', policy: 'Users can update their own cart', definition: 'auth.uid() = buyer_id', operation: 'UPDATE' },
  { table: 'cart_items', policy: 'Users can delete from their own cart', definition: 'auth.uid() = buyer_id', operation: 'DELETE' },
  { table: 'messages', policy: 'Users can view their messages', definition: 'auth.uid() = sender_id OR auth.uid() = receiver_id', operation: 'SELECT' },
  { table: 'messages', policy: 'Users can send messages', definition: 'auth.uid() = sender_id', operation: 'INSERT' },
  { table: 'notifications', policy: 'Users can view their notifications', definition: 'auth.uid() = user_id', operation: 'SELECT' },
  { table: 'wishlist', policy: 'Users can view their wishlist', definition: 'auth.uid() = buyer_id', operation: 'SELECT' },
  { table: 'wishlist', policy: 'Users can manage their wishlist', definition: 'auth.uid() = buyer_id', operation: 'INSERT' },
  { table: 'wishlist', policy: 'Users can delete from wishlist', definition: 'auth.uid() = buyer_id', operation: 'DELETE' },
  { table: 'reviews', policy: 'Everyone can view reviews', definition: 'true', operation: 'SELECT' },
  { table: 'reviews', policy: 'Users can create reviews', definition: 'auth.uid() = reviewer_id', operation: 'INSERT' },
  { table: 'weather_data', policy: 'Everyone can view weather data', definition: 'true', operation: 'SELECT' },
  { table: 'market_prices', policy: 'Everyone can view market prices', definition: 'true', operation: 'SELECT' },
];

// Storage buckets
const STORAGE_BUCKETS = [
  { name: 'crop-images', public: true },
  { name: 'offer-images', public: true },
  { name: 'profile-images', public: true },
  { name: 'documents', public: false },
  { name: 'invoices', public: false },
];

async function executeSQLQueries() {
  console.log('📊 Executing SQL queries...\n');
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < SQL_QUERIES.length; i++) {
    const query = SQL_QUERIES[i];
    try {
      const response = await makeRequest('POST', '/rest/v1/rpc/exec', { sql: query });
      
      if (response.status === 200 || response.status === 201) {
        successCount++;
        process.stdout.write('.');
      } else {
        errorCount++;
        process.stdout.write('⚠');
      }
    } catch (err) {
      errorCount++;
      process.stdout.write('✗');
    }
    
    if ((i + 1) % 50 === 0) console.log(` ${i + 1}/${SQL_QUERIES.length}`);
  }

  console.log(`\n✅ SQL execution complete! (${successCount} successful, ${errorCount} errors)\n`);
}

async function createStorageBuckets() {
  console.log('🪣 Creating storage buckets...\n');
  
  for (const bucket of STORAGE_BUCKETS) {
    try {
      const response = await makeRequest('POST', '/storage/v1/bucket', {
        name: bucket.name,
        public: bucket.public,
      });

      if (response.status === 200 || response.status === 201) {
        console.log(`✅ Created bucket: ${bucket.name} (public: ${bucket.public})`);
      } else if (response.data?.message?.includes('already exists')) {
        console.log(`⏭️  Bucket '${bucket.name}' already exists`);
      } else {
        console.error(`❌ Error creating bucket '${bucket.name}':`, response.data?.message || response.status);
      }
    } catch (err) {
      console.error(`❌ Error creating bucket '${bucket.name}':`, err.message);
    }
  }
  
  console.log('\n');
}

async function main() {
  console.log('🚀 Starting Supabase Setup with REST API\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

  try {
    // Execute SQL queries
    await executeSQLQueries();

    // Create storage buckets
    await createStorageBuckets();

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

