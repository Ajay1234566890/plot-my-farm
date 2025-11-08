/**
 * Database Test Utilities
 * Helper functions to test database connectivity and data
 */

import { supabase } from './supabase';

export interface DatabaseTestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

/**
 * Test basic database connectivity
 */
export async function testDatabaseConnection(): Promise<DatabaseTestResult> {
  try {
    console.log('🔍 Testing database connection...');
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('farmers')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return {
        success: false,
        message: `Database connection failed: ${error.message}`,
        error
      };
    }

    console.log('✅ Database connection successful');
    return {
      success: true,
      message: 'Database connection successful',
      data
    };
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return {
      success: false,
      message: `Database connection error: ${error}`,
      error
    };
  }
}

/**
 * Check if a phone number exists in farmers or buyers table
 */
export async function checkPhoneExists(phone: string): Promise<DatabaseTestResult> {
  try {
    console.log('🔍 Checking if phone exists:', phone);

    // Check farmers table
    const { data: farmerData, error: farmerError } = await supabase
      .from('farmers')
      .select('id, phone, full_name')
      .eq('phone', phone)
      .single();

    if (farmerData) {
      console.log('✅ Phone found in farmers table:', farmerData);
      return {
        success: true,
        message: `Phone ${phone} found in farmers table`,
        data: { role: 'farmer', profile: farmerData }
      };
    }

    // Check buyers table
    const { data: buyerData, error: buyerError } = await supabase
      .from('buyers')
      .select('id, phone, full_name')
      .eq('phone', phone)
      .single();

    if (buyerData) {
      console.log('✅ Phone found in buyers table:', buyerData);
      return {
        success: true,
        message: `Phone ${phone} found in buyers table`,
        data: { role: 'buyer', profile: buyerData }
      };
    }

    console.log('⚠️ Phone not found in either table');
    return {
      success: false,
      message: `Phone ${phone} not found in database`,
      data: { role: null, profile: null }
    };
  } catch (error) {
    console.error('❌ Error checking phone:', error);
    return {
      success: false,
      message: `Error checking phone: ${error}`,
      error
    };
  }
}

/**
 * List all users in farmers and buyers tables (for debugging)
 */
export async function listAllUsers(): Promise<DatabaseTestResult> {
  try {
    console.log('🔍 Listing all users...');

    // Get farmers
    const { data: farmers, error: farmersError } = await supabase
      .from('farmers')
      .select('id, phone, full_name, created_at')
      .order('created_at', { ascending: false });

    // Get buyers
    const { data: buyers, error: buyersError } = await supabase
      .from('buyers')
      .select('id, phone, full_name, created_at')
      .order('created_at', { ascending: false });

    const result = {
      farmers: farmers || [],
      buyers: buyers || [],
      farmersError,
      buyersError
    };

    console.log('📊 Database users:', result);

    return {
      success: true,
      message: `Found ${farmers?.length || 0} farmers and ${buyers?.length || 0} buyers`,
      data: result
    };
  } catch (error) {
    console.error('❌ Error listing users:', error);
    return {
      success: false,
      message: `Error listing users: ${error}`,
      error
    };
  }
}

/**
 * Create a test user for debugging
 */
export async function createTestUser(phone: string, role: 'farmer' | 'buyer', name: string): Promise<DatabaseTestResult> {
  try {
    console.log('🔍 Creating test user:', { phone, role, name });

    // Create auth user first
    const authIdentifier = `${phone}@plotmyfarm.app`;
    const password = `temp_${phone}_123456`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: authIdentifier,
      password,
    });

    if (authError) {
      throw new Error(`Auth creation failed: ${authError.message}`);
    }

    const supabaseUser = authData.user;
    if (!supabaseUser) {
      throw new Error('No user returned from auth creation');
    }

    // Create profile
    const tableName = role === 'farmer' ? 'farmers' : 'buyers';
    const profileData = {
      id: supabaseUser.id,
      phone,
      full_name: name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profileResult, error: profileError } = await supabase
      .from(tableName)
      .insert([profileData])
      .select()
      .single();

    if (profileError) {
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    console.log('✅ Test user created successfully:', profileResult);

    return {
      success: true,
      message: `Test ${role} user created successfully`,
      data: { authUser: supabaseUser, profile: profileResult }
    };
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return {
      success: false,
      message: `Error creating test user: ${error}`,
      error
    };
  }
}
