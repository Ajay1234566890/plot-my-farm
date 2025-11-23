import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { formAutomationService } from "@/services/form-automation-service";
import { screenContextService } from "@/services/screen-context-service";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    Mic,
    Upload
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Mock data for units
const units = ["Kg", "Ton", "Quintal", "Pieces"];

export default function AddCrop() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedUnit, setSelectedUnit] = useState("");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [harvestDate, setHarvestDate] = useState("");

  // Register screen context and form fields for voice automation
  useEffect(() => {
    console.log('📋 [ADD-CROP] Registering screen context and form fields');

    // Set screen context
    screenContextService.setContext({
      screenName: 'add-crop',
      screenTitle: 'Add Crop',
      hasForm: true,
      formFields: ['cropName', 'quantity', 'unit', 'price', 'harvestDate', 'cropImage'],
      userRole: 'farmer',
    });

    // Register form fields with automation service
    formAutomationService.registerField('add-crop', 'cropName', setCropName, () => cropName);
    formAutomationService.registerField('add-crop', 'quantity', setQuantity, () => quantity);
    formAutomationService.registerField('add-crop', 'unit', setSelectedUnit, () => selectedUnit);
    formAutomationService.registerField('add-crop', 'price', setPrice, () => price);
    formAutomationService.registerField('add-crop', 'harvestDate', setHarvestDate, () => harvestDate);
    formAutomationService.registerField('add-crop', 'cropImage', (value: boolean) => {
      if (value) {
        handleImagePick();
      }
    }, () => cropImage);

    // Cleanup on unmount
    return () => {
      console.log('🧹 [ADD-CROP] Cleaning up screen context and form fields');
      formAutomationService.unregisterScreen('add-crop');
    };
  }, [cropName, quantity, selectedUnit, price, harvestDate, cropImage]);

  const handleImagePick = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(t('common.error'), t('errors.cameraPermissionRequired'));
        return;
      }

      // Launch image picker
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

  const handleSaveCrop = () => {
    if (!cropName || !quantity || !selectedUnit || !price) {
      Alert.alert(t('common.error'), t('errors.fillAllFields'));
      return;
    }
    Alert.alert(t('common.success'), t('success.cropAdded'));
    router.push("/my-farms");
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
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            accessibilityLabel={t('common.goBack')}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('crops.addNewCrop')}</Text>
        </View>
        <Text className="text-white/80">
          {t('crops.addCropDetailsToSell')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Form Card */}
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
        {/* Form Fields */}
        <View className="space-y-6">
          {/* Crop Name Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t('crops.cropName')}
            </Text>
            <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4">
              <TextInput
                placeholder={t('crops.cropNamePlaceholder')}
                value={cropName}
                onChangeText={setCropName}
                className="flex-1 py-3.5 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity className="p-2">
                <Mic size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantity and Unit Fields */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('crops.quantity')}
              </Text>
              <View className="bg-white rounded-xl border border-gray-200 px-4">
                <TextInput
                  placeholder={t('crops.quantityPlaceholder')}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="py-3.5 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">{t('crops.unit')}</Text>
              <TouchableOpacity
                className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex-row items-center justify-between"
                onPress={() => setShowUnitDropdown(!showUnitDropdown)}
              >
                <Text className={selectedUnit ? "text-gray-800" : "text-gray-400"}>
                  {selectedUnit || t('crops.selectUnit')}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {/* Unit Dropdown */}
              {showUnitDropdown && (
                <View className="absolute top-[76px] left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl z-10">
                  {units.map((unit, index) => (
                    <TouchableOpacity
                      key={index}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => {
                        setSelectedUnit(unit);
                        setShowUnitDropdown(false);
                      }}
                    >
                      <Text className="text-gray-800">{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Price Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t('crops.pricePerUnit')}
            </Text>
            <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4">
              <Text className="text-gray-400 mr-2">₹</Text>
              <TextInput
                placeholder={t('crops.pricePlaceholder')}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="flex-1 py-3.5 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Harvest Date Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t('crops.harvestDate')}
            </Text>
            <TouchableOpacity className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3.5">
              <Calendar size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-400">{t('crops.selectDate')}</Text>
            </TouchableOpacity>
          </View>

          {/* Crop Image Upload */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t('crops.cropImage')}
            </Text>
            <TouchableOpacity
              onPress={handleImagePick}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 items-center"
            >
              {cropImage ? (
                <Image
                  source={{ uri: cropImage }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <View className="w-16 h-16 rounded-full bg-emerald-50 items-center justify-center mb-4">
                    <Upload size={24} color="#059669" />
                  </View>
                  <Text className="text-sm font-medium text-gray-800">
                    {t('crops.tapToUploadImage')}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {t('crops.highQualityImagesAttract')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveCrop}
          className="rounded-xl py-4 mt-8"
          style={{ backgroundColor: '#7C8B3A' }}
        >
          <Text className="text-white text-center font-bold text-lg">
            {t('crops.saveCrop')}
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}