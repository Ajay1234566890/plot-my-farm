#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests Supabase connection, database tables, and basic CRUD operations
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Database Connection...\n');

// Check environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null;

// Expected tables
const EXPECTED_TABLES = [
  'users',
  'crops',
  'offers',
  'orders',
  'cart_items',
  'messages',
  'notifications',
  'wishlist',
  'reviews',
  'transport_requests',
  'weather_data',
  'market_prices'
];

// Expected storage buckets
const EXPECTED_BUCKETS = [
  'crop-images',
  'offer-images',
  'profile-images',
  'documents',
  'invoices'
];

async function testConnection() {
  try {
    console.log('\n🔗 Testing basic connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function testTables() {
  console.log('\n📊 Testing database tables...');
  
  const results = [];
  
  for (const table of EXPECTED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        results.push({ table, status: 'error', error: error.message });
      } else {
        console.log(`✅ ${table}: Table exists and accessible`);
        results.push({ table, status: 'success', rowCount: data?.length || 0 });
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
      results.push({ table, status: 'error', error: error.message });
    }
  }
  
  return results;
}

async function testStorage() {
  console.log('\n📁 Testing storage buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Storage test failed:', error.message);
      return [];
    }
    
    console.log(`✅ Found ${buckets.length} storage buckets`);
    
    const results = [];
    for (const expectedBucket of EXPECTED_BUCKETS) {
      const bucket = buckets.find(b => b.name === expectedBucket);
      if (bucket) {
        console.log(`✅ ${expectedBucket}: Exists (${bucket.public ? 'public' : 'private'})`);
        results.push({ bucket: expectedBucket, status: 'exists', public: bucket.public });
      } else {
        console.log(`❌ ${expectedBucket}: Missing`);
        results.push({ bucket: expectedBucket, status: 'missing' });
      }
    }
    
    return results;
  } catch (error) {
    console.error('❌ Storage test failed:', error.message);
    return [];
  }
}

async function testCRUDOperations() {
  console.log('\n🔄 Testing CRUD operations...');
  
  try {
    // First create a Supabase auth user to satisfy foreign key constraint
    console.log('🔐 Creating auth user for testing...');
    const testEmail = `test${Date.now()}@gmail.com`;
    const testPassword = 'test123456';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.log(`❌ Auth user creation failed: ${authError.message}`);
      return false;
    }

    if (!authData.user) {
      console.log('❌ No auth user returned');
      return false;
    }

    console.log('✅ Auth user created');

    // Test INSERT with valid auth user ID
    console.log('📝 Testing INSERT operation...');
    const testUser = {
      id: authData.user.id, // Use actual auth user ID
      email: testEmail,
      full_name: 'Test User',
      phone: '1234567890',
      role: 'farmer',
      location: 'Test Location'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    if (insertError) {
      console.log(`❌ INSERT failed: ${insertError.message}`);
      console.log('Error details:', insertError);
      return false;
    }

    console.log('✅ INSERT successful');
    
    // Test SELECT
    console.log('📖 Testing SELECT operation...');
    const { data: selectData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testUser.email)
      .single();
    
    if (selectError) {
      console.log(`❌ SELECT failed: ${selectError.message}`);
      return false;
    }
    
    console.log('✅ SELECT successful');
    
    // Test UPDATE
    console.log('✏️ Testing UPDATE operation...');
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ full_name: 'Updated Test User' })
      .eq('email', testUser.email)
      .select();
    
    if (updateError) {
      console.log(`❌ UPDATE failed: ${updateError.message}`);
      return false;
    }
    
    console.log('✅ UPDATE successful');
    
    // Test DELETE
    console.log('🗑️ Testing DELETE operation...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', testUser.id);

    if (deleteError) {
      console.log(`❌ DELETE failed: ${deleteError.message}`);
      return false;
    }

    console.log('✅ DELETE successful');

    // Clean up auth user
    console.log('🧹 Cleaning up auth user...');
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.log('⚠️ Sign out warning:', signOutError.message);
    }

    console.log('✅ All CRUD operations working correctly');

    return true;
  } catch (error) {
    console.error('❌ CRUD test failed:', error.message);
    return false;
  }
}

async function testAuthentication() {
  console.log('\n🔐 Testing authentication...');
  
  try {
    // Test getting current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log(`❌ Auth session test failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Auth session test successful');
    console.log(`📊 Current session: ${session ? 'Active' : 'None'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive database tests...\n');
  
  const results = {
    connection: false,
    tables: [],
    storage: [],
    crud: false,
    auth: false
  };
  
  // Test connection
  results.connection = await testConnection();
  
  if (!results.connection) {
    console.log('\n❌ Connection failed. Stopping tests.');
    return results;
  }
  
  // Test tables
  results.tables = await testTables();
  
  // Test storage
  results.storage = await testStorage();
  
  // Test CRUD operations
  results.crud = await testCRUDOperations();
  
  // Test authentication
  results.auth = await testAuthentication();
  
  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('================');
  console.log(`🔗 Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📊 Tables: ${results.tables.filter(t => t.status === 'success').length}/${EXPECTED_TABLES.length} working`);
  console.log(`📁 Storage: ${results.storage.filter(s => s.status === 'exists').length}/${EXPECTED_BUCKETS.length} buckets found`);
  console.log(`🔄 CRUD Operations: ${results.crud ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔐 Authentication: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallSuccess = results.connection && results.crud && results.auth;
  console.log(`\n🎯 Overall Status: ${overallSuccess ? '✅ DATABASE READY' : '❌ ISSUES FOUND'}`);
  
  if (!overallSuccess) {
    console.log('\n🔧 NEXT STEPS:');
    if (!results.connection) {
      console.log('1. Check your Supabase URL and API keys');
      console.log('2. Verify your Supabase project is active');
    }
    if (!results.crud) {
      console.log('3. Run database setup script: npm run setup:supabase');
      console.log('4. Check Row Level Security (RLS) policies');
    }
    if (!results.auth) {
      console.log('5. Check authentication configuration');
    }
  }
  
  return results;
}

// Run tests
runAllTests().catch(console.error);
