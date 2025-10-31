import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, MapPin, MessageSquare, Phone, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function SavedBuyers() {
  const router = useRouter();
  const [savedBuyers] = useState([
    {
      id: 1,
      name: "Anand Kumar",
      location: "Delhi, India",
      distance: "5km",
      rating: 4.8,
      reviews: 124,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      lastActive: "2 hours ago",
      verified: true,
      specialties: ["Organic Vegetables", "Fruits"],
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Mumbai, India",
      distance: "12km",
      rating: 4.9,
      reviews: 89,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      lastActive: "5 hours ago",
      verified: true,
      specialties: ["Grains", "Pulses"],
    },
    {
      id: 3,
      name: "Rajesh Patel",
      location: "Ahmedabad, India",
      distance: "8km",
      rating: 4.7,
      reviews: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      lastActive: "1 day ago",
      verified: true,
      specialties: ["Spices", "Herbs"],
    },
  ]);

  const handleRemoveFromSaved = (buyerId: number) => {
    // In a real app, this would remove from saved buyers
    console.log('Removing buyer from saved:', buyerId);
  };

  const handleContactBuyer = (buyerId: number) => {
    // In a real app, this would open chat or call
    console.log('Contacting buyer:', buyerId);
  };

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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Saved Buyers</Text>
        </View>
        <Text className="text-white/80">
          Your favorite buyers for quick access
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {savedBuyers.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Heart size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">No saved buyers yet</Text>
            <Text className="text-gray-400 text-center mt-2">
              Save buyers you frequently work with for quick access
            </Text>
          </View>
        ) : (
          savedBuyers.map((buyer) => (
            <View
              key={buyer.id}
              className="bg-white rounded-3xl p-6 mb-4 shadow-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="flex-row items-start">
                <Image
                  source={{ uri: buyer.avatar }}
                  className="w-16 h-16 rounded-full"
                />
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-gray-900">{buyer.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveFromSaved(buyer.id)}
                      className="p-2"
                    >
                      <Heart size={20} color="#7C8B3A" fill="#7C8B3A" />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">{buyer.location}</Text>
                    <Text className="text-gray-400 ml-2">• {buyer.distance}</Text>
                  </View>

                  <View className="flex-row items-center mt-2">
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-gray-700 ml-1 font-medium">{buyer.rating}</Text>
                    <Text className="text-gray-500 ml-1">({buyer.reviews} reviews)</Text>
                  </View>

                  <View className="flex-row flex-wrap mt-3">
                    {buyer.specialties.map((specialty, index) => (
                      <View
                        key={index}
                        className="px-3 py-1 rounded-full mr-2 mb-2"
                        style={{ backgroundColor: '#F5F3F0' }}
                      >
                        <Text className="text-xs" style={{ color: '#7C8B3A' }}>
                          {specialty}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-gray-500 text-sm">
                      Active {buyer.lastActive}
                    </Text>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() => handleContactBuyer(buyer.id)}
                        className="flex-row items-center px-4 py-2 rounded-full"
                        style={{ backgroundColor: '#7C8B3A' }}
                      >
                        <MessageSquare size={16} color="white" />
                        <Text className="text-white ml-2 font-medium">Message</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleContactBuyer(buyer.id)}
                        className="p-2 rounded-full border border-gray-300"
                      >
                        <Phone size={16} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <FarmerBottomNav activeTab="profile" />
    </View>
  );
}
