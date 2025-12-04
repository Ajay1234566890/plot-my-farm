import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { useOffers } from "@/contexts/offers-context";
import { supabase } from "@/utils/supabase";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Upload } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Crop type to image mapping with high-quality images (fallback)
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
  const { offers, refreshOffers } = useOffers();

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
    'Other'
  ];

  const [cropType, setCropType] = useState("");
  const [customCropType, setCustomCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [availabilityDates, setAvailabilityDates] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showCropTypes, setShowCropTypes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cropImage, setCropImage] = useState("");

  useEffect(() => {
    if (isEditMode && offerId && offers) {
      const existingOffer = offers.find(o => o.id === offerId);
      if (existingOffer) {
        if (cropTypes.includes(existingOffer.cropType || '')) {
          setCropType(existingOffer.cropType || '');
        } else {
          setCropType('Other');
          setCustomCropType(existingOffer.cropType || '');
        }
        setQuantity(existingOffer.quantity?.replace(' kg', '') || '');
        setPricePerUnit(existingOffer.price?.replace('₹', '').replace('/kg', '') || '');
        if (existingOffer.image) {
          setCropImage(existingOffer.image);
        }
      }
    }
  }, [isEditMode, offerId, offers]);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(t('common.error'), t('errors.cameraPermissionRequired'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCropImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), t('errors.imagePickFailed'));
    }
  };

  const handleSubmit = async () => {
    const finalCropType = cropType === 'Other' ? customCropType : cropType;

    if (!finalCropType || !quantity || !pricePerUnit) {
      Alert.alert(t('common.error'), t('addOffer.fillRequiredFields'));
      return;
    }

    if (!user?.id) {
      Alert.alert(t('common.error'), 'User not logged in');
      return;
    }

    setIsSaving(true);

    try {
      const cropTypeEnglish = finalCropType.split(' ').pop() || finalCropType;
      const image = cropImage || cropImageMap[cropTypeEnglish] || cropImageMap['Tomatoes'];

      const offerDbData = {
        farmer_id: user.id,
        title: `${t('crops.fresh')} ${finalCropType}`,
        crop_type: finalCropType,
        price: parseFloat(pricePerUnit),
        quantity: parseFloat(quantity),
        unit: 'kg',
        min_order_quantity: minOrderQuantity ? parseFloat(minOrderQuantity) : null,
        image_url: image,
        status: 'active' as const,
        description: additionalNotes || '',
        location: 'Farm Location',
        harvest_date: new Date().toISOString(),
      };

      let error;

      if (isEditMode && offerId) {
        const { error: updateError } = await supabase
          .from('farmer_offers')
          .update(offerDbData)
          .eq('id', offerId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('farmer_offers')
          .insert([offerDbData]);
        error = insertError;
      }

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (refreshOffers) {
        await refreshOffers();
      }

      Alert.alert(
        t('common.success'),
        isEditMode ? 'Offer updated successfully!' : t('addOffer.offerCreatedSuccess'),
        [{ text: t('common.ok'), onPress: () => router.push("/farmer-offers") }]
      );
    } catch (error: any) {
      console.error('Error saving offer:', error);
      Alert.alert(t('common.error'), error.message || t('addOffer.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      <View className="px-6 pt-12 pb-8" style={{ backgroundColor: '#7C8B3A', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4" onPress={() => router.back()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{isEditMode ? 'Edit Offer' : t('addOffer.createOffer')}</Text>
        </View>
        <Text className="text-white/80">{isEditMode ? 'Update your offer details' : t('addOffer.createOfferSubtitle')}</Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-24" showsVerticalScrollIndicator={false}>
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('crops.uploadImage')}</Text>
          <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center bg-white" onPress={handleImagePick}>
            {cropImage ? (
              <Image source={{ uri: cropImage }} className="w-full h-48 rounded-lg mb-2" resizeMode="cover" />
            ) : (
              <>
                <Upload size={24} color="#9CA3AF" />
                <Text className="text-gray-500 text-center">{t('crops.clickToUpload')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.cropType')}</Text>
          <TouchableOpacity onPress={() => setShowCropTypes(!showCropTypes)} className="border border-gray-300 rounded-lg p-4 bg-white">
            <Text className={cropType ? "text-gray-900" : "text-gray-400"}>{cropType || t('addOffer.selectCropType')}</Text>
          </TouchableOpacity>
          {showCropTypes && (
            <View className="border border-gray-300 rounded-lg mt-2 bg-white">
              {cropTypes.map((type) => (
                <TouchableOpacity key={type} onPress={() => { setCropType(type); setShowCropTypes(false); }} className="p-4 border-b border-gray-200">
                  <Text className="text-gray-900">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {cropType === 'Other' && (
            <View className="mt-4">
              <Text className="text-gray-600 mb-2">Enter Crop Type</Text>
              <TextInput
                value={customCropType}
                onChangeText={setCustomCropType}
                placeholder="e.g. Red Chilli"
                className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white"
                placeholderTextColor="#9ca3af"
              />
            </View>
          )}
        </View>

        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.quantityAvailable')}</Text>
          <TextInput value={quantity} onChangeText={setQuantity} placeholder={t('addOffer.quantityPlaceholder')} className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white" placeholderTextColor="#9ca3af" keyboardType="decimal-pad" />
        </View>

        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.pricePerUnit')}</Text>
          <TextInput value={pricePerUnit} onChangeText={setPricePerUnit} placeholder={t('addOffer.pricePlaceholder')} className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white" placeholderTextColor="#9ca3af" keyboardType="decimal-pad" />
        </View>

        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.minOrderQuantity')}</Text>
          <TextInput value={minOrderQuantity} onChangeText={setMinOrderQuantity} placeholder={t('addOffer.minOrderPlaceholder')} className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white" placeholderTextColor="#9ca3af" keyboardType="decimal-pad" />
        </View>

        <View className="mt-6">
          <Text className="text-gray-600 mb-2">{t('addOffer.availabilityDates')}</Text>
          <TextInput value={availabilityDates} onChangeText={setAvailabilityDates} placeholder={t('addOffer.datesPlaceholder')} className="border border-gray-300 rounded-lg p-4 text-gray-900 bg-white" placeholderTextColor="#9ca3af" />
        </View>

        <View className="mt-6 mb-8">
          <Text className="text-gray-600 mb-2">{t('addOffer.additionalNotes')}</Text>
          <TextInput value={additionalNotes} onChangeText={setAdditionalNotes} placeholder={t('addOffer.notesPlaceholder')} className="border border-gray-300 rounded-lg p-4 min-h-[120px] text-gray-900 bg-white" placeholderTextColor="#9ca3af" multiline textAlignVertical="top" />
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={isSaving} className="rounded-lg py-4 mb-8" style={{ backgroundColor: isSaving ? '#9CA3AF' : '#059669' }}>
          {isSaving ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold text-lg">{isEditMode ? t('common.update') : t('addOffer.postOffer')}</Text>}
        </TouchableOpacity>
      </ScrollView>

      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}