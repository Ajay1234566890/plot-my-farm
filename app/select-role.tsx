import { Language, useAuth } from '@/contexts/auth-context';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useRouter } from 'expo-router';
import { ChevronDown, ShoppingCart, Sprout } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SelectRole() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectRole, selectLanguage: setLanguage } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | null>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'farmer' as const,
      title: t('auth.farmer'),
      description: t('auth.farmerDesc'),
      icon: Sprout,
    },
    {
      id: 'buyer' as const,
      title: t('auth.buyer'),
      description: t('auth.buyerDesc'),
      icon: ShoppingCart,
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) {
      console.log('⚠️ [ROLE-SELECT] No role selected, cannot continue');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🎯 [ROLE-SELECT] User selected role:', selectedRole);
      console.log('🌐 [ROLE-SELECT] User selected language:', selectedLanguage);

      // Save language selection first
      console.log('🔄 [ROLE-SELECT] Calling selectLanguage() from auth context...');
      await setLanguage(selectedLanguage);
      console.log('✅ [ROLE-SELECT] selectLanguage() completed successfully');

      // Then save role selection
      console.log('🔄 [ROLE-SELECT] Calling selectRole() from auth context...');
      await selectRole(selectedRole);
      console.log('✅ [ROLE-SELECT] selectRole() completed successfully');
      console.log('🔄 [ROLE-SELECT] Navigating to /login...');
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      console.error('❌ [ROLE-SELECT] Role selection error:', error);
      Alert.alert(t('common.error'), t('errors.tryAgain'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {t('auth.selectRole')}
        </Text>
        <Text className="text-gray-600 mb-8">
          {t('auth.selectRoleDesc')}
        </Text>

        {/* Role Selection */}
        <View className="space-y-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <TouchableOpacity
                key={role.id}
                onPress={() => setSelectedRole(role.id)}
                disabled={isLoading}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className="flex-row items-start">
                  <View
                    className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
                      isSelected ? 'bg-green-600' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      size={28}
                      color={isSelected ? '#ffffff' : '#6b7280'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-bold mb-1 ${
                        isSelected ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {role.title}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {role.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Language Selection */}
        <View className="mb-8">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Language / భాష / भाषा / மொழி / ಭಾಷೆ
          </Text>
          <TouchableOpacity
            onPress={() => setIsLanguageOpen(!isLanguageOpen)}
            disabled={isLoading}
            className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between bg-white"
          >
            <Text className="text-base font-medium text-gray-900">
              {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName || 'English'}
            </Text>
            <ChevronDown
              size={20}
              color="#374151"
              style={{
                transform: [{ rotate: isLanguageOpen ? '180deg' : '0deg' }],
              }}
            />
          </TouchableOpacity>

          {isLanguageOpen && (
            <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
              {SUPPORTED_LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => {
                    setSelectedLanguage(language.code as Language);
                    setIsLanguageOpen(false);
                  }}
                  disabled={isLoading}
                  className={`p-4 border-b border-gray-100 ${
                    selectedLanguage === language.code ? 'bg-green-50' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedLanguage === language.code
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {language.nativeName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
          className={`p-4 rounded-xl flex-row items-center justify-center ${
            selectedRole && !isLoading ? 'bg-green-600' : 'bg-gray-300'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              {t('auth.continue')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isLoading}
          className="mt-4"
        >
          <Text className="text-gray-600 text-center text-base">
            {t('common.back')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}