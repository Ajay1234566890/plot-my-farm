import { changeLanguage } from '@/i18n/config';
import { startLocationAutoUpdate, stopLocationAutoUpdate, updateLocationNow } from '@/services/location-auto-update';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'farmer' | 'buyer' | null;
export type Language = 'en' | 'te' | 'hi' | 'ta' | 'kn' | null;

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
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
      console.log('🚀 [AUTH] Starting app initialization...');
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedLanguage = await AsyncStorage.getItem('language');
        const storedSplash = await AsyncStorage.getItem('hasSeenSplash');
        const storedRole = await AsyncStorage.getItem('selectedRole');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('✅ [AUTH] Restored user:', parsedUser.phone);

          // Start location auto-update for logged-in user (non-blocking)
          if (parsedUser?.id) {
            console.log('🗺️ [AUTH] Starting location auto-update for user:', parsedUser.id);
            // Don't await - run in background to avoid blocking initialization
            updateLocationNow(parsedUser.id)
              .then(() => startLocationAutoUpdate(parsedUser.id, 5))
              .catch((error) => {
                console.error('❌ [AUTH] Failed to start location auto-update:', error);
              });
          }
        }

        // Initialize language (with timeout to prevent hanging)
        try {
          const languageToUse = storedLanguage || 'en';
          setSelectedLanguage(languageToUse as Language);

          // Set a timeout for language initialization
          await Promise.race([
            changeLanguage(languageToUse),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Language initialization timeout')), 3000)
            )
          ]);
          console.log('✅ [AUTH] Language initialized:', languageToUse);
        } catch (langError) {
          console.error('⚠️ [AUTH] Language initialization failed, continuing anyway:', langError);
          // Continue with default language
          setSelectedLanguage('en');
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
        console.error('❌ [AUTH] Failed to restore auth state:', e);
      } finally {
        console.log('✅ [AUTH] App initialization complete, setting isLoading to false');
        setIsLoading(false);
      }
    };

    // Add a safety timeout to ensure isLoading becomes false even if something goes wrong
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ [AUTH] Initialization timeout - forcing isLoading to false');
      setIsLoading(false);
    }, 5000); // 5 second timeout

    bootstrapAsync().finally(() => {
      clearTimeout(timeoutId);
    });
  }, []);

  const login = async (phone: string, otp: string): Promise<UserRole> => {
    try {
      console.log('🔐 [AUTH] Attempting login with phone:', phone);

      // Accept any 6-digit OTP for development (real-time testing)
      if (!otp || otp.length !== 6) {
        throw new Error('Invalid OTP. Please enter a 6-digit OTP.');
      }

      console.log('✅ [AUTH] OTP validation passed');

      // Create a unique identifier for Supabase auth (internal use only)
      const authIdentifier = `${phone}@plotmyfarm.app`;
      const password = `temp_${phone}_123456`; // Fixed password for development

      console.log('🔄 [AUTH] Attempting Supabase authentication...');

      // Try to sign in first, if fails then sign up
      let authResult = await supabase.auth.signInWithPassword({
        email: authIdentifier,
        password,
      });

      if (authResult.error) {
        console.log('🔄 [AUTH] Sign in failed, attempting sign up...');
        // If sign in fails, try to sign up
        authResult = await supabase.auth.signUp({
          email: authIdentifier,
          password,
        });

        if (authResult.error) {
          console.error('❌ [AUTH] Sign up also failed:', authResult.error.message);
          // Don't throw error - allow login to continue for development
          console.log('⚠️ [AUTH] Continuing without Supabase auth for development');
        }
      }

      const supabaseUser = authResult.data.user;
      if (!supabaseUser) {
        console.log('⚠️ [AUTH] No Supabase user returned, continuing with mock auth');
      }

      // Check if user profile exists ONLY in the selected role's table
      // This allows same phone number to have both farmer and buyer profiles
      let userProfile = null;
      let userRole: UserRole = null;

      console.log('🔍 [AUTH] Looking for user profile with phone:', phone);
      console.log('🔍 [AUTH] Selected role for lookup:', selectedRole);

      // IMPORTANT: Only check the selected role's table - NO FALLBACK to other role
      // This ensures users are logged in based on their selected role
      if (selectedRole === 'farmer') {
        console.log('🔍 [AUTH] Checking ONLY farmers table for phone:', phone);

        // Check farmers table by phone
        const { data: farmerProfile, error: farmerError } = await supabase
          .from('farmers')
          .select('*')
          .eq('phone', phone)
          .single();

        console.log('🔍 [AUTH] Farmer lookup result:', { farmerProfile, farmerError });

        if (farmerProfile) {
          userProfile = farmerProfile;
          userRole = 'farmer';
          console.log('✅ [AUTH] Existing farmer profile found for phone:', phone);
        } else {
          console.log('⚠️ [AUTH] No farmer profile found for phone:', phone);
          console.log('ℹ️ [AUTH] User will need to complete farmer registration');
        }
      } else if (selectedRole === 'buyer') {
        console.log('🔍 [AUTH] Checking ONLY buyers table for phone:', phone);

        // Check buyers table by phone
        const { data: buyerProfile, error: buyerError } = await supabase
          .from('buyers')
          .select('*')
          .eq('phone', phone)
          .single();

        console.log('🔍 [AUTH] Buyer lookup result:', { buyerProfile, buyerError });

        if (buyerProfile) {
          userProfile = buyerProfile;
          userRole = 'buyer';
          console.log('✅ [AUTH] Existing buyer profile found for phone:', phone);
        } else {
          console.log('⚠️ [AUTH] No buyer profile found for phone:', phone);
          console.log('ℹ️ [AUTH] User will need to complete buyer registration');
        }
      } else {
        console.log('⚠️ [AUTH] No role selected, cannot lookup profile');
      }

      // If still no profile found, user needs to complete registration
      if (!userProfile) {
        console.log('⚠️ [AUTH] No existing profile found - user needs to complete registration');
        console.log('🔍 [AUTH] Phone searched:', phone);
        console.log('🔍 [AUTH] Selected role from context:', selectedRole);
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
      console.log('📝 [REGISTER] Attempting registration for phone:', userData.phone);
      console.log('📝 [REGISTER] Role:', userData.role);

      if (!userData.phone || !userData.role) {
        throw new Error('Phone and role are required for registration');
      }

      // Create unique auth identifier
      const authIdentifier = `${userData.phone}@plotmyfarm.app`;

      console.log('🔄 [REGISTER] Creating Supabase auth user...');

      // Create Supabase auth user - handle errors gracefully
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authIdentifier,
        password: `temp_${userData.phone}_123456`, // Temporary password
      });

      if (authError) {
        console.error('❌ [REGISTER] Supabase auth error:', authError.message);
        // Check if user already exists
        if (authError.message.includes('already registered')) {
          console.log('⚠️ [REGISTER] User already exists in auth, attempting to get existing user...');
          // Try to sign in to get the user
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email: authIdentifier,
            password: `temp_${userData.phone}_123456`,
          });
          if (signInData.user) {
            console.log('✅ [REGISTER] Retrieved existing auth user');
            authData.user = signInData.user;
          }
        } else {
          throw new Error(`Registration failed: ${authError.message}`);
        }
      }

      const supabaseUser = authData.user;
      if (!supabaseUser) {
        throw new Error('No user returned from registration');
      }

      console.log('✅ [REGISTER] Supabase auth user created/retrieved:', supabaseUser.id);

      // Create user profile in appropriate table based on role
      const tableName = userData.role === 'farmer' ? 'farmers' : 'buyers';

      console.log('🔄 [REGISTER] Creating profile in table:', tableName);

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
        console.log('🌾 [REGISTER] Adding farmer-specific fields');
      } else if (userData.role === 'buyer') {
        userProfile.company_name = userData.companyName;
        userProfile.business_type = userData.businessType;
        console.log('🛒 [REGISTER] Adding buyer-specific fields');
      }

      console.log('📝 [REGISTER] Profile data to insert:', userProfile);

      const { data: createdProfile, error: createError } = await supabase
        .from(tableName)
        .insert([userProfile])
        .select()
        .single();

      if (createError) {
        console.error('❌ [REGISTER] Failed to create user profile in Supabase:', createError);
        console.error('❌ [REGISTER] Table:', tableName);
        console.error('❌ [REGISTER] Profile data:', userProfile);
        console.error('❌ [REGISTER] Error details:', createError.details);
        console.error('❌ [REGISTER] Error hint:', createError.hint);
        // Throw error instead of continuing - we need the data in Supabase
        throw new Error(`Failed to save profile to database: ${createError.message}`);
      }

      console.log('✅ [REGISTER] Profile created in Supabase:', createdProfile);

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
      console.log('🌐 [AUTH] Changing language to:', language);
      setSelectedLanguage(language);
      await AsyncStorage.setItem('language', language || '');

      // Update i18next language
      if (language) {
        await changeLanguage(language);
      }

      if (user) {
        const updatedUser = { ...user, language };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        // Update language in Supabase
        const { error } = await supabase
          .from('users')
          .update({ language })
          .eq('id', user.id);

        if (error) {
          console.error('❌ [AUTH] Failed to update language in Supabase:', error);
        } else {
          console.log('✅ [AUTH] Language updated in Supabase');
        }
      }

      console.log('✅ [AUTH] Language changed successfully to:', language);
    } catch (error) {
      console.error('❌ [AUTH] Language selection failed:', error);
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

