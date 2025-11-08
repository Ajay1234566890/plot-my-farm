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
import FarmerBottomNav from './components/FarmerBottomNav';

export default function Profile() {
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
              source={{ uri: user?.profileImage || "https://example.com/placeholder.jpg" }}
              className="w-full h-full"
            />
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-900">{user?.name || "Farmer"}</Text>
          <Text className="text-sm text-gray-500">{user?.email || "farmer@example.com"}</Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#7C8B3A' }}
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
          <Text className="text-xl font-bold text-gray-900 mb-4">Account Settings</Text>
          
          {/* Notifications Section */}
          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => setNotificationsExpanded(!notificationsExpanded)}
          >
            <View className="flex-row items-center">
              <Bell size={20} color="#4B5563" />
              <Text className="ml-3 text-base">Notifications</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          {notificationsExpanded && (
            <View className="ml-8 mt-2">
              <View className="flex-row items-center justify-between py-3">
                <Text>Message Alerts</Text>
                <Switch
                  value={notificationSettings.messageAlerts}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({...prev, messageAlerts: value}))
                  }
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text>Offer Alerts</Text>
                <Switch
                  value={notificationSettings.offerAlerts}
                  onValueChange={(value) => 
                    setNotificationSettings(prev => ({...prev, offerAlerts: value}))
                  }
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                />
              </View>
              <View className="flex-row items-center justify-between py-3">
                <Text>Order Updates</Text>
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
          <Text className="text-lg font-semibold mt-6 mb-2">My Activities</Text>
          
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => router.push('/saved-buyers')}
          >
            <View className="flex-row items-center">
              <Heart size={20} color="#7C8B3A" />
              <Text className="ml-3 text-base">Saved Buyers</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => {/* Handle language selection */}}
          >
            <View className="flex-row items-center">
              <Globe size={20} color="#4B5563" />
              <Text className="ml-3 text-base">Language</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          {/* Others */}
          <Text className="text-lg font-semibold mt-6 mb-2">Others</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => {/* Handle terms */}}
          >
            <View className="flex-row items-center">
              <FileText size={20} color="#4B5563" />
              <Text className="ml-3 text-base">Terms & Conditions</Text>
            </View>
            <ChevronRight size={20} color="#4B5563" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => {/* Handle about */}}
          >
            <View className="flex-row items-center">
              <Info size={20} color="#4B5563" />
              <Text className="ml-3 text-base">About the App</Text>
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
              <Text className="ml-2 text-white font-semibold">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FarmerBottomNav activeTab="profile" />
    </View>
  );
}