import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Edit3, Plus, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function FarmerOffersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'sold' | 'expired'>('all');
  const [activeTab, setActiveTab] = useState<'my-offers' | 'create'>('my-offers');

  // Mock data for farmer's own offers
  const myOffers = [
    {
      id: 1,
      title: "Fresh Organic Tomatoes",
      cropType: "Tomatoes",
      price: "₹45/kg",
      quantity: "50 kg",
      image: "https://images.unsplash.com/photo-1518972559376-f5f715166441?w=800",
      status: "active",
      createdDate: "2 days ago",
      buyers: 5
    },
    {
      id: 2,
      title: "Farm Fresh Carrots",
      cropType: "Carrots",
      price: "₹30/kg",
      quantity: "30 kg",
      image: "https://images.unsplash.com/photo-1598453400264-46d90d1a7ea7?w=800",
      status: "active",
      createdDate: "5 days ago",
      buyers: 3
    },
    {
      id: 3,
      title: "Premium Wheat",
      cropType: "Wheat",
      price: "₹25/kg",
      quantity: "100 kg",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      status: "sold",
      createdDate: "1 week ago",
      buyers: 8
    },
  ];

  // Filter offers based on selected status
  const filteredOffers = selectedStatus === 'all'
    ? myOffers
    : myOffers.filter(offer => offer.status === selectedStatus);

  const renderOfferItem = ({ item }: { item: typeof myOffers[0] }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-emerald-100">
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-40 rounded-xl mb-3"
        />
        <View className="absolute top-2 left-2 bg-emerald-500 rounded-lg px-2 py-1">
          <Text className="text-white font-bold text-xs capitalize">{item.status}</Text>
        </View>
        <View className="absolute top-2 right-2 flex-row gap-2">
          <TouchableOpacity className="bg-white rounded-full p-2">
            <Edit3 color="#059669" size={18} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white rounded-full p-2">
            <Trash2 color="#ef4444" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">{item.cropType}</Text>

      <View className="flex-row justify-between items-center mt-3">
        <View>
          <Text className="font-bold text-lg" style={{ color: '#7C8B3A' }}>{item.price}</Text>
          <Text className="text-gray-500 text-sm">{item.quantity}</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-600 text-sm">{item.createdDate}</Text>
          <Text className="font-semibold text-sm mt-1" style={{ color: '#7C8B3A' }}>{item.buyers} buyers</Text>
        </View>
      </View>
    </View>
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
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">My Offers</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
            >
              <Bell color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <User color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Two Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab('my-offers')}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
              activeTab === 'my-offers'
                ? 'bg-white'
                : 'bg-white/20 border border-white/30'
            }`}
          >
            <Text className={`font-semibold ${
              activeTab === 'my-offers'
                ? 'text-emerald-600'
                : 'text-white'
            }`}>
              My Offers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/add-offer")}
            className="flex-1 py-3 rounded-xl flex-row items-center justify-center bg-white/20 border border-white/30"
          >
            <Plus color="white" size={20} />
            <Text className="text-white font-semibold ml-2">Create Offer</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 mt-2">
          Manage your crop listings and offers
        </Text>
      </View>
      
      {/* Status Filter */}
      <View className="py-4 px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-16"
        >
          {(['all', 'active', 'sold', 'expired'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              className={`rounded-full px-6 py-2 mr-3 ${
                selectedStatus === status
                  ? 'bg-emerald-500'
                  : 'bg-white border border-emerald-100'
              }`}
            >
              <Text className={`font-medium capitalize ${
                selectedStatus === status
                  ? 'text-white'
                  : 'text-gray-700'
              }`}>
                {status === 'all' ? 'All Offers' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Offers List */}
      <View className="flex-1 px-4">
        <FlatList
          data={filteredOffers}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 text-lg">No offers found</Text>
            </View>
          }
        />
      </View>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}