import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setSplashSeen, isLoading } = useAuth();

  const handleGetStarted = async () => {
    try {
      await setSplashSeen();
      // Navigate to role selection screen
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
            {t('splash.appName')}
          </Text>
          <Text className="text-lg text-center text-gray-600">
            {t('splash.tagline')}
          </Text>
        </View>

        {/* Features */}
        <View className="w-full space-y-4 mb-12">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-4 mt-1">
              <Text className="text-white font-bold">✓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{t('splash.directConnection')}</Text>
              <Text className="text-sm text-gray-600">{t('splash.directConnectionDesc')}</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-4 mt-1">
              <Text className="text-white font-bold">✓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{t('splash.fairPricing')}</Text>
              <Text className="text-sm text-gray-600">{t('splash.fairPricingDesc')}</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center mr-4 mt-1">
              <Text className="text-white font-bold">✓</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{t('splash.easyTrading')}</Text>
              <Text className="text-sm text-gray-600">{t('splash.easyTradingDesc')}</Text>
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
          <Text className="text-white text-lg font-bold">{t('splash.getStarted')}</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 text-sm">
          {t('splash.termsAgreement')}
        </Text>
      </View>
    </View>
  );
}

