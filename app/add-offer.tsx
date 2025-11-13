import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useOffers } from "@/contexts/offers-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Crop type to image mapping with high-quality images
const cropImageMap: { [key: string]: string } = {
  'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Wheat': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Soybeans': 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Cotton': 'https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
  'Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3',
};

export default function AddOffer() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const { addOffer, updateOffer } = useOffers();

  // Check if we're in edit mode
  const isEditMode = params.editMode === 'true';
  const offerId = params.offerId ? parseInt(params.offerId as string) : null;

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
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [availabilityDates, setAvailabilityDates] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showCropTypes, setShowCropTypes] = useState(false);

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode && params.cropType) {
      setCropType(params.cropType as string);
      setQuantity((params.quantity as string)?.replace(' kg', '') || '');
      setPricePerUnit((params.price as string)?.replace('₹', '').replace('/kg', '') || '');
    }
  }, [isEditMode, params]);

  const handleSubmit = () => {
    // Validation
    if (!cropType || !quantity || !pricePerUnit) {
      Alert.alert(
        t('common.error'),
        t('addOffer.fillRequiredFields'),
        [{ text: t('common.ok') }]
      );
      return;
    }

    // Get the English crop name for image mapping
    const cropTypeEnglish = cropType.split(' ').pop() || cropType;
    const image = cropImageMap[cropTypeEnglish] || cropImageMap['Tomatoes'];

    // Create/Update the offer
    const offerData = {
      title: `${t('crops.fresh')} ${cropType}`,
      cropType: cropType,
      price: `₹${pricePerUnit}/kg`,
      quantity: `${quantity} kg`,
      image: image,
    };

    if (isEditMode && offerId) {
      // Update existing offer
      updateOffer(offerId, offerData);
      Alert.alert(
        t('common.success'),
        'Offer updated successfully!',
        [
          {
            text: t('common.ok'),
            onPress: () => router.push("/farmer-offers"),
          },
        ]
      );
    } else {
      // Create new offer
      addOffer(offerData);
      Alert.alert(
        t('common.success'),
        t('addOffer.offerCreatedSuccess'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.push("/farmer-offers"),
          },
        ]
      );
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#7C8B3A', // Olive/army green matching farmer-home
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
            {isEditMode ? 'Edit Offer' : t('addOffer.createOffer')}
          </Text>
        </View>
        <Text className="text-white/80">
          {isEditMode ? 'Update your offer details' : t('addOffer.createOfferSubtitle')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-24" showsVerticalScrollIndicator={false}>
        {/* Crop Type */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.cropType')}</Text>
          <TouchableOpacity
            onPress={() => setShowCropTypes(!showCropTypes)}
            className="border border-gray-300 rounded-lg p-4"
          >
            <Text className={cropType ? "text-gray-900" : "text-gray-400"}>
              {cropType || t('addOffer.selectCropType')}
            </Text>
          </TouchableOpacity>

          {showCropTypes && (
            <View className="border border-gray-300 rounded-lg mt-2">
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

        {/* Quantity Available */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.quantityAvailable')}</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder={t('addOffer.quantityPlaceholder')}
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Price per Unit */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.pricePerUnit')}</Text>
          <TextInput
            value={pricePerUnit}
            onChangeText={setPricePerUnit}
            placeholder={t('addOffer.pricePlaceholder')}
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Minimum Order Quantity */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.minOrderQuantity')}</Text>
          <TextInput
            value={minOrderQuantity}
            onChangeText={setMinOrderQuantity}
            placeholder={t('addOffer.minOrderPlaceholder')}
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Availability Dates */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.availabilityDates')}</Text>
          <TextInput
            value={availabilityDates}
            onChangeText={setAvailabilityDates}
            placeholder={t('addOffer.datesPlaceholder')}
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Additional Notes */}
        <View className="mt-6 mb-8">
          <Text className="text-gray-600 mb-2">{t('addOffer.additionalNotes')}</Text>
          <TextInput
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder={t('addOffer.notesPlaceholder')}
            className="border border-gray-300 rounded-lg p-4 min-h-[120px] text-gray-900"
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-emerald-600 rounded-lg py-4 mb-8"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {t('addOffer.postOffer')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}