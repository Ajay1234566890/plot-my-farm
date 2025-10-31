import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bell,
    Cloud,
    Leaf,
    Mail,
    Phone,
    TrendingUp,
    User
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const { logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [cropAlerts, setCropAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [profileName, setProfileName] = useState("John Doe");
  const [phoneNumber, setPhoneNumber] = useState("+1 234 567 8900");
  const [email, setEmail] = useState("john.doe@example.com");

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
          backgroundColor: '#7C8B3A', // Olive/army green matching farmer-home
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Settings</Text>
        </View>
        <Text className="text-white/80">
          Customize your app preferences
        </Text>
      </View>

      {/* Settings Content */}
      <View className="flex-1 px-6 pt-6">
          {/* Profile Name Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <User size={20} color="#666" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                Profile Name
              </Text>
            </View>
            <TouchableOpacity
              className="bg-gray-50 rounded-xl p-4"
              onPress={() => console.log("Edit profile name")}
            >
              <Text className="text-gray-800">{profileName}</Text>
            </TouchableOpacity>
          </View>

          {/* Phone Number Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Phone size={20} color="#666" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                Phone Number
              </Text>
            </View>
            <TouchableOpacity
              className="bg-gray-50 rounded-xl p-4"
              onPress={() => console.log("Edit phone number")}
            >
              <Text className="text-gray-800">{phoneNumber}</Text>
            </TouchableOpacity>
          </View>

          {/* Email Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Mail size={20} color="#666" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                Gmail Address
              </Text>
            </View>
            <TouchableOpacity
              className="bg-gray-50 rounded-xl p-4"
              onPress={() => console.log("Edit email")}
            >
              <Text className="text-gray-800">{email}</Text>
            </TouchableOpacity>
          </View>

          {/* Notification Settings */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Notifications
            </Text>

            {/* Push Notifications Toggle */}
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Bell size={20} color="#666" />
                <Text className="text-base font-medium text-gray-700 ml-2">
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Crop Alerts Toggle */}
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Leaf size={20} color="#666" />
                <Text className="text-base font-medium text-gray-700 ml-2">
                  Crop Alerts
                </Text>
              </View>
              <Switch
                value={cropAlerts}
                onValueChange={setCropAlerts}
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Weather Alerts Toggle */}
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Cloud size={20} color="#666" />
                <Text className="text-base font-medium text-gray-700 ml-2">
                  Weather Alerts
                </Text>
              </View>
              <Switch
                value={weatherAlerts}
                onValueChange={setWeatherAlerts}
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Price Alerts Toggle */}
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <TrendingUp size={20} color="#666" />
                <Text className="text-base font-medium text-gray-700 ml-2">
                  Price Alerts
                </Text>
              </View>
              <Switch
                value={priceAlerts}
                onValueChange={setPriceAlerts}
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          {/* Logout Button */}
          <View className="mt-auto">
            <TouchableOpacity
              className="bg-red-500 rounded-xl p-4 items-center"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}
