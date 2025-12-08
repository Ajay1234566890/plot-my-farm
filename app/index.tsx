import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Screen() {
  const router = useRouter();
  const segments = useSegments();
  const { isSignedIn, isLoading, hasSeenSplash, user } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Only run navigation logic once when app first loads
    if (!isLoading && !hasNavigated.current) {
      console.log('🔄 [INDEX] App initialization complete, routing user...');
      console.log('📊 [INDEX] Auth state:', {
        isSignedIn,
        hasUser: !!user,
        userRole: user?.role,
        userId: user?.id,
        userName: user?.name,
        currentSegments: segments,
      });

      // Check if user is already on a valid screen (auth flow or registration flow)
      const currentScreen = segments.length > 0 ? segments[0] : null;
      const validScreens = [
        'farmer-home',
        'buyer-home',
        'farmer-profile-setup',
        'buyer-profile-setup',
        'farmer-registration',
        'login',
        'select-role',
        'splash'
      ];

      // If user is already on any valid screen, don't redirect
      if (currentScreen && validScreens.includes(currentScreen)) {
        console.log('✅ [INDEX] User already on valid screen:', currentScreen, '- skipping navigation');
        hasNavigated.current = true;
        return;
      }

      // Add a small delay to ensure state is fully updated
      const navigationTimeout = setTimeout(() => {
        // Double-check we haven't navigated elsewhere in the meantime
        const latestScreen = segments.length > 0 ? segments[0] : null;
        if (latestScreen && validScreens.includes(latestScreen)) {
          console.log('✅ [INDEX] User navigated to', latestScreen, 'during timeout - aborting navigation');
          hasNavigated.current = true;
          return;
        }

        if (isSignedIn && user && user.role) {
          // Navigate to role-specific home screen
          console.log('✅ [INDEX] User is signed in with role:', user.role);
          if (user.role === 'farmer') {
            console.log('🚜 [INDEX] User is a farmer, navigating to farmer-home');
            router.replace('/farmer-home');
          } else if (user.role === 'buyer') {
            console.log('🛒 [INDEX] User is a buyer, navigating to buyer-home');
            router.replace('/buyer-home');
          } else {
            // Fallback to select-role if role not recognized
            console.log('⚠️ [INDEX] User role not recognized, navigating to select-role');
            router.replace('/select-role');
          }
        } else if (!hasSeenSplash) {
          console.log('👋 [INDEX] First time user, navigating to splash');
          router.replace('/splash');
        } else {
          console.log('🔓 [INDEX] Returning user not signed in, navigating to select-role');
          router.replace('/select-role');
        }
        hasNavigated.current = true;
      }, 100); // Small delay to ensure state is updated

      return () => clearTimeout(navigationTimeout);
    }
  }, [isLoading]); // Only depend on isLoading, not on user or isSignedIn

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#004D2C" />
    </View>
  );
}