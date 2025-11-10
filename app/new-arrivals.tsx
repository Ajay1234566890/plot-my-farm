import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function NewArrivals() {
  const router = useRouter();
  const { t } = useTranslation();

  // Mock data for new arrivals
  const newArrivals = [
    {
      id: 1,
      name: t('crops.freshTomatoes'),
      harvestedAgo: t('common.daysAgo', { count: 2 }),
      image: 'https://example.com/tomatoes.jpg'
    },
    {
      id: 2,
      name: t('buyer.organicSpinach'),
      harvestedAgo: t('common.weeksAgo', { count: 1 }),
      image: 'https://example.com/spinach.jpg'
    },
    {
      id: 3,
      name: t('buyer.sweetCorn'),
      harvestedAgo: t('common.daysAgo', { count: 3 }),
      image: 'https://example.com/corn.jpg'
    },
    {
      id: 4,
      name: t('buyer.redBellPeppers'),
      harvestedAgo: t('common.daysAgo', { count: 5 }),
      image: 'https://example.com/peppers.jpg'
    },
    {
      id: 5,
      name: t('buyer.greenBeans'),
      harvestedAgo: t('common.weeksAgo', { count: 1 }),
      image: 'https://example.com/beans.jpg'
    }
  ];

  const handleAddToCart = (itemId: number) => {
    // Mock function to add item to cart
    console.log(`Added item ${itemId} to cart`);
    // Navigate to cart
    router.push('/cart');
  };

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
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">{t('buyer.newArrivals')}</Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.push('/cart')}
          >
            <ShoppingCart color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {newArrivals.map((item) => (
          <View 
            key={item.id}
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-500">{t('buyer.harvested')}: {item.harvestedAgo}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAddToCart(item.id)}
                className="px-6 py-2 rounded-full"
                style={{ backgroundColor: '#B27E4C' }}
              >
                <Text className="text-white font-semibold">{t('common.add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="crops" />
    </View>
  );
}