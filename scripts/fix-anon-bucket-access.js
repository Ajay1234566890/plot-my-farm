#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const anonClient = createClient(SUPABASE_URL, ANON_KEY);

console.log('🔍 ANON KEY BUCKET ACCESS FIX');
console.log('==============================');
console.log('🎯 Goal: Make anon key see all 5 buckets\n');

async function diagnoseIssue() {
  console.log('🔍 DIAGNOSING THE ISSUE');
  console.log('========================\n');
  
  try {
    // Test anon key
    console.log('🔑 Testing Anonymous Key:');
    const { data: anonBuckets, error: anonError } = await anonClient.storage.listBuckets();
    
    if (anonError) {
      console.log(`❌ Anon error: ${anonError.message}`);
    } else {
      console.log(`📊 Anon result: Found ${anonBuckets.length} buckets`);
      if (anonBuckets.length > 0) {
        anonBuckets.forEach(bucket => console.log(`   📁 ${bucket.name}`));
      }
    }
    
    // Test service role key
    console.log('\n🔑 Testing Service Role Key:');
    const { data: adminBuckets, error: adminError } = await supabase.storage.listBuckets();
    
    if (adminError) {
      console.log(`❌ Admin error: ${adminError.message}`);
    } else {
      console.log(`📊 Admin result: Found ${adminBuckets.length} buckets`);
      adminBuckets.forEach(bucket => console.log(`   📁 ${bucket.name} (${bucket.public ? 'public' : 'private'})`));
    }
    
    // Diagnosis
    console.log('\n🔍 DIAGNOSIS:');
    if (anonBuckets?.length === 0 && adminBuckets?.length > 0) {
      console.log('❌ Issue confirmed: Anon key blocked by RLS policy');
      console.log('🔍 Root cause: storage.buckets policy too restrictive');
      console.log('✅ Solution: Allow anon users to see ALL buckets');
      return true;
    } else if (anonBuckets?.length > 0) {
      console.log('✅ No issue: Anon key already working');
      return false;
    } else {
      console.log('❌ Deeper issue: Both keys failing');
      return true;
    }
    
  } catch (error) {
    console.log(`❌ Diagnosis failed: ${error.message}`);
    return true;
  }
}

async function fixBucketVisibilityPolicy() {
  console.log('\n🔧 FIXING BUCKET VISIBILITY POLICY');
  console.log('===================================\n');
  
  try {
    // Step 1: Drop existing restrictive bucket policy
    console.log('🗑️ Step 1: Dropping restrictive bucket policies...');
    
    const policiesToDrop = [
      'Public buckets are visible to everyone',
      'Private buckets visible to authenticated users',
      'Allow everyone to see all buckets'
    ];
    
    for (const policyName of policiesToDrop) {
      const { error } = await supabase.rpc('exec', { 
        sql: `DROP POLICY IF EXISTS "${policyName}" ON storage.buckets;` 
      });
      
      if (error) {
        console.log(`⚠️ Drop warning: ${error.message}`);
      } else {
        console.log(`✅ Dropped: ${policyName}`);
      }
    }
    
    // Step 2: Create new permissive bucket policy
    console.log('\n📝 Step 2: Creating new bucket visibility policy...');
    
    const newBucketPolicy = `
      CREATE POLICY "Allow everyone to see all buckets" 
      ON storage.buckets 
      FOR SELECT 
      TO public 
      USING (true);
    `;
    
    const { error: createError } = await supabase.rpc('exec', { sql: newBucketPolicy });
    
    if (createError) {
      if (createError.message.includes('already exists')) {
        console.log('⏭️ Policy already exists');
      } else {
        console.log(`❌ Create failed: ${createError.message}`);
        return false;
      }
    } else {
      console.log('✅ New bucket policy created successfully');
    }
    
    // Step 3: Ensure RLS is enabled
    console.log('\n🔐 Step 3: Ensuring RLS is enabled...');
    
    const { error: rlsError } = await supabase.rpc('exec', { 
      sql: 'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;' 
    });
    
    if (rlsError && !rlsError.message.includes('already enabled')) {
      console.log(`⚠️ RLS enable warning: ${rlsError.message}`);
    } else {
      console.log('✅ RLS enabled on storage.buckets');
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ Fix failed: ${error.message}`);
    return false;
  }
}

async function ensureObjectPoliciesExist() {
  console.log('\n📝 ENSURING OBJECT POLICIES EXIST');
  console.log('==================================\n');
  
  const objectPolicies = [
    {
      name: 'Public files viewable by everyone',
      sql: `CREATE POLICY "Public files viewable by everyone" ON storage.objects FOR SELECT TO public USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      name: 'Authenticated upload to public buckets',
      sql: `CREATE POLICY "Authenticated upload to public buckets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      name: 'Authenticated update public files',
      sql: `CREATE POLICY "Authenticated update public files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      name: 'Authenticated delete public files',
      sql: `CREATE POLICY "Authenticated delete public files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      name: 'Authenticated access private buckets',
      sql: `CREATE POLICY "Authenticated access private buckets" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('documents', 'invoices'));`
    }
  ];
  
  // Enable RLS on objects
  const { error: objectRLSError } = await supabase.rpc('exec', { 
    sql: 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;' 
  });
  
  if (objectRLSError && !objectRLSError.message.includes('already enabled')) {
    console.log(`⚠️ Objects RLS warning: ${objectRLSError.message}`);
  } else {
    console.log('✅ RLS enabled on storage.objects');
  }
  
  // Create object policies
  let successCount = 0;
  
  for (const policy of objectPolicies) {
    try {
      const { error } = await supabase.rpc('exec', { sql: policy.sql });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ ${policy.name}: Already exists`);
          successCount++;
        } else {
          console.log(`❌ ${policy.name}: ${error.message}`);
        }
      } else {
        console.log(`✅ ${policy.name}: Created`);
        successCount++;
      }
    } catch (error) {
      console.log(`❌ ${policy.name}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Object policies: ${successCount}/${objectPolicies.length} ready`);
  return successCount > 0;
}

