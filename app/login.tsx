import { useAuth } from '@/contexts/auth-context';
import { validateOTP, validatePhone } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { login, selectedRole } = useAuth();
  const { t } = useTranslation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [debugTapCount, setDebugTapCount] = useState(0);

  const handleSendOTP = async () => {
    setError('');

    if (!validatePhone(mobileNumber)) {
      setError(t('errors.invalidPhone'));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to send OTP
      // await sendOTPAPI(mobileNumber);
      setIsOtpSent(true);
      setResendTimer(60);
      Alert.alert(t('common.success'), t('success.otpSent'));
    } catch (err) {
      setError(t('errors.otpSendFailed'));
      console.error('Send OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');

    if (!validateOTP(otp)) {
      setError(t('errors.invalidOtp'));
      return;
    }

    setIsLoading(true);
    try {
      // login() returns the role for existing users, null for new users
      const userRole = await login(mobileNumber, otp);
      console.log('🔐 [LOGIN] handleVerifyOTP() - login returned role:', userRole);
      console.log('🔐 [LOGIN] handleVerifyOTP() - selectedRole from context:', selectedRole);

      if (userRole === 'farmer') {
        // Existing farmer - navigate to home
        console.log('✅ [LOGIN] Existing farmer detected, navigating to farmer-home');
        router.replace('/farmer-home');
      } else if (userRole === 'buyer') {
        // Existing buyer - navigate to home
        console.log('✅ [LOGIN] Existing buyer detected, navigating to buyer-home');
        router.replace('/buyer-home');
      } else {
        // New user (userRole is null) - navigate to registration based on selectedRole
        console.log('⚠️ [LOGIN] New user detected (userRole is null)');
        console.log('🔍 [LOGIN] Checking selectedRole for registration routing...');

        if (selectedRole === 'farmer') {
          console.log('✅ [LOGIN] New farmer user, navigating to farmer-registration');
          router.replace({
            pathname: '/farmer-registration',
            params: { phone: mobileNumber }
          });
        } else if (selectedRole === 'buyer') {
          console.log('✅ [LOGIN] New buyer user, navigating to buyer-profile-setup');
          router.replace({
            pathname: '/buyer-profile-setup',
            params: { phone: mobileNumber }
          });
        } else {
          // Fallback - shouldn't happen if user came from select-role
          console.error('❌ [LOGIN] ERROR: No selectedRole found! This should not happen.');
          console.error('❌ [LOGIN] selectedRole value:', selectedRole);
          console.error('❌ [LOGIN] Defaulting to farmer-registration as fallback');
          Alert.alert(
            t('errors.roleNotSelected'),
            t('errors.selectRoleFirst'),
            [
              {
                text: t('auth.selectRole'),
                onPress: () => router.replace('/select-role')
              }
            ]
          );
          return;
        }
      }
    } catch (err) {
      setError(t('errors.invalidOtp'));
      console.error('❌ [LOGIN] Verify OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug functions for testing database connectivity
  const handleDebugTap = async () => {
    const newCount = debugTapCount + 1;
    setDebugTapCount(newCount);

    if (newCount >= 5) {
      // Show debug menu after 5 taps
      Alert.alert(
        'Debug Menu',
        'Choose debug action:',
        [
          {
            text: 'Test DB Connection',
            onPress: async () => {
              // const result = await testDatabaseConnection();
              // Alert.alert('DB Connection', result.message);
            }
          },
          {
            text: 'List All Users',
            onPress: async () => {
              // const result = await listAllUsers();
              // console.log('All users:', result.data);
              // Alert.alert('Users Listed', result.message + '\nCheck console for details');
            }
          },
          {
            text: 'Check Phone',
            onPress: () => {
              if (mobileNumber) {
                // checkPhoneExists(mobileNumber).then(result => {
                //   Alert.alert('Phone Check', result.message);
                // });
              } else {
                Alert.alert(t('common.error'), t('errors.enterPhoneFirst'));
              }
            }
          },
          { text: t('common.cancel'), style: 'cancel' }
        ]
      );
      setDebugTapCount(0);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      // TODO: Call API to resend OTP
      setResendTimer(60);
      Alert.alert(t('common.success'), t('success.otpResent'));
    } catch (err) {
      setError(t('errors.otpResendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/select-role');
  };

  const handleBackPress = () => {
    if (isOtpSent) {
      // If on OTP screen, go back to phone input
      setIsOtpSent(false);
      setOtp('');
      setError('');
    } else {
      // If on phone input screen, go back to previous screen (preserves navigation stack)
      router.back();
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          className="w-10 h-10 items-center justify-center rounded-full border border-gray-200 mb-6"
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>

        {/* Title */}
        <TouchableOpacity onPress={handleDebugTap}>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {isOtpSent ? t('auth.verifyOtp') : t('auth.login')}
          </Text>
        </TouchableOpacity>
        <Text className="text-gray-600 mb-8">
          {isOtpSent
            ? t('auth.enterOtpSent')
            : t('auth.enterMobileToLogin')}
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
                {t('auth.phoneNumber')}
              </Text>
              <TextInput
                className="p-4 rounded-xl border border-gray-200 text-base text-gray-900"
                placeholder={t('auth.enterPhone')}
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
              className={`p-4 rounded-xl flex-row items-center justify-center ${mobileNumber.length === 10 && !isLoading
                  ? 'bg-green-600'
                  : 'bg-gray-300'
                }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  {t('auth.sendOtp')}
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
                {t('auth.createNewAccount')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
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
              className={`p-4 rounded-xl flex-row items-center justify-center ${otp.length === 6 && !isLoading ? 'bg-green-600' : 'bg-gray-300'
                }`}
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
              onPress={handleResendOTP}
              disabled={resendTimer > 0 || isLoading}
              className="mt-4"
            >
              <Text className="text-green-600 text-center text-base font-medium">
                {resendTimer > 0 ? t('auth.resendIn', { seconds: resendTimer }) : t('auth.resendOtp')}
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
                {t('auth.changePhoneNumber')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}