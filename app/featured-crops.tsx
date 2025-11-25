import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Search, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeaturedCropsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for featured/popular crops
  const featuredCrops = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Rajesh Kumar",
      location: "Punjab, India",
      price: "₹45/kg",
      quantity: "50 kg available",
      image: "https://images.unsplash.com/photo-1518972559376-f5f715166441?w=800",
      rating: 4.8,
      reviews: 125,
      quality: "Grade A",
      harvestDate: "2 days ago"
    },
    {
      id: 2,
      name: "Fresh Carrots",
      farmer: "Priya Sharma",
      location: "Haryana, India",
      price: "₹30/kg",
      quantity: "30 kg available",
      image: "https://images.unsplash.com/photo-1598453400264-46d90d1a7ea7?w=800",
      rating: 4.9,
      reviews: 98,
      quality: "Premium",
      harvestDate: "1 day ago"
    },
    {
      id: 3,
      name: "Premium Wheat",
      farmer: "Suresh Patel",
      location: "Madhya Pradesh, India",
      price: "₹25/kg",
      quantity: "100 kg available",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      rating: 4.7,
      reviews: 87,
      quality: "Grade A",
      harvestDate: "3 days ago"
    },
    {
      id: 4,
      name: "Organic Potatoes",
      farmer: "Amit Singh",
      location: "Uttar Pradesh, India",
      price: "₹35/kg",
      quantity: "40 kg available",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800",
      rating: 4.6,
      reviews: 76,
      quality: "Grade A",
      harvestDate: "1 day ago"
    },
    {
      id: 5,
      name: "Fresh Onions",
      farmer: "Deepak Verma",
      location: "Maharashtra, India",
      price: "₹40/kg",
      quantity: "60 kg available",
      image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=800",
      rating: 4.5,
      reviews: 65,
      quality: "Premium",
      harvestDate: "2 days ago"
    },
    {
      id: 6,
      name: "Organic Rice",
      farmer: "Ramesh Reddy",
      location: "Andhra Pradesh, India",
      price: "₹50/kg",
      quantity: "80 kg available",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
      rating: 4.9,
      reviews: 142,
      quality: "Premium",
      harvestDate: "1 week ago"
    },
  ];

  const filteredCrops = featuredCrops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCropCard = ({ item }: { item: typeof featuredCrops[0] }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4"
      style={{
        shadowColor: '#B27E4C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#B27E4C20'
      }}
      onPress={() => router.push({
        pathname: "/buyer-crop-details",
        params: { cropId: item.id.toString() }
      })}
    >
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-48 rounded-xl mb-3"
        />
        <TouchableOpacity 
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
          onPress={(e) => {
            e.stopPropagation();
            // Handle favorite action
          }}
        >
          <Heart size={20} color="#B27E4C" fill="white" />
        </TouchableOpacity>
        <View className="absolute bottom-5 left-2 bg-green-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">{item.quality}</Text>
        </View>
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-1">{item.name}</Text>
      <Text className="text-gray-600 text-sm mb-2">{item.farmer} • {item.location}</Text>

      <View className="flex-row items-center mb-2">
        <View className="flex-row items-center mr-3">
          <Star size={16} color="#FFA500" fill="#FFA500" />
          <Text className="text-gray-700 ml-1 font-semibold">{item.rating}</Text>
          <Text className="text-gray-500 text-xs ml-1">({item.reviews})</Text>
        </View>
        <Text className="text-gray-500 text-sm">{item.harvestDate}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold" style={{ color: '#B27E4C' }}>{item.price}</Text>
          <Text className="text-gray-500 text-sm">{item.quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header */}
      <View
        className="px-6 pt-12 pb-6"
        style={{
          backgroundColor: '#B27E4C',
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
          <Text className="text-2xl font-bold text-white">
            Featured Crops
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/90 rounded-full px-4 py-3">
          <Search size={20} color="#B27E4C" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search crops, farmers, location..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Crops List */}
      <FlatList
        data={filteredCrops}
        renderItem={renderCropCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-gray-600 text-center text-lg">
              No crops found
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Try adjusting your search
            </Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}

