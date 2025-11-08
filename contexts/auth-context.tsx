import { startLocationAutoUpdate, updateLocationNow } from '@/services/location-auto-update';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'farmer' | 'buyer' | null;
export type Language = 'en' | 'hi' | null;

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language?: Language;
  profileImage?: string;
  // Farmer-specific fields
  farmName?: string;
  farmSize?: number;
  // Buyer-specific fields
  companyName?: string;
  businessType?: string;
  // Common fields
  location?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  userRole: UserRole;
  selectedRole: UserRole; // Add selectedRole to context
  selectedLanguage: Language;
  hasSeenSplash: boolean;
  login: (phone: string, otp: string) => Promise<UserRole>; // Now returns the role
  register: (userData: Partial<User>) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  selectLanguage: (language: Language) => Promise<void>;
  setSplashSeen: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(null);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null); // Store selected role separately

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedLanguage = await AsyncStorage.getItem('language');
        const storedSplash = await AsyncStorage.getItem('hasSeenSplash');
        const storedRole = await AsyncStorage.getItem('selectedRole');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Start location auto-update for logged-in user
          if (parsedUser?.id) {
            console.log('🗺️ [AUTH] Starting location auto-update for user:', parsedUser.id);
            try {
              await updateLocationNow(parsedUser.id);
              await startLocationAutoUpdate(parsedUser.id, 5); // Update every 5 minutes
            } catch (error) {
              console.error('❌ [AUTH] Failed to start location auto-update:', error);
            }
          }
        }
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage as Language);
          console.log('✅ [AUTH] Restored language:', storedLanguage);
        }
        if (storedSplash) {
          setHasSeenSplash(JSON.parse(storedSplash));
          console.log('✅ [AUTH] Restored splash seen status:', storedSplash);
        }
        if (storedRole) {
          setSelectedRole(storedRole as UserRole);
          console.log('✅ [AUTH] Restored selectedRole from AsyncStorage:', storedRole);
        } else {
          console.log('ℹ️ [AUTH] No selectedRole found in AsyncStorage');
        }
      } catch (e) {
        console.error('Failed to restore token', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (phone: string, otp: string): Promise<UserRole> => {
    try {
      console.log('🔐 Attempting login with phone:', phone);

      // Hardcode OTP verification for development
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Use 123456 for development.');
      }

      // Create a unique identifier for Supabase auth (internal use only)
      const authIdentifier = `${phone}@plotmyfarm.app`;
      const password = `temp_${phone}_123456`; // Fixed password for development

      // Try to sign in first, if fails then sign up
      let authResult = await supabase.auth.signInWithPassword({
        email: authIdentifier,
        password,
      });

      if (authResult.error) {
        console.log('🔄 Sign in failed, attempting sign up...');
        // If sign in fails, try to sign up
        authResult = await supabase.auth.signUp({
          email: authIdentifier,
          password,
        });

        if (authResult.error) {
          throw new Error(`Authentication failed: ${authResult.error.message}`);
        }
      }

      const supabaseUser = authResult.data.user;
      if (!supabaseUser) {
        throw new Error('No user returned from authentication');
      }

      // Check if user profile exists in farmers or buyers table
      let userProfile = null;
      let userRole: UserRole = null;

      console.log('🔍 Looking for user profile with Supabase ID:', supabaseUser.id);

      // First check farmers table
      const { data: farmerProfile, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      console.log('🔍 Farmer lookup result:', { farmerProfile, farmerError });

      if (farmerProfile) {
        userProfile = farmerProfile;
        userRole = 'farmer';
        console.log('✅ Existing farmer profile found:', farmerProfile);
      } else {
        // Check buyers table
        const { data: buyerProfile, error: buyerError } = await supabase
          .from('buyers')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        console.log('🔍 Buyer lookup result:', { buyerProfile, buyerError });

        if (buyerProfile) {
          userProfile = buyerProfile;
          userRole = 'buyer';
          console.log('✅ Existing buyer profile found:', buyerProfile);
        }
      }

      // If no profile found by ID, try lookup by phone number
      if (!userProfile) {
        console.log('⚠️ No profile found by ID, trying phone lookup...');

        // Try farmers table by phone
        const { data: farmerByPhone, error: farmerPhoneError } = await supabase
          .from('farmers')
          .select('*')
          .eq('phone', phone)
          .single();

        console.log('🔍 Farmer phone lookup result:', { farmerByPhone, farmerPhoneError });

        if (farmerByPhone) {
          userProfile = farmerByPhone;
          userRole = 'farmer';
          console.log('✅ Found farmer profile by phone:', farmerByPhone);
        } else {
          // Try buyers table by phone
          const { data: buyerByPhone, error: buyerPhoneError } = await supabase
            .from('buyers')
            .select('*')
            .eq('phone', phone)
            .single();

          console.log('🔍 Buyer phone lookup result:', { buyerByPhone, buyerPhoneError });

          if (buyerByPhone) {
            userProfile = buyerByPhone;
            userRole = 'buyer';
            console.log('✅ Found buyer profile by phone:', buyerByPhone);
          }
        }
      }

      // If still no profile found, user needs to complete registration
      if (!userProfile) {
        console.log('⚠️ No existing profile found by ID or phone - user needs to complete registration');
        console.log('🔍 Supabase user details:', supabaseUser);
        console.log('🔍 Phone searched:', phone);
        // Return null to indicate registration is needed
        return null;
      }

      // Create our app user object
      const appUser: User = {
        id: userProfile.id,
        name: userProfile.full_name || 'User',
        phone: userProfile.phone || phone,
        role: userRole,
        profileImage: userProfile.profile_image_url,
        farmName: userProfile.farm_name,
        farmSize: userProfile.farm_size,
        companyName: userProfile.company_name,
        businessType: userProfile.business_type,
        location: userProfile.location,
      };

      setUser(appUser);
      await AsyncStorage.setItem('user', JSON.stringify(appUser));

      console.log('✅ Login successful for user:', userProfile.phone);
      return userRole;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: Partial<User>) => {
    try {
      console.log('📝 Attempting registration for phone:', userData.phone);

      if (!userData.phone || !userData.role) {
        throw new Error('Phone and role are required for registration');
      }

      // Create unique auth identifier
      const authIdentifier = `${userData.phone}@plotmyfarm.app`;

      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authIdentifier,
        password: `temp_${userData.phone}_123456`, // Temporary password
      });

      if (authError) {
        throw new Error(`Registration failed: ${authError.message}`);
      }

      const supabaseUser = authData.user;
      if (!supabaseUser) {
        throw new Error('No user returned from registration');
      }

      // Create user profile in appropriate table based on role
      const tableName = userData.role === 'farmer' ? 'farmers' : 'buyers';

      let userProfile: any = {
        id: supabaseUser.id,
        phone: userData.phone,
        full_name: userData.name || '',
        profile_image_url: userData.profileImage,
        location: userData.location,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add role-specific fields
      if (userData.role === 'farmer') {
        userProfile.farm_name = userData.farmName;
        userProfile.farm_size = userData.farmSize;
      } else if (userData.role === 'buyer') {
        userProfile.company_name = userData.companyName;
        userProfile.business_type = userData.businessType;
      }

      const { data: createdProfile, error: createError } = await supabase
        .from(tableName)
        .insert([userProfile])
        .select()
        .single();

      if (createError) {
        console.error('Failed to create user profile:', createError);
        // Continue with local user object if database insert fails
      }

      // Create our app user object
      const newUser: User = {
        id: supabaseUser.id,
        name: userData.name || '',
        phone: userData.phone,
        role: userData.role || null,
        profileImage: userData.profileImage,
        farmName: userData.farmName,
        farmSize: userData.farmSize,
        companyName: userData.companyName,
        businessType: userData.businessType,
        location: userData.location,
      };

      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      console.log('✅ Registration successful for user:', newUser.phone);
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const selectRole = async (role: UserRole) => {
    try {
      console.log('🎯 [AUTH] selectRole() called with role:', role);
      // Store the selected role in a separate state variable
      // This is needed because selectRole() is called BEFORE login(), when user is null
      setSelectedRole(role);
      await AsyncStorage.setItem('selectedRole', role || '');
      console.log('✅ [AUTH] selectedRole saved to AsyncStorage:', role);

      // Also update user if it exists
      if (user) {
        console.log('🔄 [AUTH] User exists, updating user object with new role');
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ [AUTH] User object updated with role:', role);
      } else {
        console.log('ℹ️ [AUTH] No user object yet (expected during role selection)');
      }
    } catch (error) {
      console.error('❌ [AUTH] Role selection failed:', error);
      throw error;
    }
  };

  const selectLanguage = async (language: Language) => {
    try {
      setSelectedLanguage(language);
      await AsyncStorage.setItem('language', language || '');
      if (user) {
        const updatedUser = { ...user, language };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Language selection failed:', error);
      throw error;
    }
  };

  const setSplashSeen = async () => {
    try {
      setHasSeenSplash(true);
      await AsyncStorage.setItem('hasSeenSplash', JSON.stringify(true));
    } catch (error) {
      console.error('Failed to set splash seen:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');

      // Stop location auto-update
      await stopLocationAutoUpdate();
      console.log('🗺️ [AUTH] Stopped location auto-update');

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
      }

      // Clear local state
      setUser(null);
      setSelectedRole(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('selectedRole');

      console.log('✅ Logout successful - cleared user and selectedRole');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: user !== null,
    userRole: user?.role || null,
    selectedRole, // Export selectedRole in context
    selectedLanguage,
    hasSeenSplash,
    login,
    register,
    selectRole,
    selectLanguage,
    setSplashSeen,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

