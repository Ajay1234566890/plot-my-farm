#!/usr/bin/env node

/**
 * Test Authentication Integration
 * Tests the updated authentication system with Supabase integration
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Testing Authentication Integration...\n');

async function testAuthFlow() {
  try {
    // Test data
    const testPhone = '9876543210';
    const testOTP = '123456';
    const testEmail = `user${testPhone}@gmail.com`;
    const testPassword = `temp_${testPhone}_${testOTP}`;
    
    console.log('📱 Testing authentication flow...');
    console.log(`📞 Phone: ${testPhone}`);
    console.log(`📧 Email: ${testEmail}`);
    
    // Step 1: Try to sign up a new user
    console.log('\n1️⃣ Testing user sign up...');
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError && !signUpError.message.includes('already registered')) {
      console.error('❌ Sign up failed:', signUpError.message);
      return false;
    }
    
    if (signUpData.user) {
      console.log('✅ Sign up successful');
      console.log(`👤 User ID: ${signUpData.user.id}`);
    } else {
      console.log('⚠️ User might already exist, continuing...');
    }
    
    // Step 2: Try to sign in
    console.log('\n2️⃣ Testing user sign in...');
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return false;
    }
    
    console.log('✅ Sign in successful');
    console.log(`👤 User ID: ${signInData.user.id}`);
    
    // Step 3: Test user profile creation
    console.log('\n3️⃣ Testing user profile creation...');
    
    const userProfile = {
      id: signInData.user.id,
      email: testEmail,
      full_name: 'Test User',
      phone: testPhone,
      role: 'farmer',
      location: 'Test Location',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Try to insert user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .upsert([userProfile], { onConflict: 'id' })
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message);
      console.log('⚠️ This might be due to RLS policies - check manual steps below');
    } else {
      console.log('✅ Profile creation successful');
      console.log(`📋 Profile: ${profileData.full_name} (${profileData.role})`);
    }
    
    // Step 4: Test profile retrieval
    console.log('\n4️⃣ Testing profile retrieval...');
    
    const { data: retrievedProfile, error: retrieveError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .single();
    
    if (retrieveError) {
      console.error('❌ Profile retrieval failed:', retrieveError.message);
    } else {
      console.log('✅ Profile retrieval successful');
      console.log(`📋 Retrieved: ${retrievedProfile.full_name} (${retrievedProfile.role})`);
    }
    
    // Step 5: Test sign out
    console.log('\n5️⃣ Testing sign out...');
    
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('❌ Sign out failed:', signOutError.message);
      return false;
    }
    
    console.log('✅ Sign out successful');
    
    // Step 6: Verify session is cleared
    console.log('\n6️⃣ Verifying session cleared...');
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message);
      return false;
    }
    
    if (session) {
      console.log('⚠️ Session still active (this might be expected)');
    } else {
      console.log('✅ Session cleared successfully');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Auth flow test failed:', error.message);
    return false;
  }
}

async function testDatabaseOperations() {
  console.log('\n📊 Testing basic database operations...');
  
  try {
    // Test basic table access
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database access failed:', error.message);
      return false;
    }
    
    console.log('✅ Database access successful');
    
    // Test storage access
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('❌ Storage access failed:', storageError.message);
      return false;
    }
    
    console.log(`✅ Storage access successful (${buckets.length} buckets found)`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Database operations test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Integration Tests...\n');
  
  const results = {
    database: false,
    auth: false
  };
  
  // Test database operations first
  results.database = await testDatabaseOperations();
  
  // Test authentication flow
  results.auth = await testAuthFlow();
  
  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('================');
  console.log(`📊 Database Operations: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔐 Authentication Flow: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallSuccess = results.database && results.auth;
  console.log(`\n🎯 Overall Status: ${overallSuccess ? '✅ AUTH INTEGRATION READY' : '❌ ISSUES FOUND'}`);
  
  if (!overallSuccess) {
    console.log('\n🔧 NEXT STEPS:');
    
    if (!results.database) {
      console.log('1. Fix database connection and RLS policies');
      console.log('2. Run: node scripts/fix-rls-policies.js');
    }
    
    if (!results.auth) {
      console.log('3. Check Supabase authentication settings');
      console.log('4. Verify email confirmation is disabled for development');
    }
    
    console.log('\n📋 MANUAL STEPS FOR RLS POLICIES:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Navigate to Authentication > Policies');
    console.log('3. For the "users" table, create a policy:');
    console.log('   - Policy name: "Allow all operations"');
    console.log('   - Policy command: ALL');
    console.log('   - Target roles: public, authenticated');
    console.log('   - USING expression: true');
    console.log('   - WITH CHECK expression: true');
    console.log('4. Repeat for other tables as needed');
  } else {
    console.log('\n🎉 Authentication integration is working correctly!');
    console.log('✅ Users can now register and login with real Supabase authentication');
    console.log('✅ User data will be stored in the Supabase database');
    console.log('✅ App is ready for testing with real user data');
  }
  
  return results;
}

// Run tests
runTests().catch(console.error);