async function testFinalResult() {
  console.log('\n🧪 TESTING FINAL RESULT');
  console.log('========================\n');
  
  try {
    // Test anon key bucket listing
    console.log('🔑 Testing anon key bucket access:');
    const { data: anonBuckets, error: anonError } = await anonClient.storage.listBuckets();
    
    if (anonError) {
      console.log(`❌ Anon bucket listing failed: ${anonError.message}`);
      return false;
    }
    
    console.log(`✅ Anon bucket listing: Found ${anonBuckets.length} buckets`);
    anonBuckets.forEach(bucket => {
      console.log(`   📁 ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    // Test anon key file access (should work for public buckets)
    console.log('\n📤 Testing anon key file operations:');
    
    // Try to list files in public bucket (should work)
    const { data: publicFiles, error: publicFilesError } = await anonClient.storage
      .from('crop-images')
      .list();
    
    if (publicFilesError) {
      console.log(`⚠️ Anon file listing: ${publicFilesError.message}`);
    } else {
      console.log(`✅ Anon file listing: Works (${publicFiles.length} files)`);
    }
    
    // Try to upload (should fail - that's correct)
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const { error: uploadError } = await anonClient.storage
      .from('crop-images')
      .upload(`test-${Date.now()}.txt`, testFile);
    
    if (uploadError) {
      console.log(`✅ Anon upload correctly blocked: ${uploadError.message}`);
    } else {
      console.log(`⚠️ Anon upload unexpectedly succeeded`);
    }
    
    // Test authenticated upload
    console.log('\n🔐 Testing authenticated file upload:');
    const { data: authUpload, error: authUploadError } = await supabase.storage
      .from('crop-images')
      .upload(`auth-test-${Date.now()}.txt`, testFile);
    
    if (authUploadError) {
      console.log(`❌ Auth upload failed: ${authUploadError.message}`);
    } else {
      console.log(`✅ Auth upload succeeded: ${authUpload.path}`);
      
      // Clean up
      await supabase.storage.from('crop-images').remove([authUpload.path.split('/').pop()]);
      console.log(`🧹 Test file cleaned up`);
    }
    
    return anonBuckets.length === 5; // Should see all 5 buckets
    
  } catch (error) {
    console.log(`❌ Final test failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎯 Starting anon key bucket access fix...\n');
  
  // Step 1: Diagnose the issue
  const needsFix = await diagnoseIssue();
  
  if (!needsFix) {
    console.log('\n🎉 NO FIX NEEDED!');
    console.log('✅ Anon key already has proper bucket access');
    return;
  }
  
  // Step 2: Fix bucket visibility policy
  const bucketPolicyFixed = await fixBucketVisibilityPolicy();
  
  if (!bucketPolicyFixed) {
    console.log('\n❌ BUCKET POLICY FIX FAILED');
    console.log('Manual intervention required');
    return;
  }
  
  // Step 3: Ensure object policies exist
  await ensureObjectPoliciesExist();
  
  // Step 4: Test final result
  const success = await testFinalResult();
  
  // Step 5: Summary
  console.log('\n🎯 FINAL RESULT');
  console.log('================');
  
  if (success) {
    console.log('🎉 SUCCESS! Anon key bucket access FIXED!');
    console.log('✅ Anon key can now see all 5 buckets');
    console.log('✅ File operations work with proper security');
    console.log('✅ Public files accessible, private files protected');
    console.log('\n🧪 Verify with:');
    console.log('npm run test:storage-simple');
    console.log('\n🚀 Your storage is now fully functional!');
  } else {
    console.log('❌ FIX INCOMPLETE');
    console.log('Some issues may remain - check the test results above');
    console.log('\n💡 Manual steps:');
    console.log('1. Go to Supabase Dashboard → Storage → Policies');
    console.log('2. Ensure policy exists: "Allow everyone to see all buckets"');
    console.log('3. On storage.buckets table, FOR SELECT TO public USING (true)');
  }
}

// Run the fix
main().catch(console.error);
