import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
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
import { MarketPrice, marketPricesService } from '@/services/market-prices-service';
import { RADIUS_PRESETS } from "@/utils/haversine";
import { useRouter } from 'expo-router';
import {
    Bell,
    DollarSign,
    Heart,
    MapPin,
    MessageSquare,
    Package,
    Search,
    ShoppingCart,
    TrendingUp
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

function BuyerHomeContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(t('buyerHome.nearbyCrops'));
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Fetch real market prices on mount
  useEffect(() => {
    loadMarketPrices();
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
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Fresh Corn",
      farmer: "Valley Farms",
      price: "₹230/kg",
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Carrots",
      farmer: "Farm Fresh",
      price: "₹145/kg",
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      name: "Bell Peppers",
      farmer: "Organic Valley",
      price: "₹275/kg",
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    },
  ];

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
                <View className="w-10 h-10 rounded-full bg-white/20 overflow-hidden border-2 border-white/30 mr-2">
                  <Image
                    source={{
                      uri: user?.profileImage || "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
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
            {/* Top Icons - Compact */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => router.push("/wishlist")}
                className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
              >
                <Heart size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
              >
                <Bell size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/messages")}
                className="w-9 h-9 rounded-full bg-white/20 items-center justify-center"
              >
                <MessageSquare size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar - Compact version */}
          <View className="mt-2">
            <View
              className="flex-row items-center rounded-2xl px-3 py-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent white
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Search size={18} color="rgba(255, 255, 255, 0.8)" />
              <TextInput
                placeholder={t('buyerHome.searchForCrops')}
                className="flex-1 ml-2 text-sm text-gray-900"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                style={{ color: 'white' }}
              />
              <TouchableOpacity className="p-1">
                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 pb-24"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 20, // Reduced padding since map is now in scroll
        }}
      >
        {/* Map Section - Now inside ScrollView for smooth scrolling */}
        <View className="px-5 mb-4">
          <View
            className="rounded-3xl overflow-hidden"
            style={{
              height: 280,
              shadowColor: '#B27E4C',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 10,
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
                  } else {
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
          </View>
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
                  width: SCREEN_WIDTH * 0.45,
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
                    source={{ uri: crop.image }}
                    className="w-full h-32 rounded-2xl mb-3"
                  />
                  <TouchableOpacity className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                    <Heart size={16} color="#B27E4C" fill="white" />
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
                    <View style={{ transform: [{ scale: 1.1 }] }}>
                      {React.cloneElement(action.icon, { color: '#FFFFFF', size: 26 })}
                    </View>
                  </View>
                  <Text className="text-gray-800 text-sm font-semibold text-center leading-tight">
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Market Real Prices - Redesigned with buyer color scheme */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">{t('buyerHome.marketRealPrices')}</Text>
            <TouchableOpacity
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#B27E4C' }}
              onPress={() => router.push("/buyer-market-prices")}
            >
              <Text className="text-sm font-semibold text-white">{t('buyerHome.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {loadingPrices ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" color="#B27E4C" />
              <Text className="text-gray-500 text-sm mt-2">{t('common.loadingPrices')}</Text>
            </View>
          ) : marketPrices.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-sm">{t('market.noPricesAvailable')}</Text>
            </View>
          ) : (
            <View className="gap-4">
              {marketPrices.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
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
                  onPress={() => router.push("/buyer-market-prices")}
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{item.commodity}</Text>
                    {item.variety && (
                      <Text className="text-gray-400 text-xs">{item.variety}</Text>
                    )}
                    <Text className="text-gray-600 text-sm">₹{item.modalPrice}/{item.unit}</Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={10} color="#6B7280" />
                      <Text className="text-gray-400 text-xs ml-1">{item.market}, {item.state}</Text>
                    </View>
                  </View>
                  {item.trend && (
                    <Text
                      className={
                        item.trend === 'up'
                          ? "text-green-600 font-bold"
                          : item.trend === 'down'
                          ? "text-red-600 font-bold"
                          : "text-gray-600 font-bold"
                      }
                    >
                      {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Nearby Crops and Farmers Tabs */}
        <View className="px-6 mb-8">
          <View className="flex-row mb-4 gap-2">
            <TouchableOpacity
              onPress={() => setActiveTab(t('buyerHome.nearbyCrops'))}
              className={`px-6 py-3 rounded-full ${
                activeTab === t('buyerHome.nearbyCrops')
                  ? "shadow-lg"
                  : ""
              }`}
              style={{
                backgroundColor: activeTab === t('buyerHome.nearbyCrops') ? '#B27E4C' : '#B27E4C20',
              }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === t('buyerHome.nearbyCrops')
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {t('buyerHome.nearbyCrops')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab(t('buyerHome.nearbyFarmers'))}
              className={`px-6 py-3 rounded-full ${
                activeTab === t('buyerHome.nearbyFarmers')
                  ? "shadow-lg"
                  : ""
              }`}
              style={{
                backgroundColor: activeTab === t('buyerHome.nearbyFarmers') ? '#B27E4C' : '#B27E4C20',
              }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === t('buyerHome.nearbyFarmers')
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {t('buyerHome.nearbyFarmers')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === t('buyerHome.nearbyCrops') ? (
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
                    source={{ uri: crop.image }}
                    className="w-16 h-16 rounded-2xl mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{crop.name}</Text>
                    <Text className="text-gray-500 text-sm">{crop.farmer}</Text>
                    <Text className="font-bold text-lg mt-1" style={{ color: '#B27E4C' }}>
                      {crop.price}
                    </Text>
                  </View>
                  <TouchableOpacity className="p-2">
                    <Heart size={20} color="#B27E4C" fill="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="gap-4">
              {mockNearbyFarmers.map((farmer) => (
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
                  <TouchableOpacity className="p-2">
                    <MapPin size={20} color="#B27E4C" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="home" />
      </View>
    </View>
  );
}