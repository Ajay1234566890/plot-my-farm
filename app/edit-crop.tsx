import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronDown, Mic, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditCrop() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    cropName: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: ''
  });

  const [errors, setErrors] = useState({
    cropName: false,
    quantity: false,
    price: false,
    harvestDate: false
  });

  const units = ['kg', 'quintal', 'ton', 'bag', 'bunch'];
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  // Image picker function
  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
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
        setFormData({...formData, image: result.assets[0].uri});
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), t('errors.imagePickFailed'));
    }
  };

  // Date picker function (simplified - you can use a proper date picker library)
  const handleDatePick = () => {
    // For now, just set today's date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    setFormData({...formData, harvestDate: dateString});
  };

  // Voice input function
  const handleVoiceInput = () => {
    Alert.alert(t('common.info'), 'Voice input feature coming soon!');
  };

  const handleSave = async () => {
    const newErrors = {
      cropName: !formData.cropName,
      quantity: !formData.quantity,
      price: !formData.price,
      harvestDate: !formData.harvestDate
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      Alert.alert(t('common.error'), t('errors.fillAllFields'));
      return;
    }

    setIsSaving(true);

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('farmer_crops')
        .insert([
          {
            farmer_id: user?.id,
            name: formData.cropName,
            crop_type: formData.cropName, // Add crop type
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
            price_per_unit: parseFloat(formData.price),
            expected_harvest_date: formData.harvestDate,
            image_url: formData.image,
            status: 'growing',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error saving crop:', error);
        Alert.alert(t('common.error'), 'Failed to save crop: ' + error.message);
        return;
      }

      console.log('✅ Crop saved successfully:', data);
      Alert.alert(
        t('common.success'),
        t('success.cropUpdated'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving crop:', error);
      Alert.alert(t('common.error'), 'Failed to save crop');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      image: '',
      cropName: '',
      quantity: '',
      unit: 'kg',
      price: '',
      harvestDate: ''
    });
    // Navigation would go here in a real app
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
            accessibilityLabel={t('common.goBack')}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('crops.editCrop')}</Text>
        </View>
        <Text className="text-white/80">
          {t('crops.updateCropInfo')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

        <View
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
        {/* Upload Image */}
        <Text className="text-base text-gray-700 mb-2">{t('crops.uploadImage')}</Text>
        <TouchableOpacity
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center mb-6"
          onPress={handleImagePick}
        >
          {formData.image ? (
            <Image
              source={{ uri: formData.image }}
              className="w-full h-48 rounded-lg mb-2"
              resizeMode="cover"
            />
          ) : (
            <>
              <Upload size={24} className="text-gray-400 mb-2" />
              <Text className="text-gray-500 text-center">{t('crops.clickToUpload')}</Text>
              <Text className="text-gray-400 text-sm">{t('crops.imageFormats')}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Crop Name */}
        <View className="mb-4">
          <Text className="text-base text-gray-700 mb-2">{t('crops.cropName')}</Text>
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.cropName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={t('crops.cropNamePlaceholderEdit')}
              placeholderTextColor="#9CA3AF"
              value={formData.cropName}
              onChangeText={(text) => setFormData({...formData, cropName: text})}
            />
            <TouchableOpacity className="absolute right-3 top-3" onPress={handleVoiceInput}>
              <Mic size={24} className="text-gray-400" />
            </TouchableOpacity>
          </View>
          {errors.cropName && <Text className="text-red-500 text-sm mt-1">{t('errors.cropNameRequired')}</Text>}
        </View>

        {/* Quantity and Unit */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-base text-gray-700 mb-2">{t('crops.quantity')}</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={t('crops.quantityPlaceholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(text) => setFormData({...formData, quantity: text})}
              />
              <TouchableOpacity className="absolute right-3 top-3">
                <Mic size={24} className="text-gray-400" />
              </TouchableOpacity>
            </View>
            {errors.quantity && <Text className="text-red-500 text-sm mt-1">{t('errors.quantityRequired')}</Text>}
          </View>

          <View className="w-32">
            <Text className="text-base text-gray-700 mb-2">{t('crops.unit')}</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
              onPress={() => setShowUnitDropdown(!showUnitDropdown)}
            >
              <Text className="text-base text-gray-700">{formData.unit}</Text>
              <ChevronDown size={20} className="text-gray-400" />
            </TouchableOpacity>
            {showUnitDropdown && (
              <View className="absolute top-[74px] left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1">
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    className="p-3 border-b border-gray-100"
                    onPress={() => {
                      setFormData({...formData, unit});
                      setShowUnitDropdown(false);
                    }}
                  >
                    <Text className="text-base text-gray-700">{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="text-base text-gray-700 mb-2">{t('crops.pricePerUnit')}</Text>
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={t('crops.pricePlaceholderEdit')}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
            />
            <TouchableOpacity className="absolute right-3 top-3" onPress={handleVoiceInput}>
              <Mic size={24} className="text-gray-400" />
            </TouchableOpacity>
          </View>
          {errors.price && <Text className="text-red-500 text-sm mt-1">{t('errors.priceRequired')}</Text>}
        </View>

        {/* Harvest Date */}
        <View className="mb-8">
          <Text className="text-base text-gray-700 mb-2">{t('crops.harvestDate')}</Text>
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.harvestDate ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={t('crops.dateFormat')}
              placeholderTextColor="#9CA3AF"
              value={formData.harvestDate}
              onChangeText={(text) => setFormData({...formData, harvestDate: text})}
            />
            <TouchableOpacity className="absolute right-3 top-3" onPress={handleDatePick}>
              <Calendar size={24} className="text-gray-400" />
            </TouchableOpacity>
          </View>
          {errors.harvestDate && <Text className="text-red-500 text-sm mt-1">{t('errors.harvestDateRequired')}</Text>}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 p-3 border border-green-500 rounded-lg"
            onPress={handleCancel}
          >
            <Text className="text-green-500 text-center text-base font-medium">{t('common.cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 p-3 rounded-lg"
            style={{ backgroundColor: isSaving ? '#9CA3AF' : '#7C8B3A' }}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text className="text-white text-center text-base font-medium">
              {isSaving ? t('common.saving') || 'Saving...' : t('common.save')}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}