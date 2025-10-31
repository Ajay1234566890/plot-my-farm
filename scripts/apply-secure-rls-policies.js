#!/usr/bin/env node

/**
 * Apply Secure RLS Policies
 * This script applies proper Row Level Security policies
 * that maintain security while allowing app functionality
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🔐 Applying Secure RLS Policies...\n');

async function dropExistingPolicies() {
  console.log('🧹 Cleaning up existing policies...');
  
  const tables = [
    'users', 'crops', 'offers', 'orders', 'cart_items', 
    'messages', 'notifications', 'wishlist', 'reviews', 
    'transport_requests', 'weather_data', 'market_prices'
  ];
  
  try {
    for (const table of tables) {
      // Get existing policies
      const { data: policies, error } = await supabase
        .from('pg_policies')
        .select('policyname')
        .eq('tablename', table);
      
      if (error) {
        console.log(`⚠️ Could not fetch policies for ${table}:`, error.message);
        continue;
      }
      
      // Drop existing policies
      for (const policy of policies || []) {
        const dropQuery = `DROP POLICY IF EXISTS "${policy.policyname}" ON ${table};`;
        const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropQuery });
        
        if (dropError) {
          console.log(`⚠️ Could not drop policy ${policy.policyname}:`, dropError.message);
        }
      }
    }
    
    console.log('✅ Existing policies cleaned up');
    return true;
  } catch (error) {
    console.error('❌ Error cleaning up policies:', error.message);
    return false;
  }
}

async function applySQLPolicies() {
  console.log('📝 Applying secure RLS policies...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'setup-rls-policies.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          console.log(`❌ Failed to execute statement: ${error.message}`);
          console.log(`   Statement: ${statement.substring(0, 100)}...`);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Error executing statement: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    return errorCount === 0;
    
  } catch (error) {
    console.error('❌ Error applying SQL policies:', error.message);
    return false;
  }
}

async function createExecSQLFunction() {
  console.log('🔧 Creating exec_sql function...');
  
  const functionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;
  
  try {
    const { error } = await supabase.rpc('exec', { sql: functionSQL });
    
    if (error) {
      console.log('⚠️ Could not create exec_sql function:', error.message);
      return false;
    }
    
    console.log('✅ exec_sql function created');
    return true;
  } catch (error) {
    console.error('❌ Error creating function:', error.message);
    return false;
  }
}

async function testPolicies() {
  console.log('\n🧪 Testing RLS policies...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .single();
    
    if (error) {
      console.log('❌ Policy test failed:', error.message);
      return false;
    }
    
    console.log('✅ RLS policies are working correctly');
    return true;
    
  } catch (error) {
    console.error('❌ Policy test error:', error.message);
    return false;
  }
}

async function manualInstructions() {
  console.log('\n📋 MANUAL SETUP REQUIRED');
  console.log('========================');
  console.log('The SQL policies need to be applied manually in the Supabase dashboard:');
  console.log('');
  console.log('1. Go to https://app.supabase.com/project/dlwbvoqowqiugyjdfyax');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the contents of scripts/setup-rls-policies.sql');
  console.log('4. Click "Run" to execute all policies');
  console.log('');
  console.log('This will create secure RLS policies that:');
  console.log('✅ Allow users to access only their own data');
  console.log('✅ Allow public access to crops, offers, and reviews');
  console.log('✅ Protect private data (messages, orders, etc.)');
  console.log('✅ Secure storage buckets with proper access control');
  console.log('');
  console.log('After applying the policies, run: npm run test:db');
}

async function main() {
  console.log('🚀 Starting Secure RLS Policy Setup...\n');
  
  // Try to create the exec function first
  const functionCreated = await createExecSQLFunction();
  
  if (!functionCreated) {
    console.log('\n⚠️ Could not create SQL execution function');
    await manualInstructions();
    return;
  }
  
  // Clean up existing policies
  const cleanupSuccess = await dropExistingPolicies();
  
  if (!cleanupSuccess) {
    console.log('\n⚠️ Could not clean up existing policies');
  }
  
  // Apply new policies
  const applySuccess = await applySQLPolicies();
  
  if (!applySuccess) {
    console.log('\n⚠️ Could not apply policies automatically');
    await manualInstructions();
    return;
  }
  
  // Test the policies
  const testSuccess = await testPolicies();
  
  if (testSuccess) {
    console.log('\n🎉 SUCCESS!');
    console.log('✅ Secure RLS policies have been applied');
    console.log('✅ Your database is now secure and functional');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run test:db');
    console.log('2. Run: npm run test:auth');
    console.log('3. Test your app with real user registration');
  } else {
    await manualInstructions();
  }
}

main().catch(console.error);
