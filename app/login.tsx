import { useAuth } from '@/contexts/auth-context';
import { validateOTP, validatePhone } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOTP = async () => {
    setError('');

    if (!validatePhone(mobileNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to send OTP
      // await sendOTPAPI(mobileNumber);
      setIsOtpSent(true);
      setResendTimer(60);
      Alert.alert('Success', 'OTP sent to your mobile number');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');

    if (!validateOTP(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // login() now returns the role that was set
      const userRole = await login(mobileNumber, otp);
      console.log('DEBUG: handleVerifyOTP() - login returned role:', userRole);

      // Navigate to role-specific registration
      if (userRole === 'farmer') {
        console.log('DEBUG: Navigating to farmer-registration');
        router.replace('/farmer-registration');
      } else if (userRole === 'buyer') {
        console.log('DEBUG: Navigating to buyer-profile-setup');
        router.replace('/buyer-profile-setup');
      } else {
        // Fallback to farmer registration if role not set
        console.log('DEBUG: userRole is null/undefined, defaulting to farmer-registration');
        router.replace('/farmer-registration');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      // TODO: Call API to resend OTP
      setResendTimer(60);
      Alert.alert('Success', 'OTP resent to your mobile number');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/select-role');
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full border border-gray-200 mb-6"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {isOtpSent ? 'Verify OTP' : 'Login'}
        </Text>
        <Text className="text-gray-600 mb-8">
          {isOtpSent
            ? 'Enter the OTP sent to your mobile'
            : 'Enter your mobile number to login'}
        </Text>

        {/* Error Message */}
        {error ? (
          <View className="mb-4 p-3 bg-red-100 rounded-lg border border-red-300">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}

        {!isOtpSent ? (
          <>
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
                  setError('');
                }}
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={mobileNumber.length !== 10 || isLoading}
              className={`p-4 rounded-xl flex-row items-center justify-center ${
                mobileNumber.length === 10 && !isLoading
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleCreateAccount}
              className="mt-4"
              disabled={isLoading}
            >
              <Text className="text-green-600 text-center text-base font-medium">
                Create New Account
              </Text>
            </TouchableOpacity>
          </>
        ) : (
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
                  setError('');
                }}
                maxLength={6}
                editable={!isLoading}
              />
            </View>

            {/* Verify OTP Button */}
            <TouchableOpacity
              onPress={handleVerifyOTP}
              disabled={otp.length !== 6 || isLoading}
              className={`p-4 rounded-xl flex-row items-center justify-center ${
                otp.length === 6 && !isLoading ? 'bg-green-600' : 'bg-gray-300'
              }`}
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
              onPress={handleResendOTP}
              disabled={resendTimer > 0 || isLoading}
              className="mt-4"
            >
              <Text className="text-green-600 text-center text-base font-medium">
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>

            {/* Back to Phone Input */}
            <TouchableOpacity
              onPress={() => {
                setIsOtpSent(false);
                setOtp('');
                setError('');
              }}
              disabled={isLoading}
              className="mt-4"
            >
              <Text className="text-gray-600 text-center text-base">
                Change phone number
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}