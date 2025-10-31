#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null;

console.log('🧪 Simple Storage Test\n');

async function testStorageAccess() {
  console.log('📋 Testing storage access...\n');
  
  // Test with anon key
  console.log('🔑 Testing with Anonymous Key:');
  try {
    const { data: anonBuckets, error: anonError } = await supabase.storage.listBuckets();
    
    if (anonError) {
      console.log(`❌ Anon key error: ${anonError.message}`);
    } else {
      console.log(`✅ Anon key: Found ${anonBuckets.length} buckets`);
      anonBuckets.forEach(bucket => {
        console.log(`   📁 ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
  } catch (error) {
    console.log(`❌ Anon key exception: ${error.message}`);
  }
  
  console.log('');
  
  // Test with service role key
  if (supabaseAdmin) {
    console.log('🔑 Testing with Service Role Key:');
    try {
      const { data: adminBuckets, error: adminError } = await supabaseAdmin.storage.listBuckets();
      
      if (adminError) {
        console.log(`❌ Admin key error: ${adminError.message}`);
      } else {
        console.log(`✅ Admin key: Found ${adminBuckets.length} buckets`);
        adminBuckets.forEach(bucket => {
          console.log(`   📁 ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });
      }
    } catch (error) {
      console.log(`❌ Admin key exception: ${error.message}`);
    }
  } else {
    console.log('⚠️ No service role key available');
  }
}

async function testFileUpload() {
  console.log('\n📤 Testing file upload...\n');
  
  const testFileName = `test-${Date.now()}.txt`;
  const testContent = 'Simple storage test file';
  const testFile = new Blob([testContent], { type: 'text/plain' });
  
  // Test with anon key
  console.log('🔑 Upload test with Anonymous Key:');
  try {
    const { data: anonUpload, error: anonUploadError } = await supabase.storage
      .from('crop-images')
      .upload(testFileName, testFile);
    
    if (anonUploadError) {
      console.log(`❌ Anon upload failed: ${anonUploadError.message}`);
    } else {
      console.log(`✅ Anon upload successful: ${anonUpload.path}`);
      
      // Clean up
      await supabase.storage.from('crop-images').remove([testFileName]);
      console.log(`🧹 Cleaned up test file`);
    }
  } catch (error) {
    console.log(`❌ Anon upload exception: ${error.message}`);
  }
  
  console.log('');
  
  // Test with service role key
  if (supabaseAdmin) {
    console.log('🔑 Upload test with Service Role Key:');
    const adminTestFileName = `admin-test-${Date.now()}.txt`;
    
    try {
      const { data: adminUpload, error: adminUploadError } = await supabaseAdmin.storage
        .from('crop-images')
        .upload(adminTestFileName, testFile);
      
      if (adminUploadError) {
        console.log(`❌ Admin upload failed: ${adminUploadError.message}`);
      } else {
        console.log(`✅ Admin upload successful: ${adminUpload.path}`);
        
        // Clean up
        await supabaseAdmin.storage.from('crop-images').remove([adminTestFileName]);
        console.log(`🧹 Cleaned up admin test file`);
      }
    } catch (error) {
      console.log(`❌ Admin upload exception: ${error.message}`);
    }
  }
}

async function main() {
  await testStorageAccess();
  await testFileUpload();
  
  console.log('\n📋 SUMMARY');
  console.log('==========');
  console.log('If you see:');
  console.log('✅ Admin key finds buckets BUT anon key finds 0 → RLS blocking anon access');
  console.log('✅ Admin uploads work BUT anon uploads fail → RLS blocking anon operations');
  console.log('❌ Both fail → Deeper configuration issue');
  console.log('');
  console.log('💡 SOLUTION:');
  console.log('1. Try creating storage policies via Supabase Dashboard UI');
  console.log('2. Go to Storage → Policies in dashboard');
  console.log('3. Create policies for storage.objects table');
  console.log('4. If that fails, we may need a different approach');
}

main().catch(console.error);
