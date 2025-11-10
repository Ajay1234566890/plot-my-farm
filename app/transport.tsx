import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    FileText,
    Home,
    MessageCircle,
    Mic,
    Package,
    Sprout,
    Truck,
    User,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TransportScreen() {
  const { t } = useTranslation();

  // Mock data for delivery history
  const deliveryHistory = [
    {
      id: "123456",
      status: t('transport.estimatedDeliveryDays', { days: 2 }),
      date: "2024-02-15",
    },
    {
      id: "789012",
      status: t('transport.deliveredOn', { date: "2024-07-20" }),
      date: "2024-07-20",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      {/* Header with blue theme */}
      <LinearGradient
        colors={["#1e40af", "#3b82f6"]}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('transport.transport')}</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-6 mb-24">
        {/* Quick Actions Section */}
        <View className="mb-8">
          <Text className="text-gray-800 text-lg font-bold mb-4">
            {t('transport.quickActions')}
          </Text>

          <TouchableOpacity className="bg-blue-500 rounded-xl py-4 mb-3 flex-row items-center justify-center">
            <Truck color="white" size={20} className="mr-2" />
            <Text className="text-white font-bold text-base">
              {t('transport.arrangeNewTransport')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-blue-200 rounded-xl py-4 mb-3 flex-row items-center justify-center">
            <Package color="#3b82f6" size={20} className="mr-2" />
            <Text className="text-blue-500 font-bold text-base">
              {t('transport.viewOngoingShipments')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-blue-500 rounded-xl py-4 flex-row items-center justify-center">
            <FileText color="white" size={20} className="mr-2" />
            <Text className="text-white font-bold text-base">
              {t('transport.getTransportQuote')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delivery History Section */}
        <View>
          <Text className="text-gray-800 text-lg font-bold mb-4">
            {t('transport.deliveryHistory')}
          </Text>

          {deliveryHistory.map((delivery) => (
            <TouchableOpacity
              key={delivery.id}
              className="bg-white rounded-xl p-4 mb-3 border border-blue-100 flex-row items-center"
            >
              <View className="bg-blue-100 rounded-full p-3 mr-4">
                <Truck color="#3b82f6" size={24} />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">
                  {t('transport.orderNumber', { number: delivery.id })}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {delivery.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
          {/* Home Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="Home tab"
            accessibilityRole="tab"
          >
            <Home size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('common.home')}</Text>
          </TouchableOpacity>

          {/* My Farms Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="My Farms tab"
            accessibilityRole="tab"
          >
            <Sprout size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('common.crops')}</Text>
          </TouchableOpacity>

          {/* Mic Button */}
          <TouchableOpacity
            className="items-center justify-center -mt-5 bg-blue-500 rounded-full w-14 h-14 shadow-lg"
            accessibilityLabel="Voice command"
            accessibilityRole="button"
          >
            <Mic size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Messages Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="Messages tab"
            accessibilityRole="tab"
          >
            <MessageCircle size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('orders.orders')}</Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="Profile tab"
            accessibilityRole="tab"
          >
            <User size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('common.profile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Safe Area Spacing for iOS */}
        <View className="h-[12px] bg-white" />
      </View>
    </SafeAreaView>
  );
}
