import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Screen() {
  const router = useRouter();
  const { isSignedIn, isLoading, hasSeenSplash, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isSignedIn && user) {
        // Navigate to role-specific home screen
        if (user.role === 'farmer') {
          console.log('DEBUG: Navigating to farmer-home');
          router.replace('/farmer-home');
        } else if (user.role === 'buyer') {
          console.log('DEBUG: Navigating to buyer-home');
          router.replace('/buyer-home');
        } else {
          // Fallback to select-role if role not set
          console.log('DEBUG: User role not set, navigating to select-role');
          router.replace('/select-role');
        }
      } else if (!hasSeenSplash) {
        console.log('DEBUG: First time user, navigating to splash');
        router.replace('/splash');
      } else {
        console.log('DEBUG: Returning user not signed in, navigating to select-role');
        router.replace('/select-role');
      }
    }
  }, [isLoading, isSignedIn, hasSeenSplash, user, router]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#004D2C" />
    </View>
  );
}