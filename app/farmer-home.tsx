import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { HomePageErrorBoundary } from "@/components/HomePageErrorBoundary";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";
import MapLibreView from "@/components/MapLibreView";
import { useAuth } from "@/contexts/auth-context";
import { MarketPrice, marketPricesService } from '@/services/market-prices-service';
import { RADIUS_PRESETS } from "@/utils/haversine";
import { useRouter } from "expo-router";
import {
    Bell,
    CloudSun,
    MapPin,
    MessageCircle,
    Mic,
    Plus,
    Search,
    Tag,
    TrendingUp,
    User
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function FarmerHome() {
  const { t } = useTranslation();

  return (
    <HomePageErrorBoundary
      fallbackTitle={t('errors.farmerHomeUnavailable')}
      fallbackMessage={t('errors.farmerHomeLoadError')}
    >
      <FarmerHomeContent />
    </HomePageErrorBoundary>
  );
}

function FarmerHomeContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Scroll animation for glass card fade effect
  const scrollY = useRef(new Animated.Value(0)).current;

  // Format date with i18n
  const getFormattedDate = () => {
    const date = new Date();
    const weekdayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    const monthKey = ['january', 'february', 'march', 'april', 'mayFull', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${t(`common.${weekdayKey}`)}, ${day} ${t(`common.${monthKey}`)} ${year}`;
  };

  // Fetch real market prices on mount
  useEffect(() => {
    loadMarketPrices();
  }, []);

  const loadMarketPrices = async () => {
    try {
      setLoadingPrices(true);
      const prices = await marketPricesService.getMarketPricesWithLocation(5);
      setMarketPrices(prices);
    } catch (error) {
      console.error('Error loading market prices:', error);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Mock data for recommended buyers (restored from original)
  const recommendedBuyers = [
    {
      name: t('farmerHome.buyerName1'),
      location: t('farmerHome.buyerLocation1'),
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: t('farmerHome.buyerName2'),
      location: t('farmerHome.buyerLocation2'),
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    },
  ];

  // Quick actions data (your original functionality - made visually beautiful)
  const quickActions = [
    {
      icon: <CloudSun size={24} color="#4B5563" />,
      label: t('farmerHome.weather'),
      route: "/farmer-weather" as const,
    },
    {
      icon: <TrendingUp size={24} color="#4B5563" />,
      label: t('navigation.market'),
      route: "/market-real-prices" as const,
    },
    {
      icon: <Tag size={24} color="#4B5563" />,
      label: t('farmerHome.myOffers'),
      route: "/farmer-offers" as const,
    },
    {
      icon: <MapPin size={24} color="#4B5563" />,
      label: t('farmerHome.nearby'),
      route: "/nearby-buyers" as const,
    },
  ];



  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Compact Header Section - Absolutely positioned to allow content to scroll behind */}
      <View
        className="absolute top-0 left-0 right-0"
        style={{
          zIndex: 20,
          paddingBottom: 100
        }}
      >
        <View
          className="px-5 pt-10 pb-20"
          style={{
            backgroundColor: '#7C8B3A', // Olive/army green matching reference image
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          {/* Header Content - Personalized Greeting with Profile Icon */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              {/* Profile Icon */}
              <TouchableOpacity
                onPress={() => router.push("/profile")}
                className="mr-3"
              >
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center overflow-hidden border-2 border-white/30">
                  {user?.profileImage ? (
                    <Image
                      source={{ uri: user.profileImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={24} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Greeting Text */}
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  {t('farmerHome.hello')}, <Text className="font-extrabold">{user?.name || t('farmerHome.farmer')}</Text>
                </Text>
                <Text className="text-white/70 text-xs mt-0.5">
                  {getFormattedDate()} ▼
                </Text>
              </View>
            </View>

            {/* Notification Icon */}
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Bell size={18} color="#7C8B3A" />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Matching reference design */}
          <View className="mt-2 mb-4">
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)', // Semi-transparent white
                borderRadius: 25,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Search size={20} color="rgba(255, 255, 255, 0.9)" />
              <TextInput
                placeholder="Search here..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 15,
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
              />
              <TouchableOpacity style={{ padding: 4 }}>
                <Mic size={18} color="rgba(255, 255, 255, 0.9)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Map Card - Floating/Overlapping Effect with Fade Animation */}
        <Animated.View
          className="absolute px-5"
          style={{
            top: 195, // Position to overlap the green section with spacing from search bar
            left: 0,
            right: 0,
            zIndex: 10,
            opacity: scrollY.interpolate({
              inputRange: [0, 150],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 150],
                outputRange: [0, -30],
                extrapolate: 'clamp',
              }),
            }],
          }}
        >
          <View
            className="bg-white rounded-3xl overflow-hidden"
            style={{
              height: 260,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            {/* Map Component */}
            <MapErrorBoundary fallbackMessage={t('errors.mapUnavailable')}>
              <MapLibreView
                showFarmers={true}
                showBuyers={true}
                radiusInMeters={RADIUS_PRESETS.DEFAULT}
                onUserPress={(user) => {
                  if (user.role === 'buyer') {
                    router.push({
                      pathname: "/nearby-buyers",
                      params: { selectedBuyerId: user.id }
                    });
                  } else {
                    router.push({
                      pathname: "/nearby-farmers",
                      params: { selectedFarmerId: user.id }
                    });
                  }
                }}
              />
            </MapErrorBoundary>

            {/* Floating Buttons on Map - Top */}
            <View
              className="absolute top-4 left-4 right-4 flex-row justify-between"
              style={{ gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => router.push("/nearby-buyers")}
                className="px-4 py-2 rounded-full flex-row items-center"
                style={{
                  backgroundColor: 'rgba(124, 139, 58, 0.95)', // Semi-transparent olive green
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Text className="text-xs font-semibold text-white">
                  {t('farmerHome.nearbyBuyers')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/nearby-farmers")}
                className="px-4 py-2 rounded-full flex-row items-center"
                style={{
                  backgroundColor: 'rgba(124, 139, 58, 0.95)', // Semi-transparent olive green
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Text className="text-xs font-semibold text-white">
                  {t('farmerHome.nearbyFarmers')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.ScrollView
        className="flex-1 pb-24"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          paddingTop: 475, // Map card top position (195) + map card height (260) + spacing (20) = 475
          paddingBottom: 100, // Fixed padding for bottom navigation
        }}
      >

        {/* Market Prices - Redesigned with olive green accent */}
        <View className="mb-6" style={{ marginTop: 0 }}>
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              {t('market.marketPrices')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/market-real-prices")}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#7C8B3A' }}
            >
              <Text className="text-sm font-semibold text-white">
                {t('common.viewAll')}
              </Text>
            </TouchableOpacity>
          </View>
          {loadingPrices ? (
            <View className="px-6 py-8 items-center">
              <ActivityIndicator size="small" color="#7C8B3A" />
              <Text className="text-gray-500 text-sm mt-2">{t('common.loadingPrices')}</Text>
            </View>
          ) : marketPrices.length === 0 ? (
            <View className="px-6 py-8 items-center">
              <Text className="text-gray-500 text-sm">{t('market.noPricesAvailable')}</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6"
            >
              {marketPrices.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push("/market-real-prices")}
                  className="mr-4 bg-white rounded-3xl p-5 items-center shadow-lg"
                  style={{
                    width: screenWidth * 0.32,
                    shadowColor: '#7C8B3A',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: '#7C8B3A20'
                  }}
                >
                  <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    className="w-14 h-14 rounded-2xl mb-3"
                    style={{ resizeMode: 'cover' }}
                  />
                  <Text className="text-sm font-bold text-gray-800 text-center" numberOfLines={1}>
                    {item.commodity}
                  </Text>
                  <Text className="text-lg font-bold mt-2" style={{ color: '#7C8B3A' }}>
                    ₹{item.modalPrice}/{item.unit}
                  </Text>
                  {item.trend && (
                    <View
                      className={`px-2 py-1 rounded-full mt-2 ${item.trend === 'up' ? "bg-emerald-50" : item.trend === 'down' ? "bg-rose-50" : "bg-gray-50"}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${item.trend === 'up' ? "text-emerald-600" : item.trend === 'down' ? "text-rose-600" : "text-gray-600"}`}
                      >
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>



        {/* Quick Actions - Redesigned with sophisticated olive green theme */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-5">{t('farmerHome.quickActions')}</Text>
          <View className="flex-row justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(action.route)}
                className="flex-1 mx-1"
                activeOpacity={0.8}
              >
                <View
                  className="bg-white rounded-3xl p-5 items-center shadow-lg"
                  style={{
                    shadowColor: '#7C8B3A',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 8,
                    borderWidth: 1,
                    borderColor: '#7C8B3A10'
                  }}
                >
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: '#7C8B3A' }}
                  >
                    <View style={{ transform: [{ scale: 1.1 }] }}>
                      {React.cloneElement(action.icon, { color: '#FFFFFF', size: 26 })}
                    </View>
                  </View>
                  <Text
                    className="text-gray-800 font-semibold text-center"
                    numberOfLines={1}
                    style={{ fontSize: 11, lineHeight: 14 }}
                  >
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Crops - Restored from original */}
        <TouchableOpacity
          onPress={() => router.push("/edit-crop")}
          className="mx-6 mb-6"
        >
          <View
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: '#10b981', // Emerald green
              shadowColor: '#10b981',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Plus size={24} color="#FFFFFF" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-white">
                {t('farmerHome.addNewCrop')}
              </Text>
              <Text className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {t('farmerHome.getInstantQuotes')}
              </Text>
            </View>
            <Text className="text-sm font-bold text-white">{t('common.add')}</Text>
          </View>
        </TouchableOpacity>

        {/* Recommended Buyers - Restored from original */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t('farmerHome.recommendedBuyers')}
          </Text>
          {recommendedBuyers.map((buyer, index) => (
            <View
              key={index}
              className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow shadow-gray-200"
            >
              <Image
                source={{ uri: buyer.avatar }}
                className="w-12 h-12 rounded-full"
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-gray-800">
                  {buyer.name}
                </Text>
                <Text className="text-sm text-gray-500">{buyer.location}</Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => router.push("/nearby-buyers")}
                  className="p-2 bg-emerald-100 rounded-full"
                >
                  <MapPin size={20} color="#059669" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/chat-screen")}
                  className="p-2 bg-blue-100 rounded-full"
                >
                  <MessageCircle size={20} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* My Fields Section - Styled like reference image */}
        <View className="px-6" style={{ marginBottom: 20 }}>
          <Text className="text-gray-800 text-lg font-bold mb-4">{t('farmerHome.myFields')}</Text>
          <TouchableOpacity
            onPress={() => router.push("/my-farms")}
            className="relative"
          >
            <View className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFybSUyMGZpZWxkfGVufDB8fDB8fHww"
                }}
                className="w-full h-48"
                resizeMode="cover"
              />
              {/* Overlay content */}
              <View className="absolute inset-0 bg-black/20 rounded-3xl" />
              <View className="absolute bottom-4 left-4 right-4">
                <View className="bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                  <Text className="text-gray-800 text-base font-semibold">
                    {t('farmerHome.organicVegetableFarm')}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {t('farmerHome.farmDetails')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <FarmerBottomNav activeTab="home" />
      </View>
    </View>
  );
}
