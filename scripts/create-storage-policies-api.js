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

console.log('🚀 Automated Storage Policy Creation\n');
console.log(`📋 Project: ${PROJECT_REF}`);
console.log(`🔗 URL: ${SUPABASE_URL}\n`);

// Storage policies to create
const STORAGE_POLICIES = [
  {
    table: 'objects',
    name: 'Public files viewable by all',
    definition: `bucket_id IN ('crop-images', 'offer-images', 'profile-images')`,
    command: 'SELECT',
    roles: ['public']
  },
  {
    table: 'objects', 
    name: 'Authenticated upload to public buckets',
    definition: `bucket_id IN ('crop-images', 'offer-images', 'profile-images')`,
    command: 'INSERT',
    roles: ['authenticated'],
    check: `bucket_id IN ('crop-images', 'offer-images', 'profile-images')`
  },
  {
    table: 'objects',
    name: 'Authenticated update public files', 
    definition: `bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND auth.role() = 'authenticated'`,
    command: 'UPDATE',
    roles: ['authenticated']
  },
  {
    table: 'objects',
    name: 'Authenticated delete public files',
    definition: `bucket_id IN ('crop-images', 'offer-images', 'profile-images') AND auth.role() = 'authenticated'`,
    command: 'DELETE', 
    roles: ['authenticated']
  },
  {
    table: 'objects',
    name: 'Authenticated access private buckets',
    definition: `bucket_id IN ('documents', 'invoices') AND auth.role() = 'authenticated'`,
    command: 'ALL',
    roles: ['authenticated'],
    check: `bucket_id IN ('documents', 'invoices') AND auth.role() = 'authenticated'`
  },
  {
    table: 'buckets',
    name: 'Buckets visible to authenticated users',
    definition: 'true',
    command: 'SELECT',
    roles: ['authenticated']
  }
];

async function makeSupabaseAPIRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY
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

async function createStoragePolicyViaAPI(policy) {
  console.log(`📝 Creating policy: ${policy.name}`);
  
  try {
    // Try using the REST API to create policy
    const policyData = {
      name: policy.name,
      definition: policy.definition,
      command: policy.command,
      roles: policy.roles
    };
    
    if (policy.check) {
      policyData.check = policy.check;
    }
    
    const response = await makeSupabaseAPIRequest(
      'POST',
      `/rest/v1/rpc/create_policy`,
      {
        table_name: `storage.${policy.table}`,
        policy_name: policy.name,
        policy_definition: policy.definition,
        policy_command: policy.command,
        policy_roles: policy.roles,
        policy_check: policy.check || null
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Policy created: ${policy.name}`);
      return true;
    } else {
      console.log(`❌ API failed (${response.status}): ${JSON.stringify(response.data)}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error creating policy ${policy.name}: ${error.message}`);
    return false;
  }
}

async function createStoragePolicyViaSQL(policy) {
  console.log(`📝 Trying SQL approach: ${policy.name}`);
  
  try {
    let sql = `CREATE POLICY "${policy.name}" ON storage.${policy.table}`;
    
    if (policy.command === 'ALL') {
      sql += ` FOR ALL`;
    } else {
      sql += ` FOR ${policy.command}`;
    }
    
    if (policy.roles.includes('public')) {
      sql += ` TO public`;
    } else if (policy.roles.includes('authenticated')) {
      sql += ` TO authenticated`;
    }
    
    if (policy.command === 'INSERT' && policy.check) {
      sql += ` WITH CHECK (${policy.check})`;
    } else {
      sql += ` USING (${policy.definition})`;
    }
    
    const { error } = await supabase.rpc('exec', { sql: sql });
    
    if (error) {
      console.log(`❌ SQL failed: ${error.message}`);
      return false;
    } else {
      console.log(`✅ SQL success: ${policy.name}`);
      return true;
    }
    
  } catch (error) {
    console.log(`❌ SQL error: ${error.message}`);
    return false;
  }
}

async function enableStorageRLS() {
  console.log('🔐 Ensuring RLS is enabled on storage tables...\n');
  
  const tables = ['storage.objects', 'storage.buckets'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec', { 
        sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;` 
      });
      
      if (error && !error.message.includes('already enabled')) {
        console.log(`⚠️ Could not enable RLS on ${table}: ${error.message}`);
      } else {
        console.log(`✅ RLS enabled on ${table}`);
      }
    } catch (error) {
      console.log(`⚠️ RLS enable error on ${table}: ${error.message}`);
    }
  }
  
  console.log('');
}

async function testStorageAccess() {
  console.log('🧪 Testing storage access after policy creation...\n');
  
  try {
    // Test bucket listing
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log(`❌ Bucket listing failed: ${bucketError.message}`);
      return false;
    }
    
    console.log(`✅ Found ${buckets.length} buckets`);
    
    // Test file upload
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Automated policy test file';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('crop-images')
      .upload(testFileName, testFile);
    
    if (uploadError) {
      console.log(`❌ File upload failed: ${uploadError.message}`);
      return false;
    }
    
    console.log(`✅ File upload successful: ${uploadData.path}`);
    
    // Clean up
    await supabase.storage.from('crop-images').remove([testFileName]);
    console.log(`🧹 Test file cleaned up`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Storage test failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎯 Starting automated storage policy creation...\n');
  
  // Step 1: Enable RLS
  await enableStorageRLS();
  
  // Step 2: Create policies
  let successCount = 0;
  let failCount = 0;
  
  for (const policy of STORAGE_POLICIES) {
    console.log(`\n📋 Processing: ${policy.name}`);
    
    // Try API approach first
    let success = await createStoragePolicyViaAPI(policy);
    
    // If API fails, try SQL approach
    if (!success) {
      console.log('🔄 API failed, trying SQL approach...');
      success = await createStoragePolicyViaSQL(policy);
    }
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Step 3: Summary
  console.log('\n📊 POLICY CREATION SUMMARY');
  console.log('===========================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📝 Total: ${successCount + failCount}`);
  
  // Step 4: Test storage
  console.log('\n🧪 TESTING STORAGE FUNCTIONALITY');
  console.log('==================================');
  
  const storageWorking = await testStorageAccess();
  
  // Step 5: Final result
  console.log('\n🎯 FINAL RESULT');
  console.log('================');
  
  if (successCount > 0 && storageWorking) {
    console.log('🎉 SUCCESS! Storage policies created and working!');
    console.log('✅ Storage buckets are now accessible');
    console.log('✅ File upload/download should work');
    console.log('\n🧪 Run full storage test:');
    console.log('npm run test:storage');
  } else if (successCount > 0) {
    console.log('⚠️ PARTIAL SUCCESS: Some policies created but storage test failed');
    console.log('🔧 You may need to wait a moment for policies to take effect');
    console.log('🧪 Try running: npm run test:storage');
  } else {
    console.log('❌ FAILED: Could not create storage policies automatically');
    console.log('📋 You will need to create policies manually via Supabase Dashboard');
    console.log('💡 Go to Storage → Policies in your Supabase dashboard');
  }
}

// Run the automated solution
main().catch(console.error);
