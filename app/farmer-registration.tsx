import { useAuth } from '@/contexts/auth-context';
import { formAutomationService } from '@/services/form-automation-service';
import { screenContextService } from '@/services/screen-context-service';
import {
    validateFarmerRegistration,
    validateOTP
} from '@/utils/validation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, ChevronLeft } from 'lucide-react-native';
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

export default function FarmerRegistration() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
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

  // Register screen context and form fields for voice automation
  useEffect(() => {
    console.log('📋 [FARMER-REG] Registering screen context and form fields');

    // Set screen context
    screenContextService.setContext({
      screenName: 'farmer-registration',
      screenTitle: 'Farmer Registration',
      hasForm: true,
      formFields: ['fullName', 'email', 'mobileNumber', 'farmName', 'farmSize'],
      userRole: 'farmer',
    });

    // Register form fields with automation service
    formAutomationService.registerField('farmer-registration', 'fullName', setFullName, () => fullName);
    formAutomationService.registerField('farmer-registration', 'email', setEmail, () => email);
    formAutomationService.registerField('farmer-registration', 'mobileNumber', setMobileNumber, () => mobileNumber);
    formAutomationService.registerField('farmer-registration', 'farmName', setFarmName, () => farmName);
    formAutomationService.registerField('farmer-registration', 'farmSize', setFarmSize, () => farmSize);

    // Cleanup on unmount
    return () => {
      console.log('🧹 [FARMER-REG] Cleaning up screen context and form fields');
      formAutomationService.unregisterScreen('farmer-registration');
    };
  }, [fullName, email, mobileNumber, farmName, farmSize]);

  // Set phone from params if provided
  useEffect(() => {
    if (params.phone && typeof params.phone === 'string') {
      console.log('📱 [FARMER-REG] Received phone from login:', params.phone);
      setMobileNumber(params.phone);
    }
  }, [params.phone]);

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
      Alert.alert(t('common.success'), t('success.otpSent'));
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.otpSendFailed'));
      console.error('Send OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrors({});

    if (!validateOTP(otp)) {
      setErrors({ otp: t('errors.invalidOtp') });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to verify OTP
      setStep('profile');
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.invalidOtp'));
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
      Alert.alert(t('common.success'), t('success.otpResent'));
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.otpResendFailed'));
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

      Alert.alert(t('common.success'), t('success.registrationSuccess'));
      router.replace('/farmer-home');
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.registrationFailed'));
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
            ? t('auth.createAccount')
            : step === 'otp'
            ? t('auth.verifyMobile')
            : t('auth.setupProfile')}
        </Text>

        <Text className="text-white/80 mb-4">
          {step === 'details'
            ? t('auth.enterDetailsToCreate')
            : step === 'otp'
            ? t('auth.enterOtpSentTo', { phone: mobileNumber })
            : t('auth.completeProfile')}
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
                {t('auth.fullName')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterFullName')}
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
                <Text className="text-red-600 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Mobile Number Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('auth.phoneNumber')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterPhone')}
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
                {t('auth.farmName')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterFarmName')}
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
                {t('auth.farmSizeAcres')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterFarmSizeAcres')}
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
                  {t('auth.sendOtp')}
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : step === 'otp' ? (
          <>
            {/* OTP Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t('auth.otp')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterOtp')}
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
                  {t('auth.verifyOtp')}
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
                {resendTimer > 0 ? t('auth.resendIn', { seconds: resendTimer }) : t('auth.resendOtp')}
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
                  <Text className="text-gray-600">{t('common.photo')}</Text>
                ) : (
                  <Camera size={32} color="#9CA3AF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity disabled={isLoading}>
                <Text className="font-medium" style={{ color: '#7C8B3A' }}>
                  {t('auth.addProfilePicture')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View className="bg-gray-50 p-4 rounded-xl mb-8">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                {t('auth.accountSummary')}
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t('auth.name')}:</Text>
                  <Text className="text-gray-900 font-medium">{fullName}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t('auth.mobile')}:</Text>
                  <Text className="text-gray-900 font-medium">{mobileNumber}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t('auth.farm')}:</Text>
                  <Text className="text-gray-900 font-medium">{farmName}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t('auth.size')}:</Text>
                  <Text className="text-gray-900 font-medium">
                    {farmSize} {t('units.acres')}
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
                  {t('auth.completeRegistration')}
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