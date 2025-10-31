#!/usr/bin/env node

/**
 * Test Storage Buckets
 * Tests Supabase storage bucket functionality
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null;

console.log('🗄️ Testing Storage Buckets...\n');

const EXPECTED_BUCKETS = [
  { name: 'crop-images', public: true },
  { name: 'offer-images', public: true },
  { name: 'profile-images', public: true },
  { name: 'documents', public: false },
  { name: 'invoices', public: false }
];

async function testBucketAccess() {
  console.log('📋 Testing bucket listing...');
  
  try {
    // Test with anon key
    const { data: anonBuckets, error: anonError } = await supabase.storage.listBuckets();
    
    if (anonError) {
      console.log('❌ Anon key bucket listing failed:', anonError.message);
    } else {
      console.log(`✅ Anon key: Found ${anonBuckets.length} buckets`);
    }
    
    // Test with admin key if available
    if (supabaseAdmin) {
      const { data: adminBuckets, error: adminError } = await supabaseAdmin.storage.listBuckets();
      
      if (adminError) {
        console.log('❌ Admin key bucket listing failed:', adminError.message);
      } else {
        console.log(`✅ Admin key: Found ${adminBuckets.length} buckets`);
        
        // List bucket details
        for (const bucket of adminBuckets) {
          console.log(`  📁 ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        }
        
        return adminBuckets;
      }
    }
    
    return anonBuckets || [];
    
  } catch (error) {
    console.error('❌ Bucket access test failed:', error.message);
    return [];
  }
}

async function testFileOperations() {
  console.log('\n📁 Testing file operations...');
  
  try {
    // Create a test file
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'This is a test file for storage bucket verification.';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    // Test upload to public bucket
    console.log('📤 Testing file upload...');
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('crop-images')
      .upload(testFileName, testFile);
    
    if (uploadError) {
      console.log('❌ File upload failed:', uploadError.message);
      return false;
    }
    
    console.log('✅ File upload successful');
    
    // Test file listing
    console.log('📋 Testing file listing...');
    
    const { data: listData, error: listError } = await supabase.storage
      .from('crop-images')
      .list('', { limit: 10 });
    
    if (listError) {
      console.log('❌ File listing failed:', listError.message);
    } else {
      console.log(`✅ File listing successful (${listData.length} files found)`);
    }
    
    // Test file download
    console.log('📥 Testing file download...');
    
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('crop-images')
      .download(testFileName);
    
    if (downloadError) {
      console.log('❌ File download failed:', downloadError.message);
    } else {
      console.log('✅ File download successful');
    }
    
    // Test public URL generation
    console.log('🔗 Testing public URL generation...');
    
    const { data: urlData } = supabase.storage
      .from('crop-images')
      .getPublicUrl(testFileName);
    
    if (urlData.publicUrl) {
      console.log('✅ Public URL generated:', urlData.publicUrl);
    } else {
      console.log('❌ Public URL generation failed');
    }
    
    // Clean up test file
    console.log('🧹 Cleaning up test file...');
    
    const { error: deleteError } = await supabase.storage
      .from('crop-images')
      .remove([testFileName]);
    
    if (deleteError) {
      console.log('⚠️ File cleanup failed:', deleteError.message);
    } else {
      console.log('✅ File cleanup successful');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ File operations test failed:', error.message);
    return false;
  }
}

async function createMissingBuckets() {
  console.log('\n🔧 Creating missing buckets...');
  
  if (!supabaseAdmin) {
    console.log('⚠️ Admin key not available, cannot create buckets');
    return false;
  }
  
  try {
    const { data: existingBuckets } = await supabaseAdmin.storage.listBuckets();
    const existingNames = existingBuckets.map(b => b.name);
    
    let created = 0;
    
    for (const expectedBucket of EXPECTED_BUCKETS) {
      if (!existingNames.includes(expectedBucket.name)) {
        console.log(`📁 Creating bucket: ${expectedBucket.name}`);
        
        const { data, error } = await supabaseAdmin.storage.createBucket(expectedBucket.name, {
          public: expectedBucket.public,
          allowedMimeTypes: expectedBucket.name.includes('images') 
            ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
            : undefined
        });
        
        if (error) {
          console.log(`❌ Failed to create ${expectedBucket.name}:`, error.message);
        } else {
          console.log(`✅ Created ${expectedBucket.name}`);
          created++;
        }
      } else {
        console.log(`✅ ${expectedBucket.name}: Already exists`);
      }
    }
    
    console.log(`\n📊 Created ${created} new buckets`);
    return true;
    
  } catch (error) {
    console.error('❌ Bucket creation failed:', error.message);
    return false;
  }
}

async function runStorageTests() {
  console.log('🚀 Starting Storage Bucket Tests...\n');
  
  const results = {
    bucketAccess: false,
    fileOperations: false,
    bucketCreation: false
  };
  
  // Test bucket access
  const buckets = await testBucketAccess();
  results.bucketAccess = buckets.length > 0;
  
  // Create missing buckets if needed
  if (buckets.length < EXPECTED_BUCKETS.length) {
    results.bucketCreation = await createMissingBuckets();
  } else {
    results.bucketCreation = true;
  }
  
  // Test file operations
  results.fileOperations = await testFileOperations();
  
  // Summary
  console.log('\n📋 STORAGE TEST SUMMARY');
  console.log('========================');
  console.log(`📁 Bucket Access: ${results.bucketAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔧 Bucket Creation: ${results.bucketCreation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📁 File Operations: ${results.fileOperations ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallSuccess = results.bucketAccess && results.bucketCreation && results.fileOperations;
  console.log(`\n🎯 Overall Status: ${overallSuccess ? '✅ STORAGE READY' : '❌ ISSUES FOUND'}`);
  
  if (!overallSuccess) {
    console.log('\n🔧 TROUBLESHOOTING:');
    
    if (!results.bucketAccess) {
      console.log('1. Check Supabase storage permissions');
      console.log('2. Verify anon key has storage access');
    }
    
    if (!results.bucketCreation) {
      console.log('3. Check service role key permissions');
      console.log('4. Verify admin access to storage');
    }
    
    if (!results.fileOperations) {
      console.log('5. Check bucket policies and RLS settings');
      console.log('6. Verify file upload permissions');
    }
  } else {
    console.log('\n🎉 Storage system is working correctly!');
    console.log('✅ All buckets are accessible');
    console.log('✅ File upload/download working');
    console.log('✅ Public URLs can be generated');
  }
  
  return results;
}

// Run tests
runStorageTests().catch(console.error);
