import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, Phone, User } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native';

export default function RequestResponsesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const requestId = params.requestId as string;

  // Handler functions for Call and Message
  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Error', 'Phone number not available');
    }
  };

  const handleMessage = (farmerId: string, farmerName: string, farmerAvatar: string, cropName: string) => {
    // Navigate to in-app chat screen
    router.push({
      pathname: '/buyer-chat-screen',
      params: {
        userId: farmerId,
        userName: farmerName,
        userAvatar: farmerAvatar,
        userRole: 'Farmer',
        cropName: cropName,
      }
    });
  };

  // Mock data for farmer responses to the buyer's request
  const responses = [
    {
      id: 1,
      farmerId: 'farmer-1',
      farmerName: "Rajesh Kumar",
      farmerPhone: '9876543210',
      farmerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      cropType: "Organic Potatoes",
      offeredPrice: "₹32/kg",
      availableQuantity: "25 kg",
      quality: "Grade A",
      location: "Punjab, India",
      rating: 4.8,
      responseDate: "2 hours ago",
      message: "I have fresh organic potatoes available. Can deliver within 2 days."
    },
    {
      id: 2,
      farmerId: 'farmer-2',
      farmerName: "Priya Sharma",
      farmerPhone: '9876543211',
      farmerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      cropType: "Organic Potatoes",
      offeredPrice: "₹30/kg",
      availableQuantity: "30 kg",
      quality: "Premium",
      location: "Haryana, India",
      rating: 4.9,
      responseDate: "5 hours ago",
      message: "High quality organic potatoes. Free delivery for orders above 20kg."
    },
    {
      id: 3,
      farmerId: 'farmer-3',
      farmerName: "Suresh Patel",
      farmerPhone: '9876543212',
      farmerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      cropType: "Organic Potatoes",
      offeredPrice: "₹33/kg",
      availableQuantity: "20 kg",
      quality: "Grade A",
      location: "Madhya Pradesh, India",
      rating: 4.7,
      responseDate: "1 day ago",
      message: "Fresh harvest. Can provide quality certificate."
    },
  ];

  const renderResponse = ({ item }: { item: typeof responses[0] }) => (
    <View 
      className="bg-white rounded-xl p-4 mb-4"
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
      <View className="flex-row items-start mb-3">
        <Image
          source={{ uri: item.farmerImage }}
          className="w-16 h-16 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{item.farmerName}</Text>
          <Text className="text-gray-600 text-sm">{item.location}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-yellow-500 font-semibold">★ {item.rating}</Text>
            <Text className="text-gray-500 text-xs ml-2">{item.responseDate}</Text>
          </View>
        </View>
      </View>

      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Offered Price:</Text>
          <Text className="font-bold" style={{ color: '#B27E4C' }}>{item.offeredPrice}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Available Quantity:</Text>
          <Text className="font-semibold text-gray-900">{item.availableQuantity}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Quality:</Text>
          <Text className="font-semibold text-gray-900">{item.quality}</Text>
        </View>
      </View>

      {item.message && (
        <View className="bg-blue-50 rounded-lg p-3 mb-3">
          <Text className="text-gray-700 text-sm">{item.message}</Text>
        </View>
      )}

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => handleCall(item.farmerPhone)}
          className="flex-1 flex-row items-center justify-center rounded-full py-3 bg-green-600"
        >
          <Phone size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleMessage(item.farmerId, item.farmerName, item.farmerImage, item.cropType)}
          className="flex-1 flex-row items-center justify-center rounded-full py-3"
          style={{ backgroundColor: '#B27E4C' }}
        >
          <MessageCircle size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Message</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">
            Farmer Responses
          </Text>
        </View>
        <Text className="text-white/80 ml-14">
          {responses.length} farmers responded to your request
        </Text>
      </View>

      {/* Responses List */}
      <FlatList
        data={responses}
        renderItem={renderResponse}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <User size={64} color="#B27E4C" />
            <Text className="text-gray-600 text-center mt-4 text-lg">
              No responses yet
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Farmers will respond to your request soon
            </Text>
          </View>
        }
      />

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}

