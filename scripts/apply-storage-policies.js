#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function applyStoragePolicies() {
  console.log('🔐 Applying Storage RLS Policies...\n');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'setup-storage-rls-policies.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split into individual statements (basic splitting)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec', { 
          sql: statement + ';' 
        });
        
        if (error) {
          console.log(`❌ Error in statement ${i + 1}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.log(`❌ Error in statement ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 EXECUTION SUMMARY');
    console.log('====================');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total: ${successCount + errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 All storage policies applied successfully!');
      console.log('✅ Storage buckets should now be accessible');
      console.log('✅ File upload/download should work');
      
      console.log('\n🧪 Test the storage system:');
      console.log('npm run test:storage');
    } else {
      console.log('\n⚠️ Some policies failed to apply');
      console.log('You may need to apply them manually via Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ Failed to apply storage policies:', error.message);
    console.log('\n📋 MANUAL SETUP REQUIRED');
    console.log('========================');
    console.log('Apply the policies manually:');
    console.log('1. Go to https://app.supabase.com/project/dlwbvoqowqiugyjdfyax');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of scripts/setup-storage-rls-policies.sql');
    console.log('4. Click "Run" to execute all policies');
  }
}

async function testStorageAccess() {
  console.log('\n🧪 Testing storage access after policy application...\n');
  
  try {
    // Test bucket listing
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Bucket listing failed:', bucketError.message);
      return false;
    }
    
    console.log(`✅ Found ${buckets.length} buckets`);
    
    // Test file upload to public bucket
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test file for storage policy verification';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('crop-images')
      .upload(testFileName, testFile);
    
    if (uploadError) {
      console.log('❌ File upload test failed:', uploadError.message);
      return false;
    }
    
    console.log('✅ File upload test successful');
    
    // Clean up test file
    await supabase.storage
      .from('crop-images')
      .remove([testFileName]);
    
    console.log('✅ Storage system is working correctly!');
    return true;
    
  } catch (error) {
    console.log('❌ Storage test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Storage RLS Policy Setup\n');
  
  await applyStoragePolicies();
  
  // Wait a moment for policies to take effect
  console.log('\n⏳ Waiting for policies to take effect...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await testStorageAccess();
}

// Run the script
main().catch(console.error);
