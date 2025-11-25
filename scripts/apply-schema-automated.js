/**
 * Automated Schema Application Script
 * Applies database schema using Supabase REST API with service role key
 *
 * Usage: node scripts/apply-schema-automated.js
 *
 * Note: This script executes SQL via Supabase's PostgREST API
 * For best results, use Supabase Dashboard SQL Editor or psql
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Required environment variables not set');
  console.error('\nPlease add these to your .env file:');
  console.error('EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('SUPABASE_DB_PASSWORD=your-database-password (optional, for psql)');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Error: Could not extract project reference from SUPABASE_URL');
  process.exit(1);
}

function tryPsqlMethod() {
  console.log('\n📋 Method 1: Using psql (PostgreSQL CLI)\n');

  if (!SUPABASE_DB_PASSWORD) {
    console.log('⚠️  SUPABASE_DB_PASSWORD not set in .env');
    console.log('   Skipping psql method...\n');
    return false;
  }

  const dbHost = `db.${projectRef}.supabase.co`;
  const dbPort = '5432';
  const dbName = 'postgres';
  const dbUser = 'postgres';
  const schemaPath = path.join(__dirname, 'supabase-schema-v2.sql');

  console.log(`Host: ${dbHost}`);
  console.log(`Database: ${dbName}`);
  console.log(`User: ${dbUser}\n`);

  try {
    console.log('🔄 Executing schema with psql...\n');

    const command = `psql "postgresql://${dbUser}:${SUPABASE_DB_PASSWORD}@${dbHost}:${dbPort}/${dbName}" -f "${schemaPath}"`;

    execSync(command, { stdio: 'inherit' });

    console.log('\n✅ Schema applied successfully via psql!');
    return true;
  } catch (error) {
    console.log('\n❌ psql method failed');
    console.log('   Error:', error.message);
    console.log('   Make sure psql is installed and accessible\n');
    return false;
  }
}

function showManualInstructions() {
  const schemaPath = path.join(__dirname, 'supabase-schema-v2.sql');

  console.log('\n📋 Manual Application Instructions\n');
  console.log('='.repeat(70));
  console.log('Since automated methods are not available, please apply manually:');
  console.log('='.repeat(70));
  console.log('\n1. Open Supabase Dashboard:');
  console.log(`   ${SUPABASE_URL.replace('/rest/v1', '')}`);
  console.log('\n2. Navigate to: SQL Editor → New Query');
  console.log('\n3. Copy the schema file:');
  console.log(`   ${schemaPath}`);
  console.log('\n4. Paste the entire contents into the SQL Editor');
  console.log('\n5. Click "Run" to execute');
  console.log('\n6. Verify tables are created in Table Editor');
  console.log('\n' + '='.repeat(70));

  // Read and display schema stats
  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
  const tables = (schemaSQL.match(/CREATE TABLE/gi) || []).length;
  const indexes = (schemaSQL.match(/CREATE INDEX/gi) || []).length;
  const policies = (schemaSQL.match(/CREATE POLICY/gi) || []).length;

  console.log('\n📊 What will be created:');
  console.log(`   • ${tables} Tables`);
  console.log(`   • ${indexes} Indexes`);
  console.log(`   • ${policies} RLS Policies`);
  console.log('\n' + '='.repeat(70));
}

async function applySchema() {
  console.log('🚀 Automated Schema Application\n');
  console.log('='.repeat(70));
  console.log(`Project: ${projectRef}`);
  console.log(`URL: ${SUPABASE_URL}`);
  console.log('='.repeat(70));

  // Try psql method first
  const psqlSuccess = tryPsqlMethod();

  if (psqlSuccess) {
    console.log('\n✅ Next steps:');
    console.log('   1. Verify tables in Supabase Dashboard');
    console.log('   2. Test CRUD operations with services');
    console.log('   3. Migrate existing data if needed\n');
    return;
  }

  // If psql fails, show manual instructions
  showManualInstructions();

  console.log('\n💡 Alternative: Install psql and set SUPABASE_DB_PASSWORD');
  console.log('   Then run this script again for automated application\n');
}

// Run the script
applySchema().catch(error => {
  console.error('\n❌ Fatal error:');
  console.error(error.message);
  process.exit(1);
});

