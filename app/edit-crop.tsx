import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { cropService } from '@/services/crop-service';
import { speechToTextService } from '@/services/speech-to-text-service';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronDown, Mic, Upload } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditCrop() {
  const router = useRouter();
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(!!cropId);
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

  const [recordingField, setRecordingField] = useState<string | null>(null);

  const units = ['kg', 'quintal', 'ton', 'bag', 'bunch'];
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  // Fetch crop details if in edit mode
  useEffect(() => {
    if (cropId) {
      loadCropDetails();
    }
  }, [cropId]);

  const loadCropDetails = async () => {
    if (!cropId) return;

    try {
      setLoading(true);
      const crop = await cropService.getCropById(cropId);

      if (crop) {
        setFormData({
          image: crop.image_url || '',
          cropName: crop.name || '',
          quantity: crop.quantity?.toString() || '',
          unit: crop.unit || 'kg',
          price: crop.price_per_unit?.toString() || '',
          harvestDate: crop.expected_harvest_date || ''
        });
      } else {
        Alert.alert(t('common.error'), t('errors.cropNotFound'));
        router.back();
      }
    } catch (error) {
      console.error('Error loading crop:', error);
      Alert.alert(t('common.error'), t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

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
        setFormData({ ...formData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), t('errors.imagePickFailed'));
    }
  };

  // Date picker function
  const handleDatePick = () => {
    // For now, just set today's date if empty, or keep existing
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    setFormData({ ...formData, harvestDate: dateString });
  };

  // Voice input function
  const handleVoiceInput = async (field: string) => {
    try {
      if (recordingField === field) {
        // Stop recording
        console.log('🛑 Stopping voice recording for field:', field);
        const uri = await speechToTextService.stopRecording();
        setRecordingField(null);

        if (uri) {
          const text = await speechToTextService.transcribeAudio(uri, 'en');
          if (text) {
            console.log('✅ Transcribed text:', text);
            const cleanText = text.replace(/\.$/, '');
            setFormData(prev => ({ ...prev, [field]: cleanText }));
          }
        }
      } else {
        // Start recording
        if (recordingField) {
          await speechToTextService.stopRecording();
        }
        console.log('🎤 Starting voice recording for field:', field);
        await speechToTextService.startRecording();
        setRecordingField(field);
      }
    } catch (error) {
      console.error('Voice input error:', error);
      Alert.alert(t('common.error'), 'Voice input failed. Please try again.');
      setRecordingField(null);
    }
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

    // Validate and format date
    let formattedDate = formData.harvestDate;
    const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = formData.harvestDate.match(ddmmyyyyPattern);

    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);

      if (month < 1 || month > 12 || day < 1 || day > 31) {
        Alert.alert(t('common.error'), 'Invalid date. Please check the day and month.');
        return;
      }

      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        Alert.alert(t('common.error'), `Invalid date. ${month}/${year} only has ${daysInMonth} days.`);
        return;
      }

      formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else {
      const dateObj = new Date(formData.harvestDate);
      if (isNaN(dateObj.getTime())) {
        Alert.alert(t('common.error'), 'Invalid date format. Please use DD/MM/YYYY or YYYY-MM-DD.');
        return;
      }
      formattedDate = dateObj.toISOString().split('T')[0];
    }

    setIsSaving(true);

    try {
      const isNewImage = formData.image && !formData.image.startsWith('http');

      const cropData = {
        farmer_id: user?.id || '',
        name: formData.cropName,
        crop_type: formData.cropName,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        price_per_unit: parseFloat(formData.price),
        expected_harvest_date: formattedDate,
        image_uri: isNewImage ? formData.image : undefined,
        certification: 'Organic', // Default or add field
      };

      let result;
      if (cropId) {
        // Update existing crop
        result = await cropService.updateCrop(cropId, cropData);
      } else {
        // Create new crop
        result = await cropService.createCrop(cropData);
      }

      if (result) {
        console.log('✅ Crop saved successfully:', result.id);
        Alert.alert(
          t('common.success'),
          cropId ? t('success.cropUpdated') : t('success.cropAdded'),
          [
            {
              text: t('common.ok'),
              onPress: () => router.back()
            }
          ]
        );
      } else {
        throw new Error('Save failed');
      }
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
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F3F0]">
        <ActivityIndicator size="large" color="#7C8B3A" />
        <Text className="text-gray-500 mt-4">Loading crop details...</Text>
      </View>
    );
  }

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
          <Text className="text-xl font-bold text-white">
            {cropId ? t('crops.editCrop') : t('crops.addNewCrop')}
          </Text>
        </View>
        <Text className="text-white/80">
          {cropId ? t('crops.updateCropInfo') : t('crops.addCropDetailsToSell')}
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
                onChangeText={(text) => setFormData({ ...formData, cropName: text })}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => handleVoiceInput('cropName')}
              >
                <Mic
                  size={24}
                  color={recordingField === 'cropName' ? '#EF4444' : '#9CA3AF'}
                  fill={recordingField === 'cropName' ? '#EF4444' : 'none'}
                />
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
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => handleVoiceInput('quantity')}
                >
                  <Mic
                    size={24}
                    color={recordingField === 'quantity' ? '#EF4444' : '#9CA3AF'}
                    fill={recordingField === 'quantity' ? '#EF4444' : 'none'}
                  />
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
                        setFormData({ ...formData, unit });
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
                onChangeText={(text) => setFormData({ ...formData, price: text })}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => handleVoiceInput('price')}
              >
                <Mic
                  size={24}
                  color={recordingField === 'price' ? '#EF4444' : '#9CA3AF'}
                  fill={recordingField === 'price' ? '#EF4444' : 'none'}
                />
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
                onChangeText={(text) => setFormData({ ...formData, harvestDate: text })}
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