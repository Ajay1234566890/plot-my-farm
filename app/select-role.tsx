import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { ChevronDown, ShoppingCart, Sprout } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SelectRole() {
  const router = useRouter();
  const { selectRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | null>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    'English',
    'हिंदी',
    'తెలుగు',
    'தமிழ்',
    'ಕನ್ನಡ',
  ];

  const roles = [
    {
      id: 'farmer' as const,
      title: 'Farmer',
      description: 'Sell your crops and connect with buyers',
      icon: Sprout,
    },
    {
      id: 'buyer' as const,
      title: 'Buyer',
      description: 'Buy fresh crops directly from farmers',
      icon: ShoppingCart,
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      console.log('DEBUG: handleContinue() - calling selectRole with:', selectedRole);
      await selectRole(selectedRole);
      console.log('DEBUG: handleContinue() - selectRole completed');
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      console.error('Role selection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Role
        </Text>
        <Text className="text-gray-600 mb-8">
          Select how you want to use the app
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
            Language
          </Text>
          <TouchableOpacity
            onPress={() => setIsLanguageOpen(!isLanguageOpen)}
            disabled={isLoading}
            className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between bg-white"
          >
            <Text className="text-base font-medium text-gray-900">
              {selectedLanguage}
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
              {languages.map((language) => (
                <TouchableOpacity
                  key={language}
                  onPress={() => {
                    setSelectedLanguage(language);
                    setIsLanguageOpen(false);
                  }}
                  disabled={isLoading}
                  className={`p-4 border-b border-gray-100 ${
                    selectedLanguage === language ? 'bg-green-50' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedLanguage === language
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {language}
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
              Continue
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
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}