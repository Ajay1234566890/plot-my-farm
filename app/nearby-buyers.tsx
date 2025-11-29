import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import MapLibreView from "@/components/MapLibreView";
import { useAuth } from "@/contexts/auth-context";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { RADIUS_PRESETS } from "@/utils/haversine";
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  MessageSquare,
  Mic,
  Phone,
  Search,
  Star
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function NearbyBuyers() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  // Voice input for search
  const { isRecording, toggleRecording } = useVoiceInput({
    onTranscript: (text) => setSearchText(text),
    language: user?.language || 'en'
  });

  // Scroll animation for map fade-out
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // Handle sort toggle
  const handleSort = () => {
    setSortBy(prev => prev === 'distance' ? 'rating' : 'distance');
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

  // Map fade animation - Only opacity changes
  const mapOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header Section */}
      <View
        className="px-6 pt-8 pb-6"
        style={{
          backgroundColor: '#7C8B3A', // Olive/army green matching farmer theme
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          zIndex: 10,
        }}
      >
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('buyer.nearbyBuyers')}</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#4B5563" />
          <TextInput
            placeholder={t('buyer.searchBuyersLocations')}
            className="flex-1 ml-3 text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            className="p-1"
            onPress={toggleRecording}
          >
            <Mic
              size={20}
              color={isRecording ? '#EF4444' : '#4B5563'}
              fill={isRecording ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Map Section - Glass Card Design */}
        <Animated.View
          style={{
            marginTop: 16,
            marginHorizontal: 16,
            height: 200,
            borderRadius: 16,
            overflow: 'hidden',
            opacity: mapOpacity,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glass effect
            // Note: backdropFilter is not supported in React Native directly, 
            // but we simulate glass with transparency and blur if possible or just transparency
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <MapLibreView
            showFarmers={false}
            showBuyers={true}
            radiusInMeters={RADIUS_PRESETS.DEFAULT}
            onUserPress={(buyer) => {
              console.log('Selected buyer:', buyer.full_name);
            }}
          />
        </Animated.View>

        {/* Buyers List Section */}
        <View className="px-4 mt-3">
          {/* Sort Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">{t('buyer.nearbyBuyersCount', { count: buyers.length })}</Text>
            <TouchableOpacity
              className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full"
              onPress={handleSort}
            >
              <Text className="text-sm font-medium text-gray-700 mr-1">
                {sortBy === 'distance' ? t('buyer.sortByDistance') : t('buyer.sortByRating')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Buyers Cards */}
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

                  <View className="flex-row items-center mt-1 flex-wrap">
                    <View className="flex-row items-center">
                      <Star size={14} color="#FBBF24" fill="#FBBF24" />
                      <Text className="text-sm font-semibold text-gray-900 ml-1">
                        {buyer.rating}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500 ml-2">
                      ({t('buyer.reviewsCount', { count: buyer.reviews })})
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                      {t('buyer.active')} {buyer.lastActive}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons - Call, Message (Video removed) */}
              <View className="flex-row mt-4 gap-2">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-emerald-600 rounded-xl py-3 shadow-sm"
                  onPress={() => handleCall(buyer.name)}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text className="text-white font-semibold ml-1.5 text-sm">{t('common.call')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-xl py-3 shadow-sm"
                  onPress={() => handleMessage(buyer.name, buyer.id)}
                >
                  <MessageSquare size={16} color="#FFFFFF" />
                  <Text className="text-white font-semibold ml-1.5 text-sm">
                    {t('common.message')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Bottom Navigation - Using FarmerBottomNav for Green/Black theme */}
      <View className="absolute bottom-0 left-0 right-0">
        <FarmerBottomNav activeTab="home" />
      </View>
    </View>
  );
}