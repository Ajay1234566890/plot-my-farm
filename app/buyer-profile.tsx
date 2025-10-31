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
    LogOut
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import BuyerBottomNav from './components/BuyerBottomNav';

export default function BuyerProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    messageAlerts: true,
    offerAlerts: true,
    orderUpdates: true,
  });

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace('/login');
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
          <Text className="text-xl font-bold text-white">Profile</Text>
        </View>
        <Text className="text-white/80">
          Manage your account and preferences
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
          <Text className="mt-4 text-xl font-bold text-gray-900">{user?.name || "Buyer"}</Text>
          <Text className="text-sm text-gray-500">{user?.email || "buyer@example.com"}</Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#B27E4C' }}
            onPress={() => Alert.alert("Edit Profile", "Profile editing coming soon")}
          >
            <Text className="text-white font-semibold">Edit Profile</Text>
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
          <Text className="text-lg font-semibold mb-4">Account Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Bell size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">Notifications</Text>
            </View>
            <TouchableOpacity onPress={() => setNotificationsExpanded(!notificationsExpanded)}>
              <ChevronRight size={20} color="#4B5563" />
            </TouchableOpacity>
          </TouchableOpacity>

          {notificationsExpanded && (
            <View className="pl-8 py-2">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">Message Alerts</Text>
                <Switch
                  value={notificationSettings.messageAlerts}
                  onValueChange={(value) => setNotificationSettings({...notificationSettings, messageAlerts: value})}
                  trackColor={{ false: '#E5E7EB', true: '#B27E4C' }}
                  thumbColor={notificationSettings.messageAlerts ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">Offer Alerts</Text>
                <Switch
                  value={notificationSettings.offerAlerts}
                  onValueChange={(value) => setNotificationSettings({...notificationSettings, offerAlerts: value})}
                  trackColor={{ false: '#E5E7EB', true: '#B27E4C' }}
                  thumbColor={notificationSettings.offerAlerts ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">Order Updates</Text>
                <Switch
                  value={notificationSettings.orderUpdates}
                  onValueChange={(value) => setNotificationSettings({...notificationSettings, orderUpdates: value})}
                  trackColor={{ false: '#E5E7EB', true: '#B27E4C' }}
                  thumbColor={notificationSettings.orderUpdates ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          )}

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Globe size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">Language</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-500 mr-2">English</Text>
              <ChevronRight size={20} color="#4B5563" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <Info size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">Help & Support</Text>
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
          <Text className="text-lg font-semibold mb-4">My Activities</Text>
          
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/wishlist')}
          >
            <View className="flex-row items-center">
              <Heart size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">Wishlist</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/my-orders')}
          >
            <View className="flex-row items-center">
              <FileText size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">My Orders</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-4"
            onPress={() => router.push('/settings')}
          >
            <View className="flex-row items-center">
              <Info size={20} color="#B27E4C" />
              <Text className="ml-3 text-base">Settings</Text>
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
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="profile" />
    </View>
  );
}
