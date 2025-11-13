import { useAuth } from '@/contexts/auth-context';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bell,
    ChevronDown,
    Cloud,
    Globe,
    Leaf,
    Mail,
    Phone,
    TrendingUp,
    User
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Modal,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout, selectLanguage, selectedLanguage } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [cropAlerts, setCropAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [profileName, setProfileName] = useState("John Doe");
  const [phoneNumber, setPhoneNumber] = useState("+1 234 567 8900");
  const [email, setEmail] = useState("john.doe@example.com");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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

          {/* Language Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Globe size={20} color="#666" />
              <Text className="text-base font-medium text-gray-700 ml-2">
                Language / భాష / भाषा / மொழி / ಭಾಷೆ
              </Text>
            </View>
            <TouchableOpacity
              className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between"
              onPress={() => setShowLanguageModal(true)}
            >
              <Text className="text-gray-800">
                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName || 'English'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Language Selection Modal */}
          <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLanguageModal(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl p-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">
                  Select Language
                </Text>
                <ScrollView className="max-h-96">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      onPress={async () => {
                        await selectLanguage(language.code as any);
                        setShowLanguageModal(false);
                        Alert.alert(
                          t('common.success'),
                          t('success.languageChanged')
                        );
                      }}
                      className={`p-4 rounded-xl mb-2 ${
                        selectedLanguage === language.code ? 'bg-green-50' : 'bg-gray-50'
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
                </ScrollView>
                <TouchableOpacity
                  onPress={() => setShowLanguageModal(false)}
                  className="mt-4 p-4 bg-gray-200 rounded-xl"
                >
                  <Text className="text-center text-gray-700 font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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

          {/* Others Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Others
            </Text>

            {/* Terms & Conditions */}
            <TouchableOpacity
              className="flex-row items-center justify-between mb-4 bg-gray-50 rounded-xl p-4"
              onPress={() => router.push('/terms')}
            >
              <View className="flex-row items-center">
                <Mail size={20} color="#666" />
                <Text className="text-base font-medium text-gray-700 ml-2">
                  Terms & Conditions
                </Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            {/* About App */}
            <TouchableOpacity
              className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4"
              onPress={() => router.push('/about')}
            >
              <View className="flex-row items-center">
                <Mail size={20} color="#666" />
                <Text className="text-base font-medium text-gray-700 ml-2">
                  About App
                </Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
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
