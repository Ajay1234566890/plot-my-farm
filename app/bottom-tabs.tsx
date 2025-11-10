import { Home, MessageCircle, Mic, Sprout, User } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

export default function BottomTabs() {
  const { t } = useTranslation();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
        {/* Home Tab */}
        <TouchableOpacity
          className="items-center justify-center"
          accessibilityLabel={t('bottomTabs.homeTab')}
          accessibilityRole="tab"
        >
          <Home size={24} color="#16a34a" strokeWidth={2} />
          <Text className="text-xs text-green-600 mt-1">{t('bottomTabs.home')}</Text>
        </TouchableOpacity>

        {/* My Farms Tab */}
        <TouchableOpacity
          className="items-center justify-center"
          accessibilityLabel={t('bottomTabs.myFarmsTab')}
          accessibilityRole="tab"
        >
          <Sprout size={24} color="#6b7280" strokeWidth={2} />
          <Text className="text-xs text-gray-500 mt-1">{t('bottomTabs.myFarms')}</Text>
        </TouchableOpacity>

        {/* Mic Button */}
        <TouchableOpacity
          className="items-center justify-center -mt-5 bg-green-600 rounded-full w-14 h-14 shadow-lg"
          accessibilityLabel={t('bottomTabs.voiceCommand')}
          accessibilityRole="button"
        >
          <Mic size={28} color="white" strokeWidth={2} />
        </TouchableOpacity>

        {/* Messages Tab */}
        <TouchableOpacity
          className="items-center justify-center"
          accessibilityLabel={t('bottomTabs.messagesTab')}
          accessibilityRole="tab"
        >
          <MessageCircle size={24} color="#6b7280" strokeWidth={2} />
          <Text className="text-xs text-gray-500 mt-1">{t('bottomTabs.messages')}</Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          className="items-center justify-center"
          accessibilityLabel={t('bottomTabs.profileTab')}
          accessibilityRole="tab"
        >
          <User size={24} color="#6b7280" strokeWidth={2} />
          <Text className="text-xs text-gray-500 mt-1">{t('bottomTabs.profile')}</Text>
        </TouchableOpacity>
      </View>

      {/* Safe Area Spacing for iOS */}
      <View className="h-[12px] bg-white" />
    </View>
  );
}