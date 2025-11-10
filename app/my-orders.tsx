import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Order {
  id: string;
  trackingNumber: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'Processing';
}

export default function MyOrders() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const orders: Order[] = [
    {
      id: '1947034',
      trackingNumber: 'IW347545345',
      date: '05-12-2023',
      amount: 9300,
      status: 'Delivered',
    },
    {
      id: '1947035',
      trackingNumber: 'IW347545346',
      date: '06-12-2023',
      amount: 7055,
      status: 'Processing',
    },
    {
      id: '1947036',
      trackingNumber: 'IW347545347',
      date: '07-12-2023',
      amount: 16849,
      status: 'Delivered',
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section - Buyer Design System */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#B27E4C', // Buyer primary color (brown/copper)
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
              onPress={() => router.back()}
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">{t('orders.myOrders')}</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
            <Search color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white p-4 mb-4 rounded-xl"
            style={{
              shadowColor: '#B27E4C',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#B27E4C10'
            }}
            onPress={() => router.push(`/track-order?orderId=${order.id}`)}
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-gray-900 font-medium">
                {t('orders.orderNumberHash', { number: order.id })}
              </Text>
              <Text className="text-gray-500 text-sm">
                {order.date}
              </Text>
            </View>

            <View className="mb-2">
              <Text className="text-gray-500 text-sm">
                {t('orders.trackingNumber')}
              </Text>
              <Text className="text-gray-700">
                {order.trackingNumber}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-500 text-sm">
                  {t('orders.totalAmount')}
                </Text>
                <Text className="text-gray-900 font-semibold">
                  ₹{order.amount.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View
                  className={`rounded-full h-2 w-2 mr-2 ${
                    order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <Text
                  className={
                    order.status === 'Delivered'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }
                >
                  {t(`orders.${order.status.toLowerCase()}`)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="orders" />
      </View>
    </View>
  );
}