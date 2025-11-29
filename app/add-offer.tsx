import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { useOffers } from "@/contexts/offers-context";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { offers, addOffer, updateOffer } = useOffers();

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
  const [isSaving, setIsSaving] = useState(false);

  // Register screen context and form fields for voice automation
  useEffect(() => {
    /*
    // Temporarily disabled to prevent crashes
    console.log('📋 [ADD-OFFER] Registering screen context and form fields');

    // Set screen context
    screenContextService.setContext({
      screenName: 'add-offer',
      screenTitle: 'Add Offer',
      hasForm: true,
      formFields: ['cropName', 'offerPrice', 'quantity', 'validUntil'],
      userRole: 'farmer',
    });

    // Register form fields with automation service
    // Note: Form definition uses 'cropName' but state uses 'cropType'
    formAutomationService.registerField('add-offer', 'cropName', setCropType, () => cropType);
    formAutomationService.registerField('add-offer', 'offerPrice', setPricePerUnit, () => pricePerUnit);
    formAutomationService.registerField('add-offer', 'quantity', setQuantity, () => quantity);
    formAutomationService.registerField('add-offer', 'validUntil', setAvailabilityDates, () => availabilityDates);

    // Cleanup on unmount
    return () => {
      console.log('🧹 [ADD-OFFER] Cleaning up screen context and form fields');
      formAutomationService.unregisterScreen('add-offer');
    };
    */
  }, [cropType, pricePerUnit, quantity, availabilityDates]);

  // Load existing data if in edit mode
  useEffect(() => {
    try {
      if (isEditMode && offerId) {
        // Find the offer in the context
        const existingOffer = offers?.find(o => o.id === offerId);

        if (existingOffer) {
          console.log('📝 [ADD-OFFER] Loading existing offer for edit:', existingOffer);
          setCropType(existingOffer.cropType || '');
          setQuantity(existingOffer.quantity?.replace(' kg', '') || '');
          setPricePerUnit(existingOffer.price?.replace('₹', '').replace('/kg', '') || '');
        } else if (params.cropType) {
          // Fallback to params if offer not found in context
          setCropType((params.cropType as string) || '');
          setQuantity((params.quantity as string)?.replace(' kg', '') || '');
          setPricePerUnit((params.price as string)?.replace('₹', '').replace('/kg', '') || '');
        }
      }
    } catch (error) {
      console.error('❌ [ADD-OFFER] Error loading offer data:', error);
      // Don't crash, just log the error
    }
  }, [isEditMode, offerId, offers, params]);

  const handleSubmit = async () => {
    // Validation
    if (!cropType || !quantity || !pricePerUnit) {
      Alert.alert(
        t('common.error'),
        t('addOffer.fillRequiredFields'),
        [{ text: t('common.ok') }]
      );
      return;
    }

    if (!user?.id) {
      Alert.alert(t('common.error'), 'User not logged in');
      return;
    }

    setIsSaving(true);

    try {
      // Get the English crop name for image mapping
      const cropTypeEnglish = cropType.split(' ').pop() || cropType;
      const image = cropImageMap[cropTypeEnglish] || cropImageMap['Tomatoes'];

      // Prepare offer data for Supabase
      const offerDbData = {
        farmer_id: user.id,
        title: `${t('crops.fresh')} ${cropType}`,
        crop_type: cropType,
        price: parseFloat(pricePerUnit),
        quantity: parseFloat(quantity),
        unit: 'kg',
        min_order_quantity: minOrderQuantity ? parseFloat(minOrderQuantity) : null,
        image_url: image,
        status: 'active' as const,
      };

      if (isEditMode && offerId) {
        // Update existing offer in Supabase
        console.log('📝 [ADD-OFFER] Updating offer:', offerId);
        const { data, error } = await supabase
          .from('farmer_offers')
          .update(offerDbData)
          .eq('id', offerId)
          .select()
          .single();

        if (error) {
          console.error('❌ [ADD-OFFER] Update failed:', error);
          Alert.alert(t('common.error'), `Failed to update offer: ${error.message}`);
          return;
        }

        console.log('✅ [ADD-OFFER] Offer updated:', data);

        // Also update context for UI
        updateOffer(offerId, {
          title: offerDbData.title,
          cropType: offerDbData.crop_type,
          price: `₹${pricePerUnit}/kg`,
          quantity: `${quantity} kg`,
          image: image,
        });

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
        // Create new offer in Supabase
        console.log('➕ [ADD-OFFER] Creating new offer');
        const { data, error } = await supabase
          .from('farmer_offers')
          .insert([offerDbData])
          .select()
          .single();

        if (error) {
          console.error('❌ [ADD-OFFER] Create failed:', error);
          Alert.alert(t('common.error'), `Failed to create offer: ${error.message}`);
          return;
        }

        console.log('✅ [ADD-OFFER] Offer created:', data);

        // Also add to context for UI
        addOffer({
          title: offerDbData.title,
          cropType: offerDbData.crop_type,
          price: `₹${pricePerUnit}/kg`,
          quantity: `${quantity} kg`,
          image: image,
        });

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
    } catch (error) {
      console.error('❌ [ADD-OFFER] Exception:', error);
      Alert.alert(t('common.error'), 'An error occurred while saving the offer.');
    } finally {
      setIsSaving(false);
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
            keyboardType="decimal-pad"
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
            keyboardType="decimal-pad"
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
          disabled={isSaving}
          className="rounded-lg py-4 mb-8"
          style={{ backgroundColor: isSaving ? '#9CA3AF' : '#059669' }}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              {isEditMode ? t('common.update') : t('addOffer.postOffer')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}