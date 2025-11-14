import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    FileText,
    Heart,
    Info,
    LogOut
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [profileImage] = useState(user?.profileImage || '');
  const [notificationSettings, setNotificationSettings] = useState({
    messageAlerts: true,
    offerAlerts: true,
    orderUpdates: true,
  });

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirmation'),
      [
        { text: t('common.cancel'), onPress: () => {}, style: "cancel" },
        {
          text: t('profile.logout'),
          onPress: async () => {
            await logout();
            router.replace('/select-role');
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/farmer-profile-setup');
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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('profile.profile')}</Text>
        </View>
        <Text className="text-white/80">
          {t('profile.manageAccountPreferences')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg mb-6 items-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="relative">
            <View className="w-24 h-24 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F3F0' }}>
              <Image
                source={{ uri: profileImage || user?.profileImage || "https://example.com/placeholder.jpg" }}
                className="w-full h-full"
              />
            </View>
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-900">{user?.name || t('profile.farmer')}</Text>
          <Text className="text-sm text-gray-500">{user?.phone || t('profile.farmerPhone')}</Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#7C8B3A' }}
            onPress={handleEditProfile}
          >
            <Text className="text-white font-semibold">{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
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
          <Text className="text-xl font-bold text-gray-900 mb-4">{t('profile.accountSettings')}</Text>

          {/* Notifications Section */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => setNotificationsExpanded(!notificationsExpanded)}
          >
            <View className="flex-row items-center">
              <Bell size={20} color="#4B5563" />
              <Text className="ml-3 text-base">{t('profile.notifications')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          {notificationsExpanded && (
            <View className="ml-8 mt-2">
              <View className="flex-row items-center justify-between py-3">
                <Text>{t('profile.messageAlerts')}</Text>
                <Switch
                  value={notificationSettings.messageAlerts}
                  onValueChange={(value) =>
                    setNotificationSettings(prev => ({...prev, messageAlerts: value}))
                  }
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text>{t('profile.offerAlerts')}</Text>
                <Switch
                  value={notificationSettings.offerAlerts}
                  onValueChange={(value) =>
                    setNotificationSettings(prev => ({...prev, offerAlerts: value}))
                  }
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text>{t('profile.orderUpdates')}</Text>
                <Switch
                  value={notificationSettings.orderUpdates}
                  onValueChange={(value) =>
                    setNotificationSettings(prev => ({...prev, orderUpdates: value}))
                  }
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                />
              </View>
            </View>
          )}

          {/* My Activities */}
          <Text className="text-lg font-semibold mt-6 mb-2">{t('profile.myActivities')}</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/saved-buyers')}
          >
            <View className="flex-row items-center">
              <Heart size={20} color="#7C8B3A" />
              <Text className="ml-3 text-base">{t('profile.savedBuyers')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          {/* Others */}
          <Text className="text-lg font-semibold mt-6 mb-2">{t('profile.others')}</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/terms')}
          >
            <View className="flex-row items-center">
              <FileText size={20} color="#4B5563" />
              <Text className="ml-3 text-base">{t('profile.termsConditions')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/about')}
          >
            <View className="flex-row items-center">
              <Info size={20} color="#4B5563" />
              <Text className="ml-3 text-base">{t('profile.aboutApp')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            className="mt-8 mb-6 py-3 rounded-lg"
            style={{ backgroundColor: '#EF4444' }}
            onPress={handleLogout}
          >
            <View className="flex-row items-center justify-center">
              <LogOut size={20} color="#FFF" />
              <Text className="ml-2 text-white font-semibold">{t('profile.logout')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FarmerBottomNav activeTab="profile" />
    </View>
  );
}