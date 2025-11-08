/**
 * Quick Database Debug Script
 * Run this to check what's in your farmers and buyers tables
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://dlwbvoqowqiugyjdfyax.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd2J2b3Fvd3FpdWd5amRmeWF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyNjk3MSwiZXhwIjoyMDc2MjAyOTcxfQ.OOwXtzZy203Fsu2VsJOfk-gM7X4bb3fTLXE9GP-I7qg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugDatabase() {
  console.log('🔍 Starting database debug...');
  console.log('=' .repeat(80));

  try {
    // 1. Check all farmers
    console.log('\n📊 FARMERS TABLE:');
    console.log('-'.repeat(80));
    const { data: farmers, error: farmersError } = await supabase
      .from('farmers')
      .select('id, phone, full_name, created_at')
      .order('created_at', { ascending: false });

    if (farmersError) {
      console.error('❌ Error fetching farmers:', farmersError);
    } else {
      console.log(`✅ Found ${farmers?.length || 0} farmers:`);
      if (farmers && farmers.length > 0) {
        farmers.forEach((farmer, index) => {
          console.log(`\n${index + 1}. Farmer:`);
          console.log(`   ID: ${farmer.id}`);
          console.log(`   Phone: ${farmer.phone}`);
          console.log(`   Name: ${farmer.full_name}`);
          console.log(`   Created: ${farmer.created_at}`);
        });
      } else {
        console.log('   ⚠️ No farmers found in database');
      }
    }

    // 2. Check all buyers
    console.log('\n\n📊 BUYERS TABLE:');
    console.log('-'.repeat(80));
    const { data: buyers, error: buyersError } = await supabase
      .from('buyers')
      .select('id, phone, full_name, created_at')
      .order('created_at', { ascending: false });

    if (buyersError) {
      console.error('❌ Error fetching buyers:', buyersError);
    } else {
      console.log(`✅ Found ${buyers?.length || 0} buyers:`);
      if (buyers && buyers.length > 0) {
        buyers.forEach((buyer, index) => {
          console.log(`\n${index + 1}. Buyer:`);
          console.log(`   ID: ${buyer.id}`);
          console.log(`   Phone: ${buyer.phone}`);
          console.log(`   Name: ${buyer.full_name}`);
          console.log(`   Created: ${buyer.created_at}`);
        });
      } else {
        console.log('   ⚠️ No buyers found in database');
      }
    }

    // 3. Check specific phone number in farmers
    console.log('\n\n🔍 SEARCHING FOR PHONE: 6303191808 in FARMERS');
    console.log('-'.repeat(80));
    const { data: farmerByPhone, error: farmerPhoneError } = await supabase
      .from('farmers')
      .select('*')
      .eq('phone', '6303191808');

    if (farmerPhoneError) {
      console.error('❌ Error searching farmers by phone:', farmerPhoneError);
    } else {
      if (farmerByPhone && farmerByPhone.length > 0) {
        console.log('✅ Found farmer with phone 6303191808:');
        console.log(JSON.stringify(farmerByPhone[0], null, 2));
      } else {
        console.log('⚠️ No farmer found with phone 6303191808');
      }
    }

    // 4. Check specific phone number in buyers
    console.log('\n\n🔍 SEARCHING FOR PHONE: 6303191808 in BUYERS');
    console.log('-'.repeat(80));
    const { data: buyerByPhone, error: buyerPhoneError } = await supabase
      .from('buyers')
      .select('*')
      .eq('phone', '6303191808');

    if (buyerPhoneError) {
      console.error('❌ Error searching buyers by phone:', buyerPhoneError);
    } else {
      if (buyerByPhone && buyerByPhone.length > 0) {
        console.log('✅ Found buyer with phone 6303191808:');
        console.log(JSON.stringify(buyerByPhone[0], null, 2));
      } else {
        console.log('⚠️ No buyer found with phone 6303191808');
      }
    }

    // 5. Check specific Supabase ID
    console.log('\n\n🔍 SEARCHING FOR ID: 6562b1a6-a4e0-4cf1-ab61-c1d4b31434aa');
    console.log('-'.repeat(80));
    const { data: farmerById, error: farmerIdError } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', '6562b1a6-a4e0-4cf1-ab61-c1d4b31434aa');

    if (farmerIdError) {
      console.error('❌ Error searching farmers by ID:', farmerIdError);
    } else {
      if (farmerById && farmerById.length > 0) {
        console.log('✅ Found farmer with ID:');
        console.log(JSON.stringify(farmerById[0], null, 2));
      } else {
        console.log('⚠️ No farmer found with this ID');
      }
    }

    const { data: buyerById, error: buyerIdError } = await supabase
      .from('buyers')
      .select('*')
      .eq('id', '6562b1a6-a4e0-4cf1-ab61-c1d4b31434aa');

    if (buyerIdError) {
      console.error('❌ Error searching buyers by ID:', buyerIdError);
    } else {
      if (buyerById && buyerById.length > 0) {
        console.log('✅ Found buyer with ID:');
        console.log(JSON.stringify(buyerById[0], null, 2));
      } else {
        console.log('⚠️ No buyer found with this ID');
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database debug complete!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Debug script error:', error);
  }
}

// Run the debug
debugDatabase();
