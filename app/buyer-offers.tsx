import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Eye, MessageCircle, Plus, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BuyerOffersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-requests'>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for available farmer offers (what buyers can browse)
  const farmerOffers = [
    {
      id: 1,
      title: "Fresh Organic Tomatoes",
      farmer: "Rajesh Kumar",
      location: "Punjab, India",
      cropType: "Tomatoes",
      price: "₹45/kg",
      quantity: "50 kg available",
      image: "https://images.unsplash.com/photo-1518972559376-f5f715166441?w=800",
      quality: "Grade A",
      harvestDate: "2 days ago",
      rating: 4.8
    },
    {
      id: 2,
      title: "Farm Fresh Carrots",
      farmer: "Priya Sharma",
      location: "Haryana, India",
      cropType: "Carrots",
      price: "₹30/kg",
      quantity: "30 kg available",
      image: "https://images.unsplash.com/photo-1598453400264-46d90d1a7ea7?w=800",
      quality: "Premium",
      harvestDate: "1 day ago",
      rating: 4.9
    },
    {
      id: 3,
      title: "Premium Wheat",
      farmer: "Suresh Patel",
      location: "Madhya Pradesh, India",
      cropType: "Wheat",
      price: "₹25/kg",
      quantity: "100 kg available",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      quality: "Grade A",
      harvestDate: "3 days ago",
      rating: 4.7
    },
  ];

  // Mock data for buyer's own requests (what they want to buy)
  const myRequests = [
    {
      id: 1,
      title: "Looking for Organic Potatoes",
      cropType: "Potatoes",
      quantity: "20 kg needed",
      maxPrice: "₹35/kg",
      location: "Delhi NCR",
      status: "active",
      responses: 3,
      createdDate: "1 day ago"
    },
    {
      id: 2,
      title: "Need Fresh Onions",
      cropType: "Onions",
      quantity: "15 kg needed",
      maxPrice: "₹40/kg",
      location: "Delhi NCR",
      status: "active",
      responses: 5,
      createdDate: "3 days ago"
    },
  ];

  const filteredOffers = farmerOffers.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.farmer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFarmerOffer = ({ item }: { item: typeof farmerOffers[0] }) => (
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
      <View className="flex-row">
        <Image
          source={{ uri: item.image }}
          className="w-20 h-20 rounded-xl mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">{item.title}</Text>
          <Text className="text-sm text-gray-600 mb-1">by {item.farmer}</Text>
          <Text className="text-sm text-gray-500 mb-2">{item.location}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold" style={{ color: '#B27E4C' }}>{item.price}</Text>
            <Text className="text-sm text-gray-600">{item.quantity}</Text>
          </View>
        </View>
      </View>
      
      <View className="flex-row mt-4 gap-2">
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center"
          style={{ backgroundColor: '#B27E4C' }}
          onPress={() => router.push({
            pathname: "/crop-details",
            params: { cropId: item.id.toString(), from: 'buyer-offers' }
          })}
        >
          <View className="flex-row items-center">
            <Eye size={16} color="white" />
            <Text className="text-white font-semibold ml-2">View Details</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center border-2"
          style={{ borderColor: '#B27E4C' }}
          onPress={() => router.push({
            pathname: "/messages",
            params: { farmerId: item.farmer, cropId: item.id.toString() }
          })}
        >
          <View className="flex-row items-center">
            <MessageCircle size={16} color="#B27E4C" />
            <Text className="font-semibold ml-2" style={{ color: '#B27E4C' }}>Contact</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMyRequest = ({ item }: { item: typeof myRequests[0] }) => (
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
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold text-gray-900 flex-1">{item.title}</Text>
        <View className="bg-green-100 px-2 py-1 rounded-full">
          <Text className="text-green-700 text-xs font-semibold capitalize">{item.status}</Text>
        </View>
      </View>
      
      <Text className="text-gray-600 mb-1">{item.quantity}</Text>
      <Text className="text-gray-600 mb-1">Max Price: {item.maxPrice}</Text>
      <Text className="text-gray-500 text-sm mb-3">{item.location} • {item.createdDate}</Text>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-sm" style={{ color: '#B27E4C' }}>
          {item.responses} farmer responses
        </Text>
        <TouchableOpacity
          className="px-4 py-2 rounded-lg"
          style={{ backgroundColor: '#B27E4C' }}
        >
          <Text className="text-white font-semibold">View Responses</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Offers</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
            >
              <Bell color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/buyer-profile")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <User color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-3">
          <Search size={20} color="white" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Search offers, crops, farmers..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row mx-4 mt-4 mb-2">
        <TouchableOpacity
          onPress={() => setActiveTab('browse')}
          className={`flex-1 py-3 rounded-l-lg items-center ${
            activeTab === 'browse' ? 'bg-white' : 'bg-gray-200'
          }`}
          style={activeTab === 'browse' ? {
            shadowColor: '#B27E4C',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          } : {}}
        >
          <Text className={`font-semibold ${
            activeTab === 'browse' ? 'text-gray-900' : 'text-gray-600'
          }`}>
            Browse Offers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('my-requests')}
          className={`flex-1 py-3 rounded-r-lg items-center ${
            activeTab === 'my-requests' ? 'bg-white' : 'bg-gray-200'
          }`}
          style={activeTab === 'my-requests' ? {
            shadowColor: '#B27E4C',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          } : {}}
        >
          <Text className={`font-semibold ${
            activeTab === 'my-requests' ? 'text-gray-900' : 'text-gray-600'
          }`}>
            My Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'browse' ? (
          <FlatList
            data={filteredOffers}
            renderItem={renderFarmerOffer}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView className="flex-1 px-4 pb-24">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">My Purchase Requests</Text>
              <TouchableOpacity
                className="flex-row items-center px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#B27E4C' }}
                onPress={() => router.push('/create-request')}
              >
                <Plus size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Create Request</Text>
              </TouchableOpacity>
            </View>
            
            {myRequests.map((request) => (
              <View key={request.id}>
                {renderMyRequest({ item: request })}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
