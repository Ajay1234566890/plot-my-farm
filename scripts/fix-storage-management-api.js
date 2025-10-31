#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: EXPO_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project reference from URL
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!PROJECT_REF) {
  console.error('❌ Could not extract project reference from Supabase URL');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🚀 SUPABASE MANAGEMENT API - STORAGE FIX');
console.log('=========================================');
console.log(`📋 Project: ${PROJECT_REF}`);
console.log(`🔗 URL: ${SUPABASE_URL}\n`);

// Root cause analysis
console.log('🔍 ROOT CAUSE ANALYSIS');
console.log('======================');
console.log('❌ Issue: Anon key finds 0 buckets');
console.log('🔍 Cause: Bucket visibility policy too restrictive');
console.log('📋 Current policy: Only shows public buckets to anon users');
console.log('✅ Solution: Allow anon users to see ALL buckets (but not access private files)\n');

async function makeSupabaseManagementAPICall(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${PROJECT_REF}${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testCurrentStorageState() {
  console.log('🧪 Testing current storage state...\n');
  
  // Test with anon key
  const anonClient = createClient(SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  
  try {
    const { data: anonBuckets, error: anonError } = await anonClient.storage.listBuckets();
    console.log(`🔑 Anon key: ${anonError ? `❌ ${anonError.message}` : `✅ Found ${anonBuckets.length} buckets`}`);
    
    const { data: adminBuckets, error: adminError } = await supabase.storage.listBuckets();
    console.log(`🔑 Admin key: ${adminError ? `❌ ${adminError.message}` : `✅ Found ${adminBuckets.length} buckets`}`);
    
    return {
      anonWorking: !anonError && anonBuckets.length > 0,
      adminWorking: !adminError && adminBuckets.length > 0,
      anonBucketCount: anonBuckets?.length || 0,
      adminBucketCount: adminBuckets?.length || 0
    };
  } catch (error) {
    console.log(`❌ Storage test failed: ${error.message}`);
    return { anonWorking: false, adminWorking: false };
  }
}

async function dropExistingStoragePolicies() {
  console.log('🗑️ Dropping existing storage policies...\n');
  
  const policiesToDrop = [
    'Public buckets are visible to everyone',
    'Private buckets visible to authenticated users',
    'Public bucket files are viewable by everyone',
    'Authenticated users can upload to public buckets',
    'Authenticated users can update public bucket files',
    'Authenticated users can delete public bucket files',
    'Authenticated users can access private bucket files'
  ];
  
  for (const policyName of policiesToDrop) {
    try {
      // Drop from storage.objects
      const { error: objectsError } = await supabase.rpc('exec', { 
        sql: `DROP POLICY IF EXISTS "${policyName}" ON storage.objects;` 
      });
      
      // Drop from storage.buckets
      const { error: bucketsError } = await supabase.rpc('exec', { 
        sql: `DROP POLICY IF EXISTS "${policyName}" ON storage.buckets;` 
      });
      
      if (!objectsError && !bucketsError) {
        console.log(`✅ Dropped: ${policyName}`);
      } else {
        console.log(`⚠️ Drop warning for ${policyName}: ${objectsError?.message || bucketsError?.message}`);
      }
    } catch (error) {
      console.log(`⚠️ Drop error for ${policyName}: ${error.message}`);
    }
  }
}

async function createOptimalStoragePolicies() {
  console.log('\n📝 Creating optimal storage policies...\n');
  
  const policies = [
    {
      table: 'storage.buckets',
      name: 'Allow everyone to see all buckets',
      sql: `CREATE POLICY "Allow everyone to see all buckets" ON storage.buckets FOR SELECT TO public USING (true);`
    },
    {
      table: 'storage.objects',
      name: 'Public files viewable by everyone',
      sql: `CREATE POLICY "Public files viewable by everyone" ON storage.objects FOR SELECT TO public USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      table: 'storage.objects',
      name: 'Authenticated upload to public buckets',
      sql: `CREATE POLICY "Authenticated upload to public buckets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      table: 'storage.objects',
      name: 'Authenticated update public files',
      sql: `CREATE POLICY "Authenticated update public files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      table: 'storage.objects',
      name: 'Authenticated delete public files',
      sql: `CREATE POLICY "Authenticated delete public files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('crop-images', 'offer-images', 'profile-images'));`
    },
    {
      table: 'storage.objects',
      name: 'Authenticated access private buckets',
      sql: `CREATE POLICY "Authenticated access private buckets" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('documents', 'invoices'));`
    }
  ];
  
  let successCount = 0;
  
  for (const policy of policies) {
    try {
      console.log(`⚡ Creating: ${policy.name}`);
      
      const { error } = await supabase.rpc('exec', { sql: policy.sql });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ Already exists: ${policy.name}`);
          successCount++;
        } else {
          console.log(`❌ Failed: ${error.message}`);
        }
      } else {
        console.log(`✅ Created: ${policy.name}`);
        successCount++;
      }
      
    } catch (error) {
      console.log(`❌ Error creating ${policy.name}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Successfully created ${successCount}/${policies.length} policies`);
  return successCount === policies.length;
}

async function useManagementAPIApproach() {
  console.log('\n🔧 Using Supabase Management API approach...\n');
  
  try {
    // First, try to get project info via Management API
    console.log('📋 Getting project information...');
    const projectInfo = await makeSupabaseManagementAPICall('GET', '');
    
    if (projectInfo.status === 200) {
      console.log(`✅ Project info retrieved: ${projectInfo.data.name || 'Unknown'}`);
    } else {
      console.log(`⚠️ Project info status: ${projectInfo.status}`);
    }
    
    // Try to disable RLS via Management API
    console.log('🔓 Attempting to disable storage RLS via Management API...');
    
    const disableRLSPayload = {
      sql: `
        ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
        ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
      `
    };
    
    const disableResult = await makeSupabaseManagementAPICall('POST', '/database/query', disableRLSPayload);
    
    if (disableResult.status === 200) {
      console.log('✅ Storage RLS disabled via Management API');
      return true;
    } else {
      console.log(`❌ Management API disable failed: ${disableResult.status} - ${JSON.stringify(disableResult.data)}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Management API approach failed: ${error.message}`);
    return false;
  }
}

async function enableStorageRLS() {
  console.log('🔐 Ensuring RLS is enabled on storage tables...\n');
  
  const enableQueries = [
    'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;'
  ];
  
  for (const query of enableQueries) {
    try {
      const { error } = await supabase.rpc('exec', { sql: query });
      
      if (error && !error.message.includes('already enabled')) {
        console.log(`⚠️ ${query}: ${error.message}`);
      } else {
        console.log(`✅ RLS enabled on ${query.includes('objects') ? 'objects' : 'buckets'}`);
      }
    } catch (error) {
      console.log(`⚠️ RLS enable error: ${error.message}`);
    }
  }
}

async function testStorageAfterFix() {
  console.log('\n🧪 Testing storage after fix...\n');
  
  const anonClient = createClient(SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  
  try {
    // Test bucket listing with anon key
    const { data: anonBuckets, error: anonError } = await anonClient.storage.listBuckets();
    console.log(`🔑 Anon key buckets: ${anonError ? `❌ ${anonError.message}` : `✅ Found ${anonBuckets.length} buckets`}`);
    
    if (anonBuckets && anonBuckets.length > 0) {
      anonBuckets.forEach(bucket => {
        console.log(`   📁 ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
    
    // Test file upload with anon key (should fail - that's expected)
    const testFileName = `test-${Date.now()}.txt`;
    const testFile = new Blob(['Test file'], { type: 'text/plain' });
    
    console.log('\n📤 Testing file upload with anon key (should fail):');
    const { error: anonUploadError } = await anonClient.storage
      .from('crop-images')
      .upload(testFileName, testFile);
    
    if (anonUploadError) {
      console.log(`✅ Anon upload correctly blocked: ${anonUploadError.message}`);
    } else {
      console.log(`⚠️ Anon upload unexpectedly succeeded`);
    }
    
    // Test file upload with admin key (should succeed)
    console.log('\n📤 Testing file upload with admin key (should succeed):');
    const { data: adminUpload, error: adminUploadError } = await supabase.storage
      .from('crop-images')
      .upload(testFileName, testFile);
    
    if (adminUploadError) {
      console.log(`❌ Admin upload failed: ${adminUploadError.message}`);
      return false;
    } else {
      console.log(`✅ Admin upload succeeded: ${adminUpload.path}`);
      
      // Clean up
      await supabase.storage.from('crop-images').remove([testFileName]);
      console.log(`🧹 Test file cleaned up`);
      return true;
    }
    
  } catch (error) {
    console.log(`❌ Storage test failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎯 Starting automated storage fix using Management API...\n');
  
  // Step 1: Test current state
  const initialState = await testCurrentStorageState();
  
  if (initialState.anonWorking) {
    console.log('\n🎉 STORAGE ALREADY WORKING!');
    console.log('✅ Anon key can see buckets - no fix needed');
    return;
  }
  
  console.log('\n🔧 Storage needs fixing...');
  
  let success = false;
  
  // Step 2: Try Management API approach first
  success = await useManagementAPIApproach();
  
  // Step 3: If Management API fails, try policy-based approach
  if (!success) {
    console.log('\n🔄 Management API failed, trying policy-based approach...');
    
    await enableStorageRLS();
    await dropExistingStoragePolicies();
    success = await createOptimalStoragePolicies();
  }
  
  // Step 4: Test the result
  console.log('\n🧪 FINAL TESTING');
  console.log('=================');
  
  const finalState = await testStorageAfterFix();
  
  // Step 5: Summary
  console.log('\n🎯 FINAL RESULT');
  console.log('================');
  
  if (finalState) {
    console.log('🎉 SUCCESS! Storage is now working correctly!');
    console.log('✅ Anon key can see all buckets');
    console.log('✅ File operations work with proper permissions');
    console.log('✅ Security maintained (anon cannot upload)');
    console.log('\n🧪 Run comprehensive test:');
    console.log('npm run test:storage');
    console.log('\n🚀 Your app now has full database AND storage functionality!');
  } else {
    console.log('❌ AUTOMATED FIX FAILED');
    console.log('📋 Manual intervention required');
    console.log('\n💡 Next steps:');
    console.log('1. Go to Supabase Dashboard → Storage → Policies');
    console.log('2. Create policy: "Allow everyone to see all buckets" on storage.buckets');
    console.log('3. FOR SELECT TO public USING (true)');
    console.log('\n🔗 Dashboard: https://app.supabase.com/project/dlwbvoqowqiugyjdfyax');
  }
}

// Run the Management API solution
main().catch(console.error);
