import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  Heart,
  Info,
  LogOut,
  Users
} from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import BuyerBottomNav from './components/BuyerBottomNav';

export default function BuyerProfile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
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
        { text: t('common.cancel'), onPress: () => { }, style: "cancel" },
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
          <View className="w-24 h-24 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F3F0' }}>
            <Image
              source={{ uri: user?.profileImage || "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D" }}
              className="w-full h-full"
            />
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-900">{user?.name || t('buyerProfile.buyer')}</Text>
          <Text className="text-sm text-gray-500">{user?.phone || t('buyerProfile.buyerPhone')}</Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#B27E4C' }}
            onPress={() => router.push('/buyer-profile-setup')}
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
          <Text className="text-lg font-semibold mb-4">{t('profile.accountSettings')}</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/notifications')}
          >
            <View className="flex-row items-center">
              <Bell size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('profile.notifications')}</Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setNotificationsExpanded(!notificationsExpanded);
              }}
            >
              <ChevronRight size={20} color="#4B5563" />
            </TouchableOpacity>
          </TouchableOpacity>

          {notificationsExpanded && (
            <View className="pl-8 py-2">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">{t('profile.messageAlerts')}</Text>
                <Switch
                  value={notificationSettings.messageAlerts}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, messageAlerts: value })}
                  trackColor={{ false: '#E5E7EB', true: '#B27E4C' }}
                  thumbColor={notificationSettings.messageAlerts ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">{t('profile.offerAlerts')}</Text>
                <Switch
                  value={notificationSettings.offerAlerts}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, offerAlerts: value })}
                  trackColor={{ false: '#E5E7EB', true: '#B27E4C' }}
                  thumbColor={notificationSettings.offerAlerts ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">{t('profile.orderUpdates')}</Text>
                <Switch
                  value={notificationSettings.orderUpdates}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, orderUpdates: value })}
                  trackColor={{ false: '#E5E7EB', true: '#B27E4C' }}
                  thumbColor={notificationSettings.orderUpdates ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/buyer-settings')}
          >
            <View className="flex-row items-center">
              <Globe size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('profile.language')}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-500 mr-2">{t('common.english')}</Text>
              <ChevronRight size={20} color="#4B5563" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Info size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('buyerProfile.helpSupport')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* My Activities */}
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
          <Text className="text-lg font-semibold mb-4">{t('profile.myActivities')}</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/wishlist')}
          >
            <View className="flex-row items-center">
              <Heart size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('buyerProfile.wishlist')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/my-orders')}
          >
            <View className="flex-row items-center">
              <FileText size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('buyerProfile.myOrders')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/saved-farmers')}
          >
            <View className="flex-row items-center">
              <Users size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('profile.savedFarmers')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4"
            onPress={() => router.push('/buyer-settings')}
          >
            <View className="flex-row items-center">
              <Info size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">{t('settings.settings')}</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-white rounded-3xl p-6 shadow-lg mb-6 flex-row items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="ml-3 text-base font-semibold" style={{ color: '#EF4444' }}>
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="profile" />
    </View>
  );
}
