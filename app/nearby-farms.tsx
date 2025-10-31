import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Share2,
  Phone,
} from "lucide-react-native";

// Mock data for farms
const farms = [
  {
    id: 1,
    name: "Golden Corn",
    price: "₹150.00",
    image:
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: "235 locations available",
    farmer: {
      name: "Ethan Carter",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: 2,
    name: "Vine Tomatoes",
    price: "₹85.00",
    image:
      "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: "178 locations available",
    farmer: {
      name: "Steve Allen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  },
  {
    id: 3,
    name: "Organic Wheat",
    price: "₹220.00",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    location: "365 locations available",
    farmer: {
      name: "Ben Foster",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  },
];

export default function NearbyFarms() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-blue-600">
        <TouchableOpacity>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-white text-center ml-4">
          Search Results
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {farms.map((farm) => (
          <View key={farm.id} className="bg-white mb-4">
            {/* Farm Image */}
            <Image
              source={{ uri: farm.image }}
              className="w-full h-48"
              resizeMode="cover"
            />

            {/* Farm Details */}
            <View className="p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  {farm.name}
                </Text>
                <Text className="text-lg font-bold text-blue-600">
                  {farm.price}
                </Text>
              </View>

              <Text className="text-sm text-gray-500 mt-1">
                {farm.location}
              </Text>

              {/* Farmer Info and Actions */}
              <View className="flex-row items-center justify-between mt-4">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: farm.farmer.avatar }}
                    className="w-8 h-8 rounded-full"
                  />
                  <Text className="ml-2 text-sm text-gray-700">
                    {farm.farmer.name}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <TouchableOpacity className="bg-green-600 rounded-full px-4 py-2 mr-2 flex-row items-center">
                    <MessageCircle size={16} color="white" />
                    <Text className="text-white text-sm font-medium ml-1">
                      Chat
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="bg-blue-600 rounded-full px-4 py-2 flex-row items-center">
                    <Phone size={16} color="white" />
                    <Text className="text-white text-sm font-medium ml-1">
                      Call
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
