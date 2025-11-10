import { useRouter } from 'expo-router';
import { ArrowLeft, Package2 } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

export default function OrderConfirmation() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 p-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">{t('orderConfirmation.orderConfirmation')}</Text>
      </View>

      {/* Content */}
      <View className="flex-1 p-6 items-center">
        {/* Success Icon */}
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-6 mt-8">
          <Package2 size={40} color="#2563EB" />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-bold text-gray-800 mb-3">
          {t('orderConfirmation.orderPlacedSuccessfully')}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {t('orderConfirmation.orderReceivedMessage')}
        </Text>

        {/* Order Details */}
        <View className="w-full bg-gray-50 rounded-xl p-4 mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{t('orderConfirmation.orderNumber')}</Text>
            <Text className="text-gray-800 font-semibold">#123456789</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{t('orderConfirmation.estimatedDelivery')}</Text>
            <Text className="text-gray-800 font-semibold">{t('orderConfirmation.tomorrowTime')}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">{t('orderConfirmation.orderStatus')}</Text>
            <Text className="text-blue-600 font-semibold">{t('orderConfirmation.processing')}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={() => router.push('/my-orders')}
          className="w-full bg-blue-600 rounded-xl py-4 mb-3"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {t('orderConfirmation.trackOrder')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/farmer-home')}
          className="w-full bg-gray-100 rounded-xl py-4"
        >
          <Text className="text-gray-800 text-center font-semibold text-lg">
            {t('orderConfirmation.backToHome')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}