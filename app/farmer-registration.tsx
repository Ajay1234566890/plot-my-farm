import { useAuth } from '@/contexts/auth-context';
import {
    validateFarmerRegistration,
    validateOTP
} from '@/utils/validation';
import { useRouter } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function FarmerRegistration() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState<'details' | 'otp' | 'profile'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOtp = async () => {
    setErrors({});

    const validation = validateFarmerRegistration(
      fullName,
      email,
      farmName,
      farmSize
    );

    if (!validation.isValid) {
      const errorMap: any = {};
      validation.errors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to send OTP
      setStep('otp');
      setResendTimer(60);
      Alert.alert('Success', `OTP sent to ${mobileNumber}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
      console.error('Send OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrors({});

    if (!validateOTP(otp)) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to verify OTP
      setStep('profile');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP');
      console.error('Verify OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      // TODO: Call API to resend OTP
      setResendTimer(60);
      Alert.alert('Success', 'OTP resent');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    setIsLoading(true);
    try {
      await register({
        name: fullName,
        email,
        phone: mobileNumber,
        role: 'farmer',
        farmName,
        farmSize: parseFloat(farmSize),
        profileImage,
      });

      Alert.alert('Success', 'Registration complete!');
      router.replace('/farmer-home');
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (step === 'otp') {
      setStep('details');
    } else if (step === 'profile') {
      setStep('otp');
    } else {
      router.back();
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
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          disabled={isLoading}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mb-6"
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View className="flex-row mb-6">
          {['details', 'otp', 'profile'].map((s, idx) => (
            <View
              key={s}
              className={`flex-1 h-2 rounded-full mr-2 ${
                step === s || (step === 'profile' && s !== 'details')
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-white mb-2">
          {step === 'details'
            ? 'Create Account'
            : step === 'otp'
            ? 'Verify Mobile'
            : 'Setup Profile'}
        </Text>

        <Text className="text-white/80 mb-4">
          {step === 'details'
            ? 'Enter your details to create an account'
            : step === 'otp'
            ? `Enter the OTP sent to ${mobileNumber}`
            : 'Complete your profile to continue'}
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
        {step === 'details' ? (
          <>
            {/* Full Name Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setErrors({ ...errors, fullName: '' });
                }}
                editable={!isLoading}
              />
              {errors.fullName && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.fullName}
                </Text>
              )}
            </View>

            {/* Email Input */}
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
                <Text className="text-red-600 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Mobile Number Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={(text) => {
                  setMobileNumber(text.replace(/\D/g, '').slice(0, 10));
                  setErrors({ ...errors, mobileNumber: '' });
                }}
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            {/* Farm Name Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Farm Name
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter your farm name"
                value={farmName}
                onChangeText={(text) => {
                  setFarmName(text);
                  setErrors({ ...errors, farmName: '' });
                }}
                editable={!isLoading}
              />
              {errors.farmName && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.farmName}
                </Text>
              )}
            </View>

            {/* Farm Size Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Farm Size (acres)
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter farm size in acres"
                keyboardType="decimal-pad"
                value={farmSize}
                onChangeText={(text) => {
                  setFarmSize(text);
                  setErrors({ ...errors, farmSize: '' });
                }}
                editable={!isLoading}
              />
              {errors.farmSize && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.farmSize}
                </Text>
              )}
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={isLoading}
              className="p-4 rounded-xl flex-row items-center justify-center"
              style={{
                backgroundColor: fullName.trim().length > 0 &&
                  email.trim().length > 0 &&
                  mobileNumber.length === 10 &&
                  farmName.trim().length > 0 &&
                  farmSize.trim().length > 0 &&
                  !isLoading
                    ? '#7C8B3A' // Olive green matching farmer-home
                    : '#D1D5DB' // Gray for disabled state
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : step === 'otp' ? (
          <>
            {/* OTP Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                OTP
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/\D/g, '').slice(0, 6));
                  setErrors({ ...errors, otp: '' });
                }}
                maxLength={6}
                editable={!isLoading}
              />
              {errors.otp && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.otp}
                </Text>
              )}
            </View>

            {/* Verify OTP Button */}
            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={otp.length !== 6 || isLoading}
              className="p-4 rounded-xl flex-row items-center justify-center"
              style={{
                backgroundColor: otp.length === 6 && !isLoading ? '#7C8B3A' : '#D1D5DB'
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend Button */}
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendTimer > 0 || isLoading}
              className="mt-4"
            >
              <Text className="text-center text-base font-medium" style={{ color: '#7C8B3A' }}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Profile Picture */}
            <View className="items-center mb-8">
              <TouchableOpacity
                disabled={isLoading}
                className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4 border-2 border-gray-200"
              >
                {profileImage ? (
                  <Text className="text-gray-600">Photo</Text>
                ) : (
                  <Camera size={32} color="#9CA3AF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity disabled={isLoading}>
                <Text className="font-medium" style={{ color: '#7C8B3A' }}>
                  Add Profile Picture
                </Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View className="bg-gray-50 p-4 rounded-xl mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Account Summary
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Name:</Text>
                  <Text className="text-gray-900 font-medium">{fullName}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Mobile:</Text>
                  <Text className="text-gray-900 font-medium">{mobileNumber}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Farm:</Text>
                  <Text className="text-gray-900 font-medium">{farmName}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Size:</Text>
                  <Text className="text-gray-900 font-medium">
                    {farmSize} acres
                  </Text>
                </View>
              </View>
            </View>

            {/* Complete Registration Button */}
            <TouchableOpacity
              onPress={handleCompleteRegistration}
              disabled={isLoading}
              className="p-4 rounded-xl flex-row items-center justify-center"
              style={{
                backgroundColor: !isLoading ? '#7C8B3A' : '#D1D5DB'
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Complete Registration
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
        </View>
      </ScrollView>
    </View>
  );
}