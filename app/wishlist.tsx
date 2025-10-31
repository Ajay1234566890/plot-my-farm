import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Search } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const mockWishlistItems = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    farm: "Green Farms",
    available: "50kg",
    price: "₹200/kg",
    image:
      "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Sweet Corn",
    farm: "Sunshine Fields",
    available: "100 dozens",
    price: "₹330/dozen",
    image:
      "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "Organic Carrots",
    farm: "Root Valley",
    available: "80kg",
    price: "₹145/kg",
    image:
      "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "Broccoli Florets",
    farm: "Green Direct Co",
    available: "15kg",
    price: "₹180/kg",
    image:
      "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    outOfStock: true,
  },
];

export default function Wishlist() {
  const router = useRouter();

  const handleRemoveFromWishlist = (id: number) => {
    // In a real app, this would update the wishlist state
    console.log("Remove item:", id);
  };

  const handleAddToCart = (id: number) => {
    // In a real app, this would add the item to cart
    console.log("Add to cart:", id);
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
          <Text className="text-white text-xl font-bold">My Wishlist</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-3">
          <Search size={20} color="white" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Search in wishlist..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {mockWishlistItems.map((item) => (
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
                  Grown by {item.farm}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Available: {item.available}
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
                        Add to Cart
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="bg-gray-200 px-4 py-2 rounded-full">
                      <Text className="text-gray-600 font-medium">
                        Out of Stock
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
