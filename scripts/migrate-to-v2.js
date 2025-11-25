/**
 * Automated Database Migration Script
 * Migrates from old schema to V2 schema with dedicated buyer/farmer tables
 * 
 * Usage: node scripts/migrate-to-v2.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  console.error('\nPlease add these to your .env file:');
  console.error('EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

async function executeSQLFile(sqlContent) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  
  console.log('📤 Sending SQL to Supabase...\n');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ query: sqlContent })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function migrateDatabase() {
  console.log('🚀 Starting Database Migration to V2 Schema\n');
  console.log('='.repeat(70));
  console.log('This will:');
  console.log('  1. Drop existing policies to avoid conflicts');
  console.log('  2. Create new tables with buyer/farmer prefixes');
  console.log('  3. Set up RLS policies');
  console.log('  4. Create indexes for performance');
  console.log('='.repeat(70));
  console.log('\n⚠️  WARNING: This is a destructive operation!');
  console.log('   Make sure you have backed up your data.\n');

  // Read the schema file
  const schemaPath = path.join(__dirname, 'supabase-schema-v2.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
  console.log(`📄 Schema file loaded: ${(schemaSQL.length / 1024).toFixed(2)} KB\n`);

  // Since Supabase doesn't have a built-in exec_sql function,
  // we'll provide instructions for manual execution
  console.log('📋 MIGRATION INSTRUCTIONS:\n');
  console.log('1. Open your Supabase Dashboard:');
  console.log(`   ${SUPABASE_URL.replace('/rest/v1', '')}\n`);
  console.log('2. Navigate to: SQL Editor > New Query\n');
  console.log('3. Copy the entire contents of:');
  console.log(`   ${schemaPath}\n`);
  console.log('4. Paste into the SQL Editor\n');
  console.log('5. Click "Run" to execute\n');
  console.log('='.repeat(70));
  console.log('\n✅ The schema file is ready at:');
  console.log(`   ${schemaPath}\n`);
  
  // Count what will be created
  const tables = (schemaSQL.match(/CREATE TABLE/gi) || []).length;
  const indexes = (schemaSQL.match(/CREATE INDEX/gi) || []).length;
  const policies = (schemaSQL.match(/CREATE POLICY/gi) || []).length;
  
  console.log('📊 What will be created:');
  console.log(`   • ${tables} Tables`);
  console.log(`   • ${indexes} Indexes`);
  console.log(`   • ${policies} RLS Policies\n`);
  
  console.log('📦 New Tables:');
  console.log('   ✅ farmer_crops');
  console.log('   ✅ farmer_offers');
  console.log('   ✅ buyer_purchase_requests (NEW)');
  console.log('   ✅ farmer_request_responses (NEW)');
  console.log('   ✅ buyer_cart_items');
  console.log('   ✅ buyer_wishlist');
  console.log('   ✅ buyer_saved_farmers (NEW)');
  console.log('   ✅ farmer_saved_buyers (NEW)');
  console.log('   ✅ orders (updated)');
  console.log('   ✅ messages, notifications, reviews (unchanged)');
  console.log('   ✅ transport_requests, weather_data, market_prices (unchanged)\n');
  
  console.log('🔄 After running the migration:');
  console.log('   1. Services have been updated to use new table names');
  console.log('   2. Test all CRUD operations');
  console.log('   3. Migrate existing data if needed\n');
  
  console.log('✨ Migration preparation complete!');
  console.log('   Follow the instructions above to apply the schema.\n');
}

// Run the migration
migrateDatabase().catch(error => {
  console.error('\n❌ Migration failed:');
  console.error(error.message);
  process.exit(1);
});

