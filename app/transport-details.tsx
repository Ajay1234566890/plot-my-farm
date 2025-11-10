import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Package,
    Phone,
    Truck
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function TransportDetailsScreen() {
  const { t } = useTranslation();
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [cropType, setCropType] = useState("");
  const [weight, setWeight] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const handleArrangeTransport = () => {
    // In a real app, this would call an API
    console.log("Transport arranged with details:", {
      pickupLocation,
      deliveryLocation,
      pickupDate,
      deliveryDate,
      cropType,
      weight,
      contactNumber,
    });
    // Show confirmation or navigate to confirmation screen
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      {/* Header with blue theme */}
      <LinearGradient
        colors={["#1e40af", "#3b82f6"]}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('transport.transportDetails')}</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-6 mb-24">
        {/* Page Title */}
        <Text className="text-gray-800 text-2xl font-bold mb-2">
          {t('transport.arrangeTransport')}
        </Text>
        <Text className="text-gray-500 mb-6">
          {t('transportDetails.fillDetails')}
        </Text>

        {/* Form Section */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <MapPin color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transport.pickupLocation')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.enterPickupAddress')}
              value={pickupLocation}
              onChangeText={setPickupLocation}
            />
          </View>

          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <MapPin color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transportDetails.deliveryLocation')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.enterDeliveryAddress')}
              value={deliveryLocation}
              onChangeText={setDeliveryLocation}
            />
          </View>

          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Calendar color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transport.pickupDate')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.selectPickupDate')}
              value={pickupDate}
              onChangeText={setPickupDate}
            />
          </View>

          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Calendar color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transportDetails.deliveryDate')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.selectDeliveryDate')}
              value={deliveryDate}
              onChangeText={setDeliveryDate}
            />
          </View>

          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Package color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transportDetails.cropType')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.enterCropType')}
              value={cropType}
              onChangeText={setCropType}
            />
          </View>

          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <Package color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transportDetails.weightKg')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.enterWeightKg')}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          <View>
            <View className="flex-row items-center mb-2">
              <Phone color="#3b82f6" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">{t('transportDetails.contactNumber')}</Text>
            </View>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              placeholder={t('transportDetails.enterContactNumber')}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Transport Information */}
        <View className="bg-blue-50 rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Truck color="#3b82f6" size={24} className="mr-2" />
            <Text className="text-blue-800 font-bold">{t('transportDetails.transportInformation')}</Text>
          </View>
          <Text className="text-gray-600 mb-2">
            • {t('transportDetails.estimatedDeliveryTime')}
          </Text>
          <Text className="text-gray-600 mb-2">
            • {t('transportDetails.insuranceIncluded')}
          </Text>
          <Text className="text-gray-600">
            • {t('transportDetails.realTimeTracking')}
          </Text>
        </View>
      </ScrollView>

      {/* Blue Button */}
      <View className="absolute bottom-20 left-0 right-0 px-4">
        <TouchableOpacity
          className="bg-blue-500 rounded-xl py-4 items-center justify-center"
          onPress={handleArrangeTransport}
        >
          <Text className="text-white font-bold text-base">
            {t('transportDetails.confirmTransportArrangement')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}