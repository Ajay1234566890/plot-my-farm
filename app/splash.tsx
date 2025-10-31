import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { setSplashSeen, isLoading } = useAuth();

  const handleGetStarted = async () => {
    try {
      await setSplashSeen();
      router.replace('/select-role');
    } catch (error) {
      console.error('Error setting splash seen:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gradient-to-b from-green-50 to-white items-center justify-center">
        <ActivityIndicator size="large" color="#004D2C" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-green-50 to-white">
      {/* Header with Logo */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8">
          <View className="w-24 h-24 bg-green-600 rounded-full items-center justify-center mb-6">
            <Text className="text-5xl">🌾</Text>
          </View>
          <Text className="text-4xl font-bold text-center text-gray-800 mb-2">
            Plot My Farm
          </Text>
          <Text className="text-lg text-center text-gray-600">
            Connect Farmers & Buyers
          </Text>
        </View>

        {/* Features */}
        <View className="w-full space-y-4 mb-12">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-4 mt-1">
              <Text className="text-white font-bold">✓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Direct Connection</Text>
              <Text className="text-sm text-gray-600">Connect directly with farmers and buyers</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-4 mt-1">
              <Text className="text-white font-bold">✓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Fair Pricing</Text>
              <Text className="text-sm text-gray-600">Get real-time market prices</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-4 mt-1">
              <Text className="text-white font-bold">✓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Easy Trading</Text>
              <Text className="text-sm text-gray-600">Simple and secure transactions</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-12">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-green-600 rounded-xl py-4 items-center justify-center mb-4"
        >
          <Text className="text-white text-lg font-bold">Get Started</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

