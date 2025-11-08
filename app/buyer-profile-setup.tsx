import { useAuth } from '@/contexts/auth-context';
import { validateEmail, validatePhone } from '@/utils/validation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BuyerProfileSetup() {
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

  const buyerTypes = ['Retailer', 'Wholesaler', 'Trader', 'Consumer'];
  const crops = [
    'Tomato',
    'Wheat',
    'Paddy',
    'Cotton',
    'Corn',
    'Potato',
    'Onion',
    'Sugarcane',
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
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessStep = () => {
    const newErrors: any = {};

    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!buyerType) {
      newErrors.buyerType = 'Buyer type is required';
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
      Alert.alert('Success', 'Profile setup complete!');
      router.replace('/buyer-home');
    } catch (error) {
      console.error('❌ [BUYER-SETUP] Setup error:', error);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
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
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          disabled={isLoading}
          className="w-10 h-10 items-center justify-center rounded-full border border-gray-200 mb-6"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View className="flex-row mb-8">
          {['personal', 'business', 'preferences'].map((s, idx) => (
            <View
              key={s}
              className={`flex-1 h-1 rounded-full mr-2 ${
                step === s || (step === 'preferences' && s !== 'personal')
                  ? 'bg-green-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'personal'
            ? 'Personal Information'
            : step === 'business'
            ? 'Business Details'
            : 'Preferences'}
        </Text>

        <Text className="text-gray-600 mb-8">
          {step === 'personal'
            ? 'Tell us about yourself'
            : step === 'business'
            ? 'Tell us about your business'
            : 'Select crops you are interested in'}
        </Text>

        {step === 'personal' ? (
          <>
            {/* Name */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your full name"
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
                Email
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your email"
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
                Phone Number
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter 10-digit phone number"
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
                Address
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your address"
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
                City
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your city"
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
                State
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your state"
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
                Pincode
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter 6-digit pincode"
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
              className={`p-4 rounded-xl flex-row items-center justify-center ${
                !isLoading ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Next
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : step === 'business' ? (
          <>
            {/* Business Name */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Business Name
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your business name"
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
                Buyer Type
              </Text>
              <TouchableOpacity
                onPress={() => setShowBuyerTypeDropdown(!showBuyerTypeDropdown)}
                disabled={isLoading}
                className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between"
              >
                <Text className="text-base text-gray-900">
                  {buyerType || 'Select buyer type'}
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
                      className={`p-4 border-b border-gray-100 ${
                        buyerType === type ? 'bg-green-50' : 'bg-white'
                      }`}
                    >
                      <Text
                        className={`text-base font-medium ${
                          buyerType === type
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
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
                className="flex-1 p-4 rounded-xl border border-gray-300"
              >
                <Text className="text-gray-900 text-center text-lg font-semibold">
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextStep}
                disabled={isLoading}
                className={`flex-1 p-4 rounded-xl flex-row items-center justify-center ${
                  !isLoading ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    Next
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
                Select crops you are interested in
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {crops.map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => toggleCrop(crop)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-full border-2 ${
                      selectedCrops.includes(crop)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedCrops.includes(crop)
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {crop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Navigation Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setStep('business')}
                disabled={isLoading}
                className="flex-1 p-4 rounded-xl border border-gray-300"
              >
                <Text className="text-gray-900 text-center text-lg font-semibold">
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCompleteSetup}
                disabled={isLoading}
                className={`flex-1 p-4 rounded-xl flex-row items-center justify-center ${
                  !isLoading ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    Complete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

