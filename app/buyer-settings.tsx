import { useAuth } from '@/contexts/auth-context';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bell,
    ChevronDown,
    Globe,
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

export default function BuyerSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout, selectLanguage, selectedLanguage } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [offerAlerts, setOfferAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section - Buyer Design */}
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
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('settings.settings')}</Text>
        </View>
        <Text className="text-white/80">
          {t('settings.customizePreferences')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Notification Settings Card */}
        <View
          className="bg-white rounded-3xl p-6 mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center mb-4">
            <Bell size={24} color="#B27E4C" />
            <Text className="text-lg font-bold text-gray-900 ml-3">
              {t('settings.notifications')}
            </Text>
          </View>

          {/* Push Notifications */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                {t('settings.pushNotifications')}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t('settings.receiveNotifications')}
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#D1D5DB", true: "#B27E4C" }}
              thumbColor={pushNotifications ? "#FFFFFF" : "#F3F4F6"}
            />
          </View>

          {/* Offer Alerts */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                {t('settings.offerAlerts')}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t('settings.newOfferNotifications')}
              </Text>
            </View>
            <Switch
              value={offerAlerts}
              onValueChange={setOfferAlerts}
              trackColor={{ false: "#D1D5DB", true: "#B27E4C" }}
              thumbColor={offerAlerts ? "#FFFFFF" : "#F3F4F6"}
            />
          </View>

          {/* Order Updates */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                {t('settings.orderUpdates')}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t('settings.orderStatusNotifications')}
              </Text>
            </View>
            <Switch
              value={orderUpdates}
              onValueChange={setOrderUpdates}
              trackColor={{ false: "#D1D5DB", true: "#B27E4C" }}
              thumbColor={orderUpdates ? "#FFFFFF" : "#F3F4F6"}
            />
          </View>

          {/* Price Alerts */}
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">
                {t('settings.priceAlerts')}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t('settings.priceChangeNotifications')}
              </Text>
            </View>
            <Switch
              value={priceAlerts}
              onValueChange={setPriceAlerts}
              trackColor={{ false: "#D1D5DB", true: "#B27E4C" }}
              thumbColor={priceAlerts ? "#FFFFFF" : "#F3F4F6"}
            />
          </View>
        </View>

        {/* Language Settings Card */}
        <View
          className="bg-white rounded-3xl p-6 mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center mb-4">
            <Globe size={24} color="#B27E4C" />
            <Text className="text-lg font-bold text-gray-900 ml-3">
              {t('settings.language')}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between"
            onPress={() => setShowLanguageModal(true)}
          >
            <Text className="text-gray-800 text-base">
              {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName || 'English'}
            </Text>
            <ChevronDown size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Account Actions Card */}
        <View
          className="bg-white rounded-3xl p-6 mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center mb-4">
            <User size={24} color="#B27E4C" />
            <Text className="text-lg font-bold text-gray-900 ml-3">
              {t('settings.account')}
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="rounded-xl p-4"
            style={{ backgroundColor: '#FEE2E2' }}
            onPress={handleLogout}
          >
            <Text className="text-red-600 font-semibold text-center text-base">
              {t('profile.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
              {t('profile.selectLanguage')}
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
                      t('profile.languageChanged')
                    );
                  }}
                  className={`p-4 rounded-xl mb-2 ${
                    selectedLanguage === language.code ? 'bg-orange-50' : 'bg-gray-50'
                  }`}
                  style={selectedLanguage === language.code ? { backgroundColor: '#FED7AA' } : {}}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedLanguage === language.code
                        ? 'text-orange-900'
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
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

