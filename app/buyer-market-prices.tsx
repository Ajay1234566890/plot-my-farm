import { useRouter } from "expo-router";
import { ArrowLeft, Search, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BuyerBottomNav from './components/BuyerBottomNav';

const mockCrops = [
  {
    id: 1,
    name: "Tomatoes",
    price: "₹200",
    unit: "per kg",
    change: -8.00,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Sweet Corn",
    price: "₹230",
    unit: "per dozen",
    change: -24.00,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Carrots",
    price: "₹145",
    unit: "per kg",
    change: 14.00,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Onions",
    price: "₹180",
    unit: "per kg",
    change: 10.00,
    image: "https://images.unsplash.com/photo-1618512496248-a01f6a44dba9?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    name: "Paddy",
    price: "₹2183",
    unit: "per quintal",
    change: 50.00,
    image: "https://images.unsplash.com/photo-1568201402596-ececec2006a1?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "Wheat",
    price: "₹2250",
    unit: "per quintal",
    change: -25.00,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    name: "Maize",
    price: "₹1850",
    unit: "per quintal",
    change: 30.00,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    name: "Cotton",
    price: "₹5800",
    unit: "per quintal",
    change: -120.00,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 9,
    name: "Soybeans",
    price: "₹4200",
    unit: "per quintal",
    change: 75.00,
    image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 10,
    name: "Sugarcane",
    price: "₹350",
    unit: "per quintal",
    change: 15.00,
    image: "https://images.unsplash.com/photo-1597522810752-7a9b8e9e3259?w=900&auto=format&fit=crop&q=60"
  }
];

export default function BuyerMarketPrices() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCrops = mockCrops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">
              Market Real Prices
            </Text>
            <Text className="text-white/80 text-sm mt-1">
              Live crop prices from markets
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-3">
          <Search size={20} color="white" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Search crops..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredCrops.map((crop) => (
          <View
            key={crop.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
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
            <Image
              source={{ uri: crop.image }}
              className="w-16 h-16 rounded-lg"
            />
            <View className="flex-1 ml-4">
              <Text className="text-gray-800 text-lg font-medium">
                {crop.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {crop.unit}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-800 text-lg font-semibold">
                {crop.price}
              </Text>
              <View className="flex-row items-center">
                {crop.change > 0 ? (
                  <>
                    <TrendingUp size={16} color="#22c55e" />
                    <Text className="text-green-500 ml-1">
                      +{crop.change.toFixed(2)}
                    </Text>
                  </>
                ) : (
                  <>
                    <TrendingDown size={16} color="#ef4444" />
                    <Text className="text-red-500 ml-1">
                      {crop.change.toFixed(2)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
