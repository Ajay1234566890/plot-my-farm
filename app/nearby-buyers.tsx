import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import MapLibreView from "@/components/MapLibreView";
import { useAuth } from "@/contexts/auth-context";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import * as mapService from "@/services/map-service";
import { NearbyUser } from "@/services/map-service";
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
import React, { useEffect, useRef, useState } from "react";
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
  const [buyers, setBuyers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Voice input for search
  const { isRecording, toggleRecording } = useVoiceInput({
    onTranscript: (text) => setSearchText(text),
    language: user?.language || 'en'
  });

  // Scroll animation for map fade-out
  const scrollY = useRef(new Animated.Value(0)).current;
  const mapOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadNearbyBuyers();
  }, [user]);

  const loadNearbyBuyers = async () => {
    try {
      setLoading(true);
      // Default location if user location is not available (e.g., center of India)
      const defaultLocation = { latitude: 20.5937, longitude: 78.9629 };
      const userLocation = user?.user_metadata?.latitude && user?.user_metadata?.longitude
        ? { latitude: user.user_metadata.latitude, longitude: user.user_metadata.longitude }
        : defaultLocation;

      const nearbyBuyers = await mapService.fetchNearbyBuyers(userLocation, 50000); // 50km radius
      setBuyers(nearbyBuyers);
    } catch (error) {
      console.error('Error loading nearby buyers:', error);
      Alert.alert('Error', 'Failed to load nearby buyers');
    } finally {
      setLoading(false);
    }
  };

  // Handler functions for Call and Message
  const handleCall = (buyerName: string, phone?: string) => {
    const phoneNumber = phone || '+1234567890'; // Mock phone number if not available
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

  const handleMessage = (buyerName: string, buyerId: string, avatar: string) => {
    router.push({
      pathname: '/chat-screen',
      params: {
        userId: buyerId,
        userName: buyerName,
        userAvatar: avatar,
        userRole: 'buyer'
      }
    });
  };

  const handleSort = () => {
    setSortBy(prev => prev === 'distance' ? 'rating' : 'distance');
    // Implement actual sorting logic if needed, currently just toggling state
    // The mapService returns sorted by distance by default
  };

  const filteredBuyers = buyers.filter(buyer =>
    buyer.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    buyer.location?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header Section */}
      <View
        className="px-6 pt-12 pb-6"
        style={{
          backgroundColor: '#7C8B3A',
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

        {/* Search Bar - Matching buyer-home.tsx styling */}
        <View
          style={{
            backgroundColor: 'transparent',
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <Search size={18} color="#FFFFFF" />
          <TextInput
            placeholder={t('buyer.searchBuyersLocations')}
            placeholderTextColor="rgba(255, 255, 255, 0.9)"
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: 'white',
              backgroundColor: 'transparent'
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            className="p-1"
            onPress={toggleRecording}
          >
            <Mic
              size={18}
              color={isRecording ? '#EF4444' : '#FFFFFF'}
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
            <Text className="text-lg font-bold text-gray-900">{t('buyer.nearbyBuyersCount', { count: filteredBuyers.length })}</Text>
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
          {filteredBuyers.map((buyer) => (
            <View
              key={buyer.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
            >
              {/* Buyer Header */}
              <View className="flex-row items-center">
                <View className="relative">
                  <Image
                    source={{ uri: buyer.avatar_url || 'https://via.placeholder.com/150' }}
                    className="w-16 h-16 rounded-full"
                    resizeMode="cover"
                  />
                  {buyer.is_verified && (
                    <View className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                      <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  )}
                </View>

                <View className="flex-1 ml-4">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-bold text-gray-900">
                      {buyer.full_name || 'Unknown Buyer'}
                    </Text>
                    {buyer.is_verified && (
                      <View className="ml-2 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Text className="text-xs font-semibold text-emerald-700">{t('buyer.verified')}</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-500 ml-1">
                      {buyer.location || 'Unknown Location'}
                    </Text>
                    <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                    <Text className="text-sm text-emerald-600 font-medium">
                      {buyer.distanceFormatted}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-1 flex-wrap">
                    <View className="flex-row items-center">
                      <Star size={14} color="#FBBF24" fill="#FBBF24" />
                      <Text className="text-sm font-semibold text-gray-900 ml-1">
                        4.8
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500 ml-2">
                      ({t('buyer.reviewsCount', { count: 12 })})
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                      {t('buyer.active')} 2h ago
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons - Call, Message */}
              <View className="flex-row mt-4 gap-2">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-emerald-600 rounded-xl py-3 shadow-sm"
                  onPress={() => handleCall(buyer.full_name || 'Buyer')}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text className="text-white font-semibold ml-1.5 text-sm">{t('common.call')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-xl py-3 shadow-sm"
                  onPress={() => handleMessage(buyer.full_name || 'Buyer', buyer.id, buyer.avatar_url || '')}
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

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <FarmerBottomNav activeTab="home" />
      </View>
    </View>
  );
}
