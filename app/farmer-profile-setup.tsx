import { useAuth } from '@/contexts/auth-context';
import { locationService } from '@/services/location-service';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, ChevronDown, ChevronLeft, MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FarmerProfileSetup() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [cropType, setCropType] = useState('');
  const [isCropTypeOpen, setIsCropTypeOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [soilTest, setSoilTest] = useState('');
  const [isSoilTestOpen, setIsSoilTestOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    landSize: '',
    state: '',
    city: '',
    pincode: '',
  });

  const cropTypes = [
    'Rice',
    'Wheat',
    'Cotton',
    'Sugarcane',
    'Vegetables',
    'Fruits',
  ];

  const soilTestTypes = [
    'Sandy Soil',
    'Clay Soil',
    'Loamy Soil',
    'Silt Soil',
    'Peaty Soil',
    'Chalky Soil',
  ];

  // Auto-fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // Fetch current location
  const fetchLocation = async () => {
    try {
      setIsFetchingLocation(true);
      console.log('📍 [PROFILE-SETUP] Fetching location...');

      const locationData = await locationService.getCurrentLocation();

      console.log('✅ [PROFILE-SETUP] Location fetched:', locationData);
      setLocation({
        latitude: locationData.coordinates.latitude,
        longitude: locationData.coordinates.longitude
      });
      setLocationAddress(locationData.address.formattedAddress || `${locationData.coordinates.latitude.toFixed(4)}, ${locationData.coordinates.longitude.toFixed(4)}`);

      // Also pre-fill state/city/pincode if available and empty
      if (locationData.address.region && !formData.state) {
        setFormData(prev => ({ ...prev, state: locationData.address.region || '' }));
      }
      if (locationData.address.city && !formData.city) {
        setFormData(prev => ({ ...prev, city: locationData.address.city || '' }));
      }
      if (locationData.address.postalCode && !formData.pincode) {
        setFormData(prev => ({ ...prev, pincode: locationData.address.postalCode || '' }));
      }

      setIsFetchingLocation(false);
    } catch (error) {
      console.error('❌ [PROFILE-SETUP] Location exception:', error);
      setLocationAddress('Location unavailable');
      setIsFetchingLocation(false);
      Alert.alert(t('common.error'), 'Failed to fetch location. Please ensure location services are enabled.');
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
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), t('errors.imagePickFailed'));
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      if (!user?.id) {
        Alert.alert(t('common.error'), 'User not authenticated');
        return;
      }

      console.log('💾 [PROFILE-SETUP] Saving profile...');

      // Prepare update data
      const updateData: any = {
        full_name: formData.name,
        land_size: formData.landSize,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        crop_type: cropType,
        soil_test: soilTest,
      };

      // Add location if available
      if (location) {
        updateData.latitude = location.latitude;
        updateData.longitude = location.longitude;
        updateData.address = locationAddress;
      }

      console.log('📝 [PROFILE-SETUP] Update data:', updateData);

      // Update farmer profile in Supabase
      const { data, error } = await supabase
        .from('farmers')
        .upsert({ id: user.id, ...updateData })
        .select()
        .single();

      if (error) {
        console.error('❌ [PROFILE-SETUP] Save error:', error);
        Alert.alert(t('common.error'), error.message);
        return;
      }

      console.log('✅ [PROFILE-SETUP] Profile saved:', data);
      Alert.alert(t('common.success'), 'Profile saved successfully!');
    } catch (error) {
      console.error('❌ [PROFILE-SETUP] Save exception:', error);
      Alert.alert(t('common.error'), 'Failed to save profile');
    }
  };

  // Handle continue
  const handleContinue = () => {
    if (!formData.name || !formData.state || !formData.city) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }
    // TODO: Implement save and navigate
    Alert.alert(t('common.success'), 'Profile updated successfully!', [
      { text: t('common.ok'), onPress: () => router.back() }
    ]);
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
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">
            {t('auth.profileSetup')}
          </Text>
        </View>
        <Text className="text-white/80">
          {t('auth.completeProfile')}
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

          {/* Profile Picture Section */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="w-24 h-24 rounded-full bg-green-50 items-center justify-center overflow-hidden">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-24 h-24 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Camera size={32} color="#7C8B3A" />
                )}
              </View>
              <TouchableOpacity
                className="absolute bottom-0 right-0 p-2 rounded-full"
                style={{ backgroundColor: '#7C8B3A' }}
                onPress={handleImagePick}
              >
                <Camera size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">{t('auth.name')}</Text>
              <TextInput
                placeholder={t('auth.enterName')}
                className="p-4 rounded-xl border border-gray-200 text-gray-900"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Address Input - Auto-fetched GPS */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">{t('profile.address')}</Text>
              <TouchableOpacity
                className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between"
                onPress={fetchLocation}
              >
                <View className="flex-row items-center flex-1">
                  <MapPin size={20} color="#374151" />
                  {isFetchingLocation ? (
                    <ActivityIndicator size="small" color="#7C8B3A" style={{ marginLeft: 8 }} />
                  ) : (
                    <Text className={`ml-2 ${locationAddress ? 'text-gray-900' : 'text-gray-400'}`}>
                      {locationAddress || t('profile.autoFetchedGPS')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Soil Test Selection */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">{t('profile.soilTest')}</Text>
              <TouchableOpacity
                onPress={() => setIsSoilTestOpen(!isSoilTestOpen)}
                className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between"
              >
                <Text className={soilTest ? 'text-gray-900' : 'text-gray-400'}>
                  {soilTest || t('profile.selectSoilTest')}
                </Text>
                <ChevronDown
                  size={20}
                  color="#374151"
                  className={`transform ${isSoilTestOpen ? 'rotate-180' : 'rotate-0'}`}
                />
              </TouchableOpacity>

              {isSoilTestOpen && (
                <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  {soilTestTypes.map((soil) => (
                    <TouchableOpacity
                      key={soil}
                      onPress={() => {
                        setSoilTest(soil);
                        setIsSoilTestOpen(false);
                      }}
                      className={`p-4 ${soilTest === soil ? 'bg-green-50' : 'bg-white'
                        }`}
                    >
                      <Text
                        className={`text-base ${soilTest === soil ? 'text-green-600' : 'text-gray-900'
                          }`}
                      >
                        {soil}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Land Size Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">{t('profile.landAcres')}</Text>
              <TextInput
                placeholder={t('profile.enterLandSize')}
                keyboardType="numeric"
                className="p-4 rounded-xl border border-gray-200 text-gray-900"
                value={formData.landSize}
                onChangeText={(text) => setFormData({ ...formData, landSize: text })}
              />
            </View>

            {/* Location Fields */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">{t('market.state')}</Text>
                <TextInput
                  placeholder={t('profile.enterState')}
                  className="p-4 rounded-xl border border-gray-200 text-gray-900"
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">{t('profile.city')}</Text>
                <TextInput
                  placeholder={t('profile.enterCity')}
                  className="p-4 rounded-xl border border-gray-200 text-gray-900"
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                />
              </View>
            </View>

            {/* Pincode Input - No Microphone */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">{t('profile.pincode')}</Text>
              <TextInput
                placeholder={t('profile.enterPincode')}
                keyboardType="numeric"
                className="p-4 rounded-xl border border-gray-200 text-gray-900"
                value={formData.pincode}
                onChangeText={(text) => setFormData({ ...formData, pincode: text })}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              className="flex-1 p-4 rounded-xl"
              style={{ backgroundColor: '#F5F3F0' }}
              onPress={handleSave}
            >
              <Text className="text-center text-lg font-semibold" style={{ color: '#7C8B3A' }}>
                {t('common.save')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-4 rounded-xl"
              style={{ backgroundColor: '#7C8B3A' }}
              onPress={handleContinue}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {t('common.continue')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}