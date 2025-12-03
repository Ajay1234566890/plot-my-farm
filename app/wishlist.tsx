import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Search } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Wishlist() {
  const router = useRouter();
  const { t } = useTranslation();

  const mockWishlistItems = [
    {
      id: 1,
      name: t('wishlist.freshTomatoes'),
      farm: t('wishlist.greenFarms'),
      available: t('wishlist.kgAvailable', { amount: 50 }),
      price: t('wishlist.pricePerKg', { price: 200 }),
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
    {
      id: 2,
      name: t('wishlist.sweetCorn'),
      farm: t('wishlist.sunshineFields'),
      available: t('wishlist.dozensAvailable', { amount: 100 }),
      price: t('wishlist.pricePerDozen', { price: 330 }),
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
    {
      id: 3,
      name: t('wishlist.organicCarrots'),
      farm: t('wishlist.rootValley'),
      available: t('wishlist.kgAvailable', { amount: 80 }),
      price: t('wishlist.pricePerKg', { price: 145 }),
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
    {
      id: 4,
      name: t('wishlist.broccoliFlorets'),
      farm: t('wishlist.greenDirectCo'),
      available: t('wishlist.kgAvailable', { amount: 15 }),
      price: t('wishlist.pricePerKg', { price: 180 }),
      image:
        "https://images.unsplash.com/photo-1459411621453-7c6526433a8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      outOfStock: true,
    },
  ];

  // State to manage wishlist items
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleAddToCart = (id: number) => {
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      Alert.alert(
        "Added to Cart",
        `${item.name} has been added to your cart!`,
        [{ text: "OK" }]
      );
    }
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
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('wishlist.myWishlist')}</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-3">
          <Search size={20} color="white" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder={t('wishlist.searchInWishlist')}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {wishlistItems.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
            style={{
              shadowColor: '#B27E4C',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#B27E4C10'
            }}
          >
            <View className="flex-row">
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-lg"
              />
              <View className="flex-1 ml-4">
                <View className="flex-row justify-between items-start">
                  <Text className="text-gray-800 text-lg font-medium">
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Heart size={24} color="#ef4444" fill="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-500 text-sm mb-1">
                  {t('wishlist.grownBy', { farm: item.farm })}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {t('wishlist.available')}: {item.available}
                </Text>
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-lg font-semibold" style={{ color: '#B27E4C' }}>
                    {item.price}
                  </Text>
                  {!item.outOfStock ? (
                    <TouchableOpacity
                      onPress={() => handleAddToCart(item.id)}
                      className="px-4 py-2 rounded-full"
                      style={{ backgroundColor: '#B27E4C' }}
                    >
                      <Text className="text-white font-medium">
                        {t('wishlist.addToCart')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="bg-gray-200 px-4 py-2 rounded-full">
                      <Text className="text-gray-600 font-medium">
                        {t('wishlist.outOfStock')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
