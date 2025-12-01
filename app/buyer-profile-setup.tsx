import { useAuth } from '@/contexts/auth-context';
import { formAutomationService } from '@/services/form-automation-service';
import { screenContextService } from '@/services/screen-context-service';
import { validateEmail, validatePhone } from '@/utils/validation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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
  const { register, user, updateProfile } = useAuth();
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

  // Pre-fill form if user exists (Edit Profile mode)
  useEffect(() => {
    if (user) {
      console.log('✏️ [BUYER-SETUP] Pre-filling form for editing');
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');

      // Attempt to parse location
      if (user.location) {
        const parts = user.location.split(',').map(p => p.trim());
        if (parts.length >= 1) setAddress(parts[0]);
        if (parts.length >= 2) setCity(parts[1]);
        if (parts.length >= 3) {
          // State and pincode might be combined "State Pincode"
          const lastPart = parts[2];
          const statePincode = lastPart.split(' ');
          if (statePincode.length > 1) {
            // Assuming last part is pincode
            setPincode(statePincode.pop() || '');
            setState(statePincode.join(' '));
          } else {
            setState(lastPart);
          }
        }
      }

      setBusinessName(user.companyName || '');
      setBuyerType(user.businessType || '');
      // Note: selectedCrops is not currently in User interface, so we skip it or fetch it if available
    }
  }, [user]);

  // Register screen context and form fields for voice automation
  useEffect(() => {
    console.log('📋 [BUYER-SETUP] Registering screen context and form fields');

    // Set screen context
    screenContextService.setContext({
      screenName: 'buyer-profile-setup',
      screenTitle: 'Buyer Profile Setup',
      hasForm: true,
      formFields: ['fullName', 'email', 'address', 'pincode', 'businessName', 'buyerType'],
      userRole: 'buyer',
    });

    // Register form fields with automation service
    // Note: Form definition uses 'fullName' but state uses 'name'
    formAutomationService.registerField('buyer-profile-setup', 'fullName', setName, () => name);
    formAutomationService.registerField('buyer-profile-setup', 'email', setEmail, () => email);
    formAutomationService.registerField('buyer-profile-setup', 'address', setAddress, () => address);
    formAutomationService.registerField('buyer-profile-setup', 'pincode', setPincode, () => pincode);
    formAutomationService.registerField('buyer-profile-setup', 'businessName', setBusinessName, () => businessName);
    formAutomationService.registerField('buyer-profile-setup', 'buyerType', setBuyerType, () => buyerType);

    // Cleanup on unmount
    return () => {
      console.log('🧹 [BUYER-SETUP] Cleaning up screen context and form fields');
      formAutomationService.unregisterScreen('buyer-profile-setup');
    };
  }, [name, email, address, pincode, businessName, buyerType]);

  // Set phone from params if provided (only if not editing)
  useEffect(() => {
    if (!user && params.phone && typeof params.phone === 'string') {
      console.log('📱 [BUYER-SETUP] Received phone from login:', params.phone);
      setPhone(params.phone);
    }
  }, [params.phone, user]);

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
      const userData = {
        name,
        email,
        phone,
        role: 'buyer' as const,
        location: `${address}, ${city}, ${state} ${pincode}`,
        companyName: businessName,
        businessType: buyerType
      };

      if (user) {
        console.log('🔄 [BUYER-SETUP] Updating existing profile...');
        await updateProfile(userData);
        console.log('✅ [BUYER-SETUP] Profile updated successfully!');
        Alert.alert(t('common.success'), t('success.profileUpdated'));
      } else {
        console.log('🔄 [BUYER-SETUP] Starting buyer registration...');
        await register({
          ...userData,
          role: 'buyer'
        });
        console.log('✅ [BUYER-SETUP] Buyer registration successful!');
        // Show success message after navigation
        setTimeout(() => {
          Alert.alert(t('common.success'), t('success.profileSetupComplete'));
        }, 500);
      }

      // Wait longer for state to fully propagate
      console.log('⏳ [BUYER-SETUP] Waiting for auth state to update...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('🔄 [BUYER-SETUP] Navigating to /buyer-home...');
      // Navigate immediately without alert to avoid timing issues
      router.replace('/buyer-home');

    } catch (error) {
      console.error('❌ [BUYER-SETUP] Setup/Update error:', error);
      const errorMessage = error instanceof Error ? error.message : t('errors.setupFailed');
      Alert.alert(t('common.error'), errorMessage);
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
              className={`flex-1 h-1 rounded-full mr-2 ${step === s || (step === 'preferences' && s !== 'personal')
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
                    {user ? t('common.saveChanges') : t('common.complete')}
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

