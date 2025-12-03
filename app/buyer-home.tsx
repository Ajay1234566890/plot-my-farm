import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import BuyerBottomNav from "@/app/components/BuyerBottomNav";
import { HomePageErrorBoundary } from "@/components/HomePageErrorBoundary";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";
import MapLibreView from "@/components/MapLibreView";
import { useAuth } from '@/contexts/auth-context';
import { Farmer, farmerService } from '@/services/farmer-service';
import { MarketPrice, marketPricesService } from '@/services/market-prices-service';
import { RADIUS_PRESETS } from "@/utils/haversine";
import { useRouter } from 'expo-router';
import {
  Bell,
  DollarSign,
  Heart,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  TrendingUp
} from 'lucide-react-native';

const screenWidth = Dimensions.get("window").width;

export default function BuyerHome() {
  const { t } = useTranslation();
  return (
    <HomePageErrorBoundary
      fallbackTitle={t('errors.buyerHomeUnavailable')}
      fallbackMessage={t('errors.buyerHomeLoadError')}
    >
      <BuyerHomeContent />
    </HomePageErrorBoundary>
  );
}

enum Tab {
  NearbyCrops,
  NearbyFarmers,
}

function BuyerHomeContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.NearbyCrops);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [nearbyFarmers, setNearbyFarmers] = useState<Farmer[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  // Scroll animation for glass card fade effect (matching Farmer Dashboard)
  const scrollY = useRef(new Animated.Value(0)).current;

  // Log component mount for debugging
  useEffect(() => {
    console.log('🏠 [BUYER-HOME] Component mounted');
    console.log('🏠 [BUYER-HOME] User:', {
      hasUser: !!user,
      userRole: user?.role,
      userName: user?.name
    });
  }, []);

  // Fetch real market prices on mount
  useEffect(() => {
    loadMarketPrices();
    loadNearbyFarmers();
  }, []);

  const loadMarketPrices = async () => {
    try {
      setLoadingPrices(true);
      const prices = await marketPricesService.getMarketPricesWithLocation(3);
      setMarketPrices(prices);
    } catch (error) {
      console.error('Error loading market prices:', error);
    } finally {
      setLoadingPrices(false);
    }
  };

  const loadNearbyFarmers = async () => {
    try {
      setLoadingFarmers(true);
      const farmers = await farmerService.getNearbyFarmers();
      setNearbyFarmers(farmers);
    } catch (error) {
      console.error('Error loading nearby farmers:', error);
    } finally {
      setLoadingFarmers(false);
    }
  };

  const mockNearbyFarmers = [
    {
      id: 1,
      name: "John's Farm",
      distance: "2.5km",
      image:
        "https://images.unsplash.com/photo-1597591073752-bc931222ff0d?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Green Valley",
      distance: "3.8km",
      image:
        "https://images.unsplash.com/photo-1597591073752-bc931222ff0d?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Fresh Fields",
      distance: "4.2km",
      image:
        "https://images.unsplash.com/photo-1597591073752-bc931222ff0d?w=900&auto=format&fit=crop&q=60",
    },
  ];

  // Quick actions data for buyers
  const quickActions = [
    {
      icon: <TrendingUp size={24} color="#4B5563" />,
      label: t('navigation.market'),
      route: "/buyer-market-prices" as const,
    },
    {
      icon: <ShoppingCart size={24} color="#4B5563" />,
      label: t('buyerHome.myCart'),
      route: "/cart" as const,
    },
    {
      icon: <Package size={24} color="#4B5563" />,
      label: t('buyerHome.orders'),
      route: "/my-orders" as const,
    },
    {
      icon: <DollarSign size={24} color="#4B5563" />,
      label: t('buyerHome.offers'),
      route: "/buyer-offers" as const,
    },
  ];

  const cropsPreview = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Green Farm",
      price: "₹200/kg",
      image: require('@/assets/images/crops/green_chilli.jpg'),
    },
    {
      id: 2,
      name: "Fresh Corn",
      farmer: "Valley Farms",
      price: "₹230/kg",
      image: require('@/assets/images/crops/wheat.jpg'),
    },
    {
      id: 3,
      name: "Carrots",
      farmer: "Farm Fresh",
      price: "₹145/kg",
      image: require('@/assets/images/crops/coriander_leaves.jpg'),
    },
    {
      id: 4,
      name: "Bell Peppers",
      farmer: "Organic Valley",
      price: "₹275/kg",
      image: require('@/assets/images/crops/peas.jpg'),
    },
  ];

  // Wishlist toggle handler
  const toggleWishlist = (cropId: number) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(cropId)) {
        newWishlist.delete(cropId);
        Alert.alert(t('common.success'), t('buyerHome.removedFromWishlist'));
      } else {
        newWishlist.add(cropId);
        Alert.alert(t('common.success'), t('buyerHome.addedToWishlist'));
      }
      return newWishlist;
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Compact Header Section */}
      <View className="relative">
        <View
          className="px-5 pt-10 pb-6"
          style={{
            backgroundColor: '#B27E4C', // Buyer primary color (brown/copper)
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          {/* Header Content - Personalized Greeting with Avatar */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              {/* Buyer Avatar + Personalized Greeting */}
              <View className="flex-row items-center mb-1">
                <TouchableOpacity
                  onPress={() => router.push('/buyer-profile')}
                  className="w-10 h-10 rounded-full bg-white/20 overflow-hidden border-2 border-white/30 mr-2"
                >
                  <Image
                    source={{
                      uri: user?.profileImage || "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-white text-base font-bold">
                    {t('buyerHome.hello')}, {user?.name || t('buyerHome.buyer')}
                  </Text>
                  {/* Date - Aligned with greeting text */}
                  <Text className="text-white/70 text-xs mt-0.5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </Text>
                </View>
              </View>
            </View>
            {/* Notification Bell - Matching Farmer Dashboard */}
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
            >
              <Bell size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Matching Farmer Home layout with Buyer colors */}
          <View className="mt-2">
            <View
              style={{
                backgroundColor: 'transparent', // Transparent to match top section
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
                placeholder={t('buyerHome.searchForCrops')}
                placeholderTextColor="rgba(255, 255, 255, 0.9)"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 14,
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
              />
              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => router.push('/nearby-farmers')}
              >
                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
          paddingTop: 20,
          paddingBottom: 100, // Fixed padding for bottom navigation
        }}
      >
        {/* Map Card - Glass Card with Fade Effect (Matching Farmer Dashboard) */}
        <View className="px-5 mb-6">
          <Animated.View
            className="rounded-3xl overflow-hidden"
            style={{
              height: 280,
              backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glass effect
              shadowColor: '#B27E4C',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 10,
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
            <MapErrorBoundary fallbackMessage={t('errors.mapUnavailable')}>
              <MapLibreView
                showFarmers={true}
                showBuyers={true}
                radiusInMeters={RADIUS_PRESETS.DEFAULT}
                onUserPress={(user) => {
                  if (user.role === 'farmer') {
                    router.push({
                      pathname: "/nearby-farmers",
                      params: { selectedFarmerId: user.id }
                    });
                  }
                  if (user.role === 'buyer') {
                    router.push({
                      pathname: "/nearby-buyers",
                      params: { selectedBuyerId: user.id }
                    });
                  }
                }}
              />
            </MapErrorBoundary>

            {/* Floating Buttons on Map */}
            <View
              className="absolute top-4 left-4 right-4 flex-row justify-between"
              style={{ gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => router.push("/nearby-farmers")}
                className="px-4 py-2 rounded-full flex-row items-center"
                style={{
                  backgroundColor: 'rgba(178, 126, 76, 0.9)', // Semi-transparent brown
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

              <TouchableOpacity
                onPress={() => router.push("/nearby-buyers")}
                className="px-4 py-2 rounded-full flex-row items-center"
                style={{
                  backgroundColor: 'rgba(178, 126, 76, 0.9)', // Semi-transparent brown
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
            </View>
          </Animated.View>
        </View>

        {/* Featured Crops Section - Redesigned with buyer color scheme */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              {t('buyerHome.featuredCrops')}
            </Text>
            <TouchableOpacity
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#B27E4C' }}
              onPress={() => router.push('/nearby-crops')}
            >
              <Text className="text-sm font-semibold text-white">
                {t('common.viewAll')}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
          >
            {cropsPreview.map((crop) => (
              <TouchableOpacity
                key={crop.id}
                className="mr-4 bg-white rounded-3xl p-4 shadow-lg"
                style={{
                  width: screenWidth * 0.45,
                  shadowColor: '#B27E4C',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: '#B27E4C20'
                }}
              >
                <View className="relative">
                  <Image
                    source={crop.image}
                    className="w-full h-32 rounded-2xl mb-3"
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                    onPress={() => toggleWishlist(crop.id)}
                  >
                    <Heart
                      size={16}
                      color="#B27E4C"
                      fill={wishlist.has(crop.id) ? "#B27E4C" : "white"}
                    />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-800 font-bold text-base mb-1">{crop.name}</Text>
                <Text className="text-gray-500 text-sm mb-2">{crop.farmer}</Text>
                <Text className="font-bold text-lg" style={{ color: '#B27E4C' }}>
                  {crop.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions - Redesigned with buyer color scheme */}
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
                    shadowColor: '#B27E4C',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 8,
                    borderWidth: 1,
                    borderColor: '#B27E4C10'
                  }}
                >
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: '#B27E4C' }}
                  >
                    {React.cloneElement(action.icon, { color: '#FFFFFF', size: 26 })}
                  </View>
                  <Text className="text-gray-800 text-sm font-semibold text-center leading-tight">
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Market Prices - Matching Farmer Dashboard horizontal scroll design */}
        <View className="mb-6" style={{ marginTop: 0 }}>
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              {t('market.marketPrices')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/buyer-market-prices")}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#B27E4C' }}
            >
              <Text className="text-sm font-semibold text-white">
                {t('common.viewAll')}
              </Text>
            </TouchableOpacity>
          </View>
          {loadingPrices ? (
            <View className="px-6 py-8 items-center">
              <ActivityIndicator size="small" color="#B27E4C" />
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
                  onPress={() => router.push("/buyer-market-prices")}
                  className="mr-4 bg-white rounded-3xl p-5 items-center shadow-lg"
                  style={{
                    width: screenWidth * 0.32,
                    shadowColor: '#B27E4C',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: '#B27E4C20'
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
                  <Text className="text-lg font-bold mt-2" style={{ color: '#B27E4C' }}>
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

        {/* Nearby Crops and Farmers Tabs */}
        <View className="px-6 mb-8">
          <View className="flex-row mb-4 gap-2">
            <TouchableOpacity
              onPress={() => setActiveTab(Tab.NearbyCrops)}
              className={`px-6 py-3 rounded-full ${activeTab === Tab.NearbyCrops
                ? "shadow-lg"
                : ""
                }`}
              style={{
                backgroundColor: activeTab === Tab.NearbyCrops ? '#B27E4C' : '#B27E4C20',
              }}
            >
              <Text
                className={`font-semibold ${activeTab === Tab.NearbyCrops
                  ? "text-white"
                  : "text-gray-700"
                  }`}
              >
                {t('buyerHome.nearbyCrops')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab(Tab.NearbyFarmers)}
              className={`px-6 py-3 rounded-full ${activeTab === Tab.NearbyFarmers
                ? "shadow-lg"
                : ""
                }`}
              style={{
                backgroundColor: activeTab === Tab.NearbyFarmers ? '#B27E4C' : '#B27E4C20',
              }}
            >
              <Text
                className={`font-semibold ${activeTab === Tab.NearbyFarmers
                  ? "text-white"
                  : "text-gray-700"
                  }`}
              >
                {t('buyerHome.nearbyFarmers')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === Tab.NearbyCrops ? (
            <View className="gap-4">
              {cropsPreview.slice(0, 2).map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  className="bg-white rounded-2xl p-4 flex-row items-center shadow-lg"
                  style={{
                    shadowColor: '#B27E4C',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: '#B27E4C10'
                  }}
                >
                  <Image
                    source={crop.image}
                    className="w-16 h-16 rounded-2xl mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{crop.name}</Text>
                    <Text className="text-gray-500 text-sm">{crop.farmer}</Text>
                    <Text className="font-bold text-lg mt-1" style={{ color: '#B27E4C' }}>
                      {crop.price}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => toggleWishlist(crop.id)}
                  >
                    <Heart
                      size={20}
                      color="#B27E4C"
                      fill={wishlist.has(crop.id) ? "#B27E4C" : "white"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="gap-4">
              {loadingFarmers ? (
                <ActivityIndicator size="small" color="#B27E4C" />
              ) : (
                nearbyFarmers.map((farmer) => (
                  <TouchableOpacity
                    key={farmer.id}
                    className="bg-white rounded-2xl p-4 flex-row items-center shadow-lg"
                    style={{
                      shadowColor: '#B27E4C',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 6,
                      borderWidth: 1,
                      borderColor: '#B27E4C10'
                    }}
                  >
                    <Image
                      source={{ uri: farmer.image }}
                      className="w-16 h-16 rounded-2xl mr-4"
                    />
                    <View className="flex-1">
                      <Text className="text-gray-800 font-bold text-base">{farmer.name}</Text>
                      <Text className="text-gray-500 text-sm">{farmer.distance} {t('buyerHome.away')}</Text>
                    </View>
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => router.push('/nearby-farmers')}
                    >
                      <MapPin size={20} color="#B27E4C" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="home" />
      </View>
    </View>
  );
}