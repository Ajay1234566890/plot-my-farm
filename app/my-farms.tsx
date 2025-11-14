import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Calendar,
    Droplets,
    Leaf,
    MapPin,
    MessageSquare,
    Mic,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    Sun,
} from "lucide-react-native";
import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import {
    Animated,
    Dimensions,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

export default function MyFarms() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Scroll animation for glass card fade effect
  const scrollY = useRef(new Animated.Value(0)).current;
  // Mock data for farms with crop-specific images
  const farms = [
    {
      id: 1,
      name: "Green Valley Farm",
      location: "Delhi, India",
      size: "12 acres",
      crops: ["Wheat", "Tomatoes", "Potatoes"],
      status: "Harvesting",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=60", // Golden wheat field
      yield: "2.4 tons",
      lastHarvest: "2 days ago",
    },
    {
      id: 2,
      name: "Sunshine Fields",
      location: "Mumbai, India",
      size: "8 acres",
      crops: ["Rice", "Onions"],
      status: "Growing",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60", // Green rice paddy
      yield: "1.8 tons",
      lastHarvest: "1 week ago",
    },
    {
      id: 3,
      name: "Organic Haven",
      location: "Bangalore, India",
      size: "15 acres",
      crops: ["Carrots", "Spinach", "Lettuce"],
      status: "Planting",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=60", // Fresh vegetables farm
      yield: "0.9 tons",
      lastHarvest: "3 weeks ago",
    },
  ];

  const farmStats = [
    { icon: <Leaf size={20} color="#10B981" />, label: t('farms.activeCrops'), value: "12" },
    { icon: <Droplets size={20} color="#3B82F6" />, label: t('farms.irrigation'), value: "85%" },
    { icon: <Sun size={20} color="#F59E0B" />, label: t('farms.sunlight'), value: "7h/day" },
    { icon: <Calendar size={20} color="#8B5CF6" />, label: t('farms.season'), value: t('farms.kharif') },
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
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('farms.myFarms')}</Text>
        </View>

        {/* Enhanced Search Bar */}
        <View className="mt-2">
          <View
            className="flex-row items-center bg-white/90 rounded-2xl px-4 py-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Search size={20} color="#4B5563" />
            <TextInput
              placeholder={t('farms.searchFarmsCrops')}
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
      </View>

      {/* Farms List with ScrollView */}
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Stats Overview - Glass Card with Fade Effect */}
        <Animated.View
          className="mx-6 mb-6 rounded-3xl p-6 shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glass effect
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
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
          <Text className="text-xl font-bold text-gray-800 mb-4">{t('farms.farmOverview')}</Text>
          <View className="flex-row flex-wrap justify-between">
            {farmStats.map((stat, index) => (
              <View key={index} className="basis-[48%] flex-row items-center rounded-xl p-3 mb-3" style={{ backgroundColor: '#F5F3F0' }}>
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                  {stat.icon}
                </View>
                <View className="ml-3">
                  <Text className="text-lg font-bold text-gray-900">{stat.value}</Text>
                  <Text className="text-xs text-gray-500">{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* My Farms Section Header */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800">{t('farms.myFarms')} ({farms.length})</Text>
        </View>

        {/* Farms Cards */}
        <View className="px-6">
          {farms.map((farm) => (
            <View
              key={farm.id}
              className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {/* Farm Image */}
              <View className="h-40 relative">
                <Image
                  source={{ uri: farm.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 right-3 px-3 py-1 rounded-full" style={{ backgroundColor: '#7C8B3A' }}>
                  <Text className="text-xs font-bold text-white">{farm.status}</Text>
                </View>
              </View>
              
              {/* Farm Details */}
              <View className="p-4">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-lg font-bold text-gray-900">{farm.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-500 ml-1">{farm.location}</Text>
                    </View>
                    <Text className="text-sm text-gray-500 mt-1">{farm.size}</Text>
                  </View>
                  <TouchableOpacity className="p-2">
                    <MoreHorizontal size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                {/* Crops */}
                <View className="mt-3">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">{t('farms.currentCrops')}</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {farm.crops.map((crop, index) => (
                      <View key={index} className="bg-emerald-50 px-3 py-1 rounded-full">
                        <Text className="text-xs font-medium text-emerald-700">{crop}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Farm Stats */}
                <View className="flex-row mt-4 pt-3 border-t border-gray-100">
                  <View className="flex-1 items-center">
                    <Text className="text-sm font-bold text-gray-900">{farm.yield}</Text>
                    <Text className="text-xs text-gray-500">{t('farms.lastYield')}</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-sm font-bold text-gray-900">{farm.lastHarvest}</Text>
                    <Text className="text-xs text-gray-500">{t('farms.harvested')}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row mt-4 gap-3">
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: "/edit-crop",
                      params: { farmId: farm.id.toString() }
                    })}
                    className="flex-1 flex-row items-center justify-center bg-emerald-600 rounded-xl py-3.5 shadow-sm"
                  >
                    <Leaf size={18} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-2">{t('farms.manage')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: "/insights",
                      params: { farmId: farm.id.toString() }
                    })}
                    className="flex-1 flex-row items-center justify-center bg-emerald-50 rounded-xl py-3.5 shadow-sm"
                  >
                    <MessageSquare size={18} color="#059669" />
                    <Text className="text-emerald-700 font-semibold ml-2">
                      {t('farms.insights')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <FarmerBottomNav activeTab="farms" />
      </View>
    </View>
  );
}