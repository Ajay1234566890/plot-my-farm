import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import MapLibreView from "@/components/MapLibreView";
import { RADIUS_PRESETS } from "@/utils/haversine";
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  MessageSquare,
  Mic,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function NearbyBuyers() {
  const { t } = useTranslation();
  const router = useRouter();

  // Handler functions for Call and Message
  const handleCall = (buyerName: string, phone?: string) => {
    const phoneNumber = phone || '+1234567890'; // Mock phone number
    Alert.alert(
      t('common.call'),
      `${t('common.calling')} ${buyerName}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.call'),
          onPress: () => Linking.openURL(`tel:${phoneNumber}`)
        }
      ]
    );
  };

  const handleMessage = (buyerName: string, buyerId: number) => {
    router.push({
      pathname: '/chat-screen',
      params: {
        userId: buyerId,
        userName: buyerName,
        userType: 'buyer'
      }
    });
  };

  // Mock data for nearby buyers with enhanced details
  const buyers = [
    {
      id: 1,
      name: t('buyer.anandKumar'),
      location: t('buyer.delhiIndia'),
      distance: t('buyer.kmAway', { count: 5 }),
      rating: 4.8,
      reviews: 124,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      lastActive: t('common.hoursAgo', { count: 2 }),
      verified: true,
    },
    {
      id: 2,
      name: t('buyer.priyaSharma'),
      location: t('buyer.mumbaiIndia'),
      distance: t('buyer.kmAway', { count: 12 }),
      rating: 4.9,
      reviews: 89,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      lastActive: t('common.hoursAgo', { count: 5 }),
      verified: true,
    },
    {
      id: 3,
      name: t('buyer.rajeshSingh'),
      location: t('buyer.bangaloreIndia'),
      distance: t('buyer.kmAway', { count: 18 }),
      rating: 4.5,
      reviews: 67,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      lastActive: t('common.daysAgo', { count: 1 }),
      verified: false,
    },
  ];

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
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('buyer.nearbyBuyers')}</Text>
        </View>
        <Text className="text-white/80 mb-4">
          {t('buyer.findBuyersForCrops')}
        </Text>

        {/* Enhanced Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#4B5563" />
          <TextInput
            placeholder={t('buyer.searchBuyersLocations')}
            className="flex-1 ml-3 text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          <View className="flex-row">
            <TouchableOpacity className="p-1 mr-2">
              <Mic size={20} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <SlidersHorizontal size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Real MapLibre Map */}
      <View className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg" style={{ height: 250 }}>
        <MapLibreView
          showFarmers={false}
          showBuyers={true}
          radiusInMeters={RADIUS_PRESETS.DEFAULT}
          onUserPress={(buyer) => {
            console.log('Selected buyer:', buyer.full_name);
            // Can navigate to buyer details here
          }}
        />
      </View>

      {/* Buyers List with Enhanced Design */}
      <View className="flex-1 px-4 mt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">{t('buyer.nearbyBuyersCount', { count: buyers.length })}</Text>
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-sm font-medium text-gray-700 mr-1">
              {t('buyer.sortByDistance')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="pb-4">
          {buyers.map((buyer) => (
            <View
              key={buyer.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
            >
              {/* Buyer Header */}
              <View className="flex-row items-center">
                <View className="relative">
                  <Image
                    source={{ uri: buyer.avatar }}
                    className="w-16 h-16 rounded-full"
                    resizeMode="cover"
                  />
                  {buyer.verified && (
                    <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                      <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  )}
                </View>
                
                <View className="flex-1 ml-4">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-bold text-gray-900">
                      {buyer.name}
                    </Text>
                    {buyer.verified && (
                      <View className="ml-2 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Text className="text-xs font-semibold text-emerald-700">{t('buyer.verified')}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-500 ml-1">
                      {buyer.location}
                    </Text>
                    <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                    <Text className="text-sm text-emerald-600 font-medium">
                      {buyer.distance}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <View className="flex-row items-center">
                      <Star size={14} color="#FBBF24" fill="#FBBF24" />
                      <Text className="text-sm font-semibold text-gray-900 ml-1">
                        {buyer.rating}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500 ml-2">
                      ({t('buyer.reviewsCount', { count: buyer.reviews })})
                    </Text>
                    <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                    <Text className="text-xs text-gray-500">
                      {t('buyer.active')} {buyer.lastActive}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row mt-4 gap-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-emerald-600 rounded-xl py-3.5 shadow-sm"
                  onPress={() => handleCall(buyer.name)}
                >
                  <Phone size={18} color="#FFFFFF" />
                  <Text className="text-white font-semibold ml-2">{t('common.call')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-emerald-50 rounded-xl py-3.5 shadow-sm"
                  onPress={() => handleMessage(buyer.name, buyer.id)}
                >
                  <MessageSquare size={18} color="#059669" />
                  <Text className="text-emerald-700 font-semibold ml-2">
                    {t('common.message')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}