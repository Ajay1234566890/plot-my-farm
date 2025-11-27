import BuyerBottomNav from "@/app/components/BuyerBottomNav";
import { formAutomationService } from "@/services/form-automation-service";
import { screenContextService } from "@/services/screen-context-service";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateRequest() {
  const router = useRouter();
  const { t } = useTranslation();

  const cropTypes = [
    t('crops.rice'),
    t('crops.wheat'),
    t('crops.corn'),
    t('crops.soybeans'),
    t('crops.potatoes'),
    t('crops.tomatoes'),
    t('crops.onions'),
    t('crops.cotton'),
  ];

  const [cropType, setCropType] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showCropTypes, setShowCropTypes] = useState(false);

  // Register screen context and form fields for voice automation
  useEffect(() => {
    console.log('📋 [CREATE-REQUEST] Registering screen context and form fields');

    // Set screen context
    screenContextService.setContext({
      screenName: 'buyer-offers' as any,
      screenTitle: 'Create Purchase Request',
      hasForm: true,
      formFields: ['cropType', 'quantityNeeded', 'maxPrice', 'deliveryDate'],
      userRole: 'buyer',
    });

    // Register form fields with automation service
    formAutomationService.registerField('create-request', 'cropType', setCropType, () => cropType);
    formAutomationService.registerField('create-request', 'quantityNeeded', setQuantityNeeded, () => quantityNeeded);
    formAutomationService.registerField('create-request', 'maxPrice', setMaxPrice, () => maxPrice);
    formAutomationService.registerField('create-request', 'deliveryDate', setDeliveryDate, () => deliveryDate);

    // Cleanup on unmount
    return () => {
      console.log('🧹 [CREATE-REQUEST] Cleaning up screen context and form fields');
      formAutomationService.unregisterScreen('create-request');
    };
  }, [cropType, quantityNeeded, maxPrice, deliveryDate]);

  const handleSubmit = () => {
    // Validation
    if (!cropType || !quantityNeeded || !maxPrice) {
      Alert.alert(
        t('common.error'),
        'Please fill in all required fields (Crop Type, Quantity, Max Price)',
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Create the purchase request
    const requestData = {
      title: `Looking for ${cropType}`,
      cropType: cropType,
      quantity: `${quantityNeeded} kg needed`,
      maxPrice: `₹${maxPrice}/kg`,
      location: deliveryLocation || t('buyerOffers.delhiNCR'),
      status: "active",
      responses: 0,
      createdDate: t('common.today')
    };

    console.log('✅ [CREATE-REQUEST] Purchase request created:', requestData);

    Alert.alert(
      t('common.success'),
      'Purchase request created successfully! Farmers will be notified.',
      [
        {
          text: t('common.ok'),
          onPress: () => router.push("/buyer-offers"),
        },
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#B27E4C', // Buyer brown/copper color
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">
            {t('buyerOffers.createRequest')}
          </Text>
        </View>
        <Text className="text-white/80">
          Tell farmers what crops you need to purchase
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-24" showsVerticalScrollIndicator={false}>
        {/* Crop Type */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Crop Type *</Text>
          <TouchableOpacity
            onPress={() => setShowCropTypes(!showCropTypes)}
            className="border border-gray-300 rounded-lg p-4 bg-white"
          >
            <Text className={cropType ? "text-gray-900" : "text-gray-400"}>
              {cropType || "Select crop type"}
            </Text>
          </TouchableOpacity>

          {showCropTypes && (
            <View className="border border-gray-300 rounded-lg mt-2 bg-white">
              {cropTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setCropType(type);
                    setShowCropTypes(false);
                  }}
                  className="p-4 border-b border-gray-200"
                >
                  <Text className="text-gray-900">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quantity Needed */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Quantity Needed (kg) *</Text>
          <TextInput
            value={quantityNeeded}
            onChangeText={setQuantityNeeded}
            placeholder="e.g., 100"
            className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>

        {/* Max Price */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Maximum Price (₹/kg) *</Text>
          <TextInput
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholder="e.g., 50"
            className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Delivery Location */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Delivery Location</Text>
          <TextInput
            value={deliveryLocation}
            onChangeText={setDeliveryLocation}
            placeholder="e.g., Delhi NCR"
            className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Delivery Date */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Required By Date</Text>
          <TextInput
            value={deliveryDate}
            onChangeText={setDeliveryDate}
            placeholder="e.g., 2024-12-31"
            className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Additional Notes */}
        <View className="mt-6 mb-8">
          <Text className="text-gray-600 mb-2">Additional Requirements</Text>
          <TextInput
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="e.g., Organic only, Grade A quality required"
            className="border border-gray-300 rounded-lg p-4 min-h-[120px] text-gray-900 bg-white"
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg py-4 mb-8"
          style={{ backgroundColor: '#B27E4C' }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create Purchase Request
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
