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
  DollarSign,
  MapPin,
  Plus,
  Search,
  TrendingUp
} from "lucide-react-native";
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
      name: "Amrit Kumar",
      location: "Delhi, India",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Priya Sharma",
      location: "Mumbai, India",
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
      icon: <DollarSign size={24} color="#4B5563" />,
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
      {/* Curved Header Section */}
      <View className="relative">
        <View
          className="px-6 pt-12 pb-32"
          style={{
            backgroundColor: '#7C8B3A', // Olive/army green matching reference image
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          {/* Header Content - Personalized Greeting with Avatar (Option 1) */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              {/* Farmer Avatar + Personalized Greeting */}
              <View className="flex-row items-center mb-2">
                <View className="w-12 h-12 rounded-full bg-white/20 overflow-hidden border-2 border-white/30 mr-3">
                  <Image
                    source={{
                      uri: user?.profileImage || "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-white text-xl font-bold">
                  {t('farmerHome.hello')}, {user?.name || t('farmerHome.farmer')}
                </Text>
              </View>
              {/* Date */}
              <Text className="text-white/80 text-sm ml-13">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            </View>
            {/* Notification Bell */}
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Bell size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Positioned below date with increased width */}
          <View className="absolute bottom-16 left-4 right-4">
            <View
              className="flex-row items-center rounded-3xl px-4 py-3"
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
              <Search size={20} color="rgba(255, 255, 255, 0.8)" />
              <TextInput
                placeholder={t('common.searchHere')}
                className="flex-1 ml-3 text-base"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                style={{ color: 'white' }}
              />
              <TouchableOpacity className="p-2">
                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>



      </View>

      {/* Floating Map Card - Positioned below search bar */}
      <View
        className="absolute rounded-3xl z-10 overflow-hidden"
        style={{
          top: 200, // Position below search bar
          alignSelf: 'center', // Perfect horizontal centering
          width: '90%', // Maintain 90% width
          height: 280,
          shadowColor: '#7C8B3A',
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

        {/* Floating Buttons on Map */}
        <View
          className="absolute top-4 left-4 right-4 flex-row justify-between"
          style={{ gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => router.push("/nearby-buyers")}
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{
              backgroundColor: 'rgba(124, 139, 58, 0.9)', // Semi-transparent olive green
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
              backgroundColor: 'rgba(124, 139, 58, 0.9)', // Semi-transparent olive green
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

      <ScrollView
        className="flex-1 pb-24"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 340, // Space for the floating map card (increased from 320)
        }}
      >

        {/* Market Prices - Redesigned with olive green accent */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              {t('market.marketPrices')}
            </Text>
            <TouchableOpacity
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
                    source={{ uri: item.image }}
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
                  <Text className="text-gray-800 text-sm font-semibold text-center leading-tight">
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
                <TouchableOpacity className="p-2 bg-emerald-100 rounded-full">
                  <MapPin size={20} color="#059669" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 bg-blue-100 rounded-full">
                  <Bell size={20} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* My Fields Section - Styled like reference image */}
        <View className="px-6 mb-8">
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
      </ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <FarmerBottomNav activeTab="home" />
      </View>
    </View>
  );
}
