import { useAuth } from '@/contexts/auth-context';
import { validateEmail, validatePhone } from '@/utils/validation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function BuyerProfileSetup() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();
  const params = useLocalSearchParams();
  const [step, setStep] = useState<'personal' | 'business' | 'preferences'>(
    'personal'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [buyerType, setBuyerType] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showBuyerTypeDropdown, setShowBuyerTypeDropdown] = useState(false);
  const [showCropsDropdown, setShowCropsDropdown] = useState(false);

  // Set phone from params if provided
  useEffect(() => {
    if (params.phone && typeof params.phone === 'string') {
      console.log('📱 [BUYER-SETUP] Received phone from login:', params.phone);
      setPhone(params.phone);
    }
  }, [params.phone]);

  const buyerTypes = [
    t('profile.retailer'),
    t('profile.wholesaler'),
    t('profile.trader'),
    t('profile.consumer'),
  ];
  const crops = [
    t('crops.tomato'),
    t('crops.wheat'),
    t('crops.paddy'),
    t('crops.cotton'),
    t('crops.corn'),
    t('crops.potato'),
    t('crops.onion'),
    t('crops.sugarcane'),
  ];

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const validatePersonalStep = () => {
    const newErrors: any = {};

    if (!name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }

    if (!email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!validateEmail(email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!phone.trim()) {
      newErrors.phone = t('errors.phoneRequired');
    } else if (!validatePhone(phone)) {
      newErrors.phone = t('errors.invalidPhone');
    }

    if (!address.trim()) {
      newErrors.address = t('errors.addressRequired');
    }

    if (!city.trim()) {
      newErrors.city = t('errors.cityRequired');
    }

    if (!state.trim()) {
      newErrors.state = t('errors.stateRequired');
    }

    if (!pincode.trim()) {
      newErrors.pincode = t('errors.pincodeRequired');
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = t('errors.invalidPincode');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessStep = () => {
    const newErrors: any = {};

    if (!businessName.trim()) {
      newErrors.businessName = t('errors.businessNameRequired');
    }

    if (!buyerType) {
      newErrors.buyerType = t('errors.buyerTypeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 'personal') {
      if (validatePersonalStep()) {
        setStep('business');
      }
    } else if (step === 'business') {
      if (validateBusinessStep()) {
        setStep('preferences');
      }
    }
  };

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 [BUYER-SETUP] Starting buyer registration...');
      console.log('📝 [BUYER-SETUP] Registration data:', {
        name,
        email,
        phone,
        role: 'buyer',
        location: `${address}, ${city}, ${state} ${pincode}`,
      });

      await register({
        name,
        email,
        phone,
        role: 'buyer',
        location: `${address}, ${city}, ${state} ${pincode}`,
      });

      console.log('✅ [BUYER-SETUP] Buyer registration successful!');
      console.log('🔄 [BUYER-SETUP] Navigating to /buyer-home...');
      Alert.alert(t('common.success'), t('success.profileSetupComplete'));
      router.replace('/buyer-home');
    } catch (error) {
      console.error('❌ [BUYER-SETUP] Setup error:', error);
      Alert.alert(t('common.error'), t('errors.setupFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (step === 'personal') {
      router.back();
    } else if (step === 'business') {
      setStep('personal');
    } else {
      setStep('business');
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#B27E4C', // Buyer primary color (brown/copper)
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={handleBackPress}
            disabled={isLoading}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">
              {step === 'personal'
                ? t('profile.personalInfo')
                : step === 'business'
                ? t('profile.businessDetails')
                : t('profile.preferences')}
            </Text>
          </View>
        </View>

        <Text className="text-white/80 mb-4">
          {step === 'personal'
            ? t('profile.tellAboutYourself')
            : step === 'business'
            ? t('profile.tellAboutBusiness')
            : t('profile.selectInterestedCrops')}
        </Text>

        {/* Progress Indicator */}
        <View className="flex-row">
          {['personal', 'business', 'preferences'].map((s, idx) => (
            <View
              key={s}
              className={`flex-1 h-1 rounded-full mr-2 ${
                step === s || (step === 'preferences' && s !== 'personal')
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

        {step === 'personal' ? (
          <>
            {/* Name */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('auth.fullName')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterFullName')}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors({ ...errors, name: '' });
                }}
                editable={!isLoading}
              />
              {errors.name && (
                <Text className="text-red-600 text-sm mt-1">{errors.name}</Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterEmail')}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' });
                }}
                editable={!isLoading}
              />
              {errors.email && (
                <Text className="text-red-600 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('auth.phoneNumber')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enter10DigitPhone')}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/\D/g, '').slice(0, 10));
                  setErrors({ ...errors, phone: '' });
                }}
                maxLength={10}
                editable={!isLoading}
              />
              {errors.phone && (
                <Text className="text-red-600 text-sm mt-1">{errors.phone}</Text>
              )}
            </View>

            {/* Address */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('profile.address')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('profile.enterAddress')}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  setErrors({ ...errors, address: '' });
                }}
                editable={!isLoading}
              />
              {errors.address && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.address}
                </Text>
              )}
            </View>

            {/* City */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('profile.city')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('profile.enterCity')}
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  setErrors({ ...errors, city: '' });
                }}
                editable={!isLoading}
              />
              {errors.city && (
                <Text className="text-red-600 text-sm mt-1">{errors.city}</Text>
              )}
            </View>

            {/* State */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('market.state')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('profile.enterState')}
                value={state}
                onChangeText={(text) => {
                  setState(text);
                  setErrors({ ...errors, state: '' });
                }}
                editable={!isLoading}
              />
              {errors.state && (
                <Text className="text-red-600 text-sm mt-1">{errors.state}</Text>
              )}
            </View>

            {/* Pincode */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('profile.pincode')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('profile.enter6DigitPincode')}
                keyboardType="number-pad"
                value={pincode}
                onChangeText={(text) => {
                  setPincode(text.replace(/\D/g, '').slice(0, 6));
                  setErrors({ ...errors, pincode: '' });
                }}
                maxLength={6}
                editable={!isLoading}
              />
              {errors.pincode && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.pincode}
                </Text>
              )}
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNextStep}
              disabled={isLoading}
              className="p-4 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: !isLoading ? '#B27E4C' : '#D1D5DB' }}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  {t('common.next')}
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : step === 'business' ? (
          <>
            {/* Business Name */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('profile.businessName')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('profile.enterBusinessName')}
                value={businessName}
                onChangeText={(text) => {
                  setBusinessName(text);
                  setErrors({ ...errors, businessName: '' });
                }}
                editable={!isLoading}
              />
              {errors.businessName && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.businessName}
                </Text>
              )}
            </View>

            {/* Buyer Type */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('profile.buyerType')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowBuyerTypeDropdown(!showBuyerTypeDropdown)}
                disabled={isLoading}
                className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between"
              >
                <Text className="text-base text-gray-900">
                  {buyerType || t('profile.selectBuyerType')}
                </Text>
                <ChevronDown
                  size={20}
                  color="#374151"
                  style={{
                    transform: [
                      { rotate: showBuyerTypeDropdown ? '180deg' : '0deg' },
                    ],
                  }}
                />
              </TouchableOpacity>

              {showBuyerTypeDropdown && (
                <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {buyerTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => {
                        setBuyerType(type);
                        setShowBuyerTypeDropdown(false);
                        setErrors({ ...errors, buyerType: '' });
                      }}
                      disabled={isLoading}
                      className="p-4 border-b border-gray-100"
                      style={{
                        backgroundColor: buyerType === type ? '#F5F3F0' : '#FFFFFF'
                      }}
                    >
                      <Text
                        className="text-base font-medium"
                        style={{
                          color: buyerType === type ? '#B27E4C' : '#111827'
                        }}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {errors.buyerType && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.buyerType}
                </Text>
              )}
            </View>

            {/* Navigation Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setStep('personal')}
                disabled={isLoading}
                className="flex-1 p-4 rounded-xl border-2"
                style={{ borderColor: '#B27E4C' }}
              >
                <Text className="text-center text-lg font-semibold" style={{ color: '#B27E4C' }}>
                  {t('common.back')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextStep}
                disabled={isLoading}
                className="flex-1 p-4 rounded-xl flex-row items-center justify-center"
                style={{ backgroundColor: !isLoading ? '#B27E4C' : '#D1D5DB' }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    {t('common.next')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Crops Selection */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-4">
                {t('profile.selectInterestedCrops')}
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {crops.map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => toggleCrop(crop)}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-full border-2"
                    style={{
                      borderColor: selectedCrops.includes(crop) ? '#B27E4C' : '#E5E7EB',
                      backgroundColor: selectedCrops.includes(crop) ? '#F5F3F0' : '#FFFFFF'
                    }}
                  >
                    <Text
                      className="font-medium"
                      style={{
                        color: selectedCrops.includes(crop) ? '#B27E4C' : '#111827'
                      }}
                    >
                      {crop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Navigation Buttons */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={() => setStep('business')}
                disabled={isLoading}
                className="flex-1 p-4 rounded-xl border-2"
                style={{ borderColor: '#B27E4C' }}
              >
                <Text className="text-center text-lg font-semibold" style={{ color: '#B27E4C' }}>
                  {t('common.back')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCompleteSetup}
                disabled={isLoading}
                className="flex-1 p-4 rounded-xl flex-row items-center justify-center"
                style={{ backgroundColor: !isLoading ? '#B27E4C' : '#D1D5DB' }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    {t('common.complete')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

