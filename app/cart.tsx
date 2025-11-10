import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Heart,
    Minus,
    Plus,
    Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Mock cart data
  const initialCartItems = [
    {
      id: 1,
      name: t('crops.tomatoes'),
      price: 400,
      quantity: 2,
      unit: t('common.kg'),
      image: 'https://images.unsplash.com/photo-1546470427-227c8f25f783?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: t('buyer.sweetCorn'),
      price: 330,
      quantity: 1,
      unit: t('cart.dozen'),
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: t('crops.carrots'),
      price: 435,
      quantity: 3,
      unit: t('common.kg'),
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop'
    }
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, increment: boolean) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: increment
                ? item.quantity + 1
                : Math.max(0, item.quantity - 1)
            }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const moveToWishlist = (id: number) => {
    // In a real app, this would add to wishlist and remove from cart
    removeItem(id);
    router.push('/wishlist');
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('cart.myCart')}</Text>
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView className="flex-1">
        {cartItems.map(item => (
          <View
            key={item.id}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <Image
              source={{ uri: item.image }}
              className="w-16 h-16 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 ml-4">
              <View className="flex-row justify-between items-start">
                <Text className="text-lg font-medium">{item.name}</Text>
                <TouchableOpacity
                  onPress={() => moveToWishlist(item.id)}
                  className="p-2"
                >
                  <Heart size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-600">
                ₹{item.price} / {item.unit}
              </Text>
              <View className="flex-row items-center mt-2 justify-between">
                <View className="flex-row items-center bg-gray-100 rounded-full">
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, false)}
                    className="p-2"
                  >
                    <Minus size={20} color="#4B5563" />
                  </TouchableOpacity>
                  <Text className="px-4 font-medium">{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, true)}
                    className="p-2"
                  >
                    <Plus size={20} color="#4B5563" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  className="p-2"
                >
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View className="p-4 bg-white border-t border-gray-200 pb-24">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-600 text-lg">{t('cart.subtotal')}</Text>
          <Text className="text-xl font-semibold">₹{subtotal}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/checkout')}
          className="py-4 rounded-lg items-center"
          style={{ backgroundColor: '#B27E4C' }}
        >
          <Text className="text-white text-lg font-semibold">
            {t('cart.proceedToCheckout')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="home" />
      </View>
    </View>
  );
}