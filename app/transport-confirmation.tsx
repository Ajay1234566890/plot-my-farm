import { Clock, DollarSign, Leaf, MapPin, Truck } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function TransportConfirmation() {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Text className="text-xl font-semibold text-gray-800">{t('transportConfirmation.transportSummary')}</Text>
      </View>

      {/* Pickup Details Section */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{t('transportConfirmation.pickupDetails')}</Text>

        <View className="flex-row items-start mb-3">
          <MapPin className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('transportConfirmation.pickupAddress')}</Text>
            <Text className="text-gray-600">{t('transportConfirmation.samplePickupAddress')}</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-3">
          <Clock className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('transportConfirmation.pickupTime')}</Text>
            <Text className="text-gray-600">{t('transportConfirmation.available9to5')}</Text>
          </View>
        </View>
      </View>

      {/* Delivery Details Section */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{t('transportConfirmation.deliveryDetails')}</Text>

        <View className="flex-row items-start mb-3">
          <MapPin className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('checkout.deliveryAddress')}</Text>
            <Text className="text-gray-600">{t('transportConfirmation.sampleDeliveryAddress')}</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-3">
          <Clock className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('transportConfirmation.deliveryTime')}</Text>
            <Text className="text-gray-600">{t('transportConfirmation.preferred10to6')}</Text>
          </View>
        </View>
      </View>

      {/* Crop Information */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{t('transportConfirmation.cropInformation')}</Text>

        <View className="flex-row items-start mb-3">
          <Leaf className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('transportConfirmation.cropTypeTomatoes')}</Text>
            <Text className="text-gray-600">{t('transportConfirmation.weight1000lbs')}</Text>
          </View>
        </View>
      </View>

      {/* Transport Preferences */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{t('transportConfirmation.transportPreferences')}</Text>

        <View className="flex-row items-start mb-3">
          <Truck className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('transportConfirmation.vehicleTypeRefrigeratedTruck')}</Text>
          </View>
        </View>
      </View>

      {/* Cost */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">{t('transportConfirmation.cost')}</Text>

        <View className="flex-row items-start mb-3">
          <DollarSign className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">{t('transportConfirmation.estimatedCost250')}</Text>
          </View>
        </View>
      </View>

      {/* Confirm Button */}
      <View className="p-4 mt-2">
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-4 items-center"
          onPress={() => {
            // Handle booking confirmation
          }}
        >
          <Text className="text-white font-semibold text-lg">{t('transportConfirmation.confirmBooking')}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom padding for scrolling */}
      <View className="h-8" />
    </ScrollView>
  );
}