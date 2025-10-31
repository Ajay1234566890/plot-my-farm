import { useRouter } from "expo-router";
import { ArrowLeft, Search, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FarmerBottomNav from './components/FarmerBottomNav';

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
    price: "₹2275",
    unit: "per quintal",
    change: -25.00,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    name: "Cotton",
    price: "₹55000",
    unit: "per candy",
    change: 500.00,
    image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=900&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    name: "Potatoes",
    price: "₹160",
    unit: "per kg",
    change: -12.00,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=900&auto=format&fit=crop&q=60"
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

export default function MarketRealPrices() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCrops = mockCrops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#64748b" />
          <TouchableOpacity
            className="flex-1 ml-2"
            onPress={() => {/* Handle focus */}}
          >
            <Text className="text-gray-400">
              Search for crops
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Last Updated */}
      <View className="px-4 py-2">
        <Text className="text-gray-500 text-sm">
          Updated 2 mins ago
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredCrops.map((crop) => (
          <View
            key={crop.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
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

      <FarmerBottomNav activeTab="home" />
    </View>
  );
}