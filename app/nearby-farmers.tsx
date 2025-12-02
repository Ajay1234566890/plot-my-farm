import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import MapLibreView from '@/components/MapLibreView';
import { useAuth } from '@/contexts/auth-context';
import { useRealtimeLocations } from '@/hooks/useRealtimeLocations';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { createOrGetChat } from '@/services/chat-service';
import { getUserLocation } from '@/services/realtime-map-service';
import { RADIUS_PRESETS } from '@/utils/haversine';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  MessageSquare,
  Mic,
  Phone,
  Search
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NearbyFarmers() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  // Voice input for search
  const { isRecording, toggleRecording } = useVoiceInput({
    onTranscript: (text) => setSearchText(text),
    language: user?.language || 'en',
  });

  // Scroll animation for map fade-out
  const scrollY = useRef(new Animated.Value(0)).current;

  // Get real-time nearby farmers
  const { nearbyUsers: farmers, loading, refresh } = useRealtimeLocations(currentLocation);

  // Get user location
  useEffect(() => {
    const fetchLocation = async () => {
      if (user?.id) {
        const { data } = await getUserLocation(user.id);
        if (data) {
          setCurrentLocation(data);
        }
      }
    };
    fetchLocation();
  }, [user?.id]);

  // Handle call
  const handleCall = (farmerName: string, phone?: string) => {
    if (!phone) {
      Alert.alert(t('common.error'), t('chatScreen.phoneNotAvailable'));
      return;
    }

    Alert.alert(t('common.call'), `${t('common.calling')} ${farmerName}`, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.call'),
        onPress: () => Linking.openURL(`tel:${phone}`),
      },
    ]);
  };

  // Handle message
  const handleMessage = async (farmer: any) => {
    if (!user?.id) return;

    try {
      // Create or get chat
      const { data: chat } = await createOrGetChat(farmer.id, user.id);

      if (chat) {
        router.push({
          pathname: '/buyer-chat-screen',
          params: {
            chatId: chat.id,
            userId: farmer.id,
            userName: farmer.name,
            userAvatar: farmer.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg',
            userRole: 'farmer',
          },
        });
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert(t('common.error'), 'Failed to open chat');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter farmers by search
  const filteredFarmers = farmers.filter((farmer) => {
    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase();
    return farmer.name.toLowerCase().includes(query);
  });

  // Map fade animation
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
          backgroundColor: '#B27E4C',
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
          <Text className="text-xl font-bold text-white">{t('buyerHome.nearbyFarmers')}</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#4B5563" />
          <TextInput
            placeholder={t('farmerHome.searchFarmersLocations')}
            className="flex-1 ml-3 text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity className="p-1" onPress={toggleRecording}>
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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Map Section */}
        <Animated.View
          style={{
            marginTop: 16,
            marginHorizontal: 16,
            height: 200,
            borderRadius: 16,
            overflow: 'hidden',
            opacity: mapOpacity,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
            showFarmers={true}
            showBuyers={false}
            radiusInMeters={RADIUS_PRESETS.DEFAULT}
            onUserPress={(farmer) => {
              console.log('Selected farmer:', farmer.name);
            }}
          />
        </Animated.View>

        {/* Farmers List Section */}
        <View className="px-4 mt-3">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              {t('farmerHome.nearbyFarmersCount', { count: filteredFarmers.length })}
            </Text>
            {loading && <ActivityIndicator size="small" color="#B27E4C" />}
          </View>

          {/* Farmers Cards */}
          {loading && filteredFarmers.length === 0 ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color="#B27E4C" />
              <Text className="text-gray-500 mt-4">Loading nearby farmers...</Text>
            </View>
          ) : filteredFarmers.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500 text-center">
                {searchText ? t('messages.noResults') : 'No nearby farmers found'}
              </Text>
            </View>
          ) : (
            filteredFarmers.map((farmer) => (
              <View
                key={farmer.id}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                {/* Farmer Header */}
                <View className="flex-row items-center">
                  <View className="relative">
                    <Image
                      source={{
                        uri: farmer.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg',
                      }}
                      className="w-16 h-16 rounded-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-bold text-gray-900">{farmer.name}</Text>

                    <View className="flex-row items-center mt-1">
                      <MapPin size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-500 ml-1">{farmer.role}</Text>
                      {farmer.distance !== undefined && (
                        <>
                          <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                          <Text className="text-sm text-emerald-600 font-medium">
                            {farmer.distance.toFixed(1)}km
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row mt-4 gap-2">
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center bg-emerald-600 rounded-xl py-3 shadow-sm"
                    onPress={() => handleCall(farmer.name, farmer.phone)}
                  >
                    <Phone size={16} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-1.5 text-sm">
                      {t('common.call')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-xl py-3 shadow-sm"
                    onPress={() => handleMessage(farmer)}
                  >
                    <MessageSquare size={16} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-1.5 text-sm">
                      {t('common.message')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="home" />
      </View>
    </View>
  );
}