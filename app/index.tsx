import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Screen() {
  const router = useRouter();
  const { isSignedIn, isLoading, hasSeenSplash, user } = useAuth();

  useEffect(() => {
    // Wait for auth to be loaded
    if (!isLoading) {
      console.log('🔄 [INDEX] App initialization complete, routing user...');
      console.log('📊 [INDEX] Auth state:', {
        isSignedIn,
        hasUser: !!user,
        userRole: user?.role,
        userId: user?.id,
        userName: user?.name,
      });

      // Add a small delay to ensure state is fully updated
      const navigationTimeout = setTimeout(() => {
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
      }, 100); // Small delay to ensure state is updated

      return () => clearTimeout(navigationTimeout);
    }
  }, [isLoading, isSignedIn, hasSeenSplash, user, router]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#004D2C" />
    </View>
  );
}