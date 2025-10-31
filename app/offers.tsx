import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for offers
const offers = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    farm: "Sunfarm Organics",
    originalPrice: "₹200/kg",
    discountedPrice: "₹180/kg",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    tag: "10% OFF"
  },
  {
    id: 2,
    name: "Organic Carrots",
    farm: "Green Valley Farms",
    originalPrice: "₹160/kg",
    discountedPrice: "₹145/kg",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
    tag: "Price Drop"
  },
  {
    id: 3,
    name: "Sweet Corn",
    farm: "Harvest Co-op",
    originalPrice: "₹230/dozen",
    discountedPrice: "₹200/dozen",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    tag: "₹30 OFF"
  }
];

const screenWidth = Dimensions.get('window').width;

export default function OffersScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-4 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold ml-2">Offers</Text>
        </View>
      </View>

      {/* Offers List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {offers.map((offer) => (
          <View 
            key={offer.id} 
            className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
          >
            <Image 
              source={{ uri: offer.image }}
              style={{
                width: screenWidth - 32, // Full width minus padding
                height: 200
              }}
              className="w-full"
              resizeMode="cover"
            />
            
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-semibold text-gray-900">
                    {offer.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {offer.farm}
                  </Text>
                </View>
                <View className="bg-red-100 px-2 py-1 rounded">
                  <Text className="text-red-600 text-sm font-medium">
                    {offer.tag}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mt-3">
                <Text className="text-gray-400 line-through text-sm">
                  {offer.originalPrice}
                </Text>
                <Text className="text-blue-600 font-bold text-lg ml-2">
                  {offer.discountedPrice}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-blue-600 rounded-full py-3 mt-4"
              >
                <Text className="text-white text-center font-semibold">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity className="items-center" onPress={() => router.push('/')}>
          <Text className="text-gray-600">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/crops')}>
          <Text className="text-gray-600">Crops</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/voice')}>
          <Text className="text-gray-600">Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/orders')}>
          <Text className="text-gray-600">Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center" onPress={() => router.push('/profile')}>
          <Text className="text-gray-600">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}