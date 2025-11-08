import React, { useState } from "react";
import {
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
  return (
    <HomePageErrorBoundary
      fallbackTitle="Buyer Home Unavailable"
      fallbackMessage="There was an issue loading the buyer home page. Please try again or restart the app."
    >
      <BuyerHomeContent />
    </HomePageErrorBoundary>
  );
}

function BuyerHomeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Nearby Crops");

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
      label: "Market",
      route: "/buyer-market-prices" as const,
    },
    {
      icon: <ShoppingCart size={24} color="#4B5563" />,
      label: "My Cart",
      route: "/cart" as const,
    },
    {
      icon: <Package size={24} color="#4B5563" />,
      label: "Orders",
      route: "/my-orders" as const,
    },
    {
      icon: <DollarSign size={24} color="#4B5563" />,
      label: "Offers",
      route: "/buyer-offers" as const,
    },
  ];

  const marketPrices = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: "₹200/kg",
      change: "+₹15",
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Sweet Corn",
      price: "₹230/kg",
      change: "-₹8",
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Organic Carrots",
      price: "₹145/kg",
      change: "+₹4.50",
      image:
        "https://images.unsplash.com/photo-1518843874671-6ab90f6775b6?w=900&auto=format&fit=crop&q=60",
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
      {/* Curved Header Section */}
      <View className="relative">
        <View
          className="px-6 pt-12 pb-32"
          style={{
            backgroundColor: '#B27E4C', // Buyer primary color (brown/copper)
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          {/* Header Content - Personalized Greeting with Avatar */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              {/* Buyer Avatar + Personalized Greeting */}
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
                  Hello, {user?.name || "Buyer"}
                </Text>
              </View>
              {/* Date */}
              <Text className="text-white/80 text-sm ml-13">Sunday, 01 Dec 2024</Text>
            </View>
            {/* Top Icons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.push("/wishlist")}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Heart size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Bell size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/messages")}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <MessageSquare size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
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
                placeholder="Search for crops..."
                className="flex-1 ml-3 text-base text-gray-900"
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

      {/* Floating Map Section - Positioned below search bar */}
      <View
        className="absolute rounded-3xl z-10 overflow-hidden"
        style={{
          top: 200, // Position below search bar
          alignSelf: 'center', // Perfect horizontal centering
          width: '90%', // Maintain 90% width
          height: 280,
          shadowColor: '#B27E4C',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
          elevation: 10,
        }}
      >
        <MapErrorBoundary fallbackMessage="Map is temporarily unavailable.">
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
              Nearby Farmers
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
              Nearby Buyers
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 pb-24"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 340, // Space for the floating map card
        }}
      >

        {/* Featured Crops Section - Redesigned with buyer color scheme */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Featured Crops
            </Text>
            <TouchableOpacity
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#B27E4C' }}
            >
              <Text className="text-sm font-semibold text-white">
                View All
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
          <Text className="text-xl font-bold text-gray-800 mb-5">Quick Actions</Text>
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
            <Text className="text-xl font-bold text-gray-800">Market Real Prices</Text>
            <TouchableOpacity
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#B27E4C' }}
              onPress={() => router.push("/buyer-market-prices")}
            >
              <Text className="text-sm font-semibold text-white">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-4">
            {marketPrices.map((item) => (
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
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-14 h-14 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="text-gray-800 font-bold text-base">{item.name}</Text>
                  <Text className="text-gray-600 text-sm">{item.price}</Text>
                </View>
                <Text
                  className={
                    item.change.includes("+")
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {item.change}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Crops and Farmers Tabs */}
        <View className="px-6 mb-8">
          <View className="flex-row mb-4 gap-2">
            <TouchableOpacity
              onPress={() => setActiveTab("Nearby Crops")}
              className={`px-6 py-3 rounded-full ${
                activeTab === "Nearby Crops"
                  ? "shadow-lg"
                  : ""
              }`}
              style={{
                backgroundColor: activeTab === "Nearby Crops" ? '#B27E4C' : '#B27E4C20',
              }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "Nearby Crops"
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                Nearby Crops
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("Nearby Farmers")}
              className={`px-6 py-3 rounded-full ${
                activeTab === "Nearby Farmers"
                  ? "shadow-lg"
                  : ""
              }`}
              style={{
                backgroundColor: activeTab === "Nearby Farmers" ? '#B27E4C' : '#B27E4C20',
              }}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "Nearby Farmers"
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                Nearby Farmers
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "Nearby Crops" ? (
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
                    <Text className="text-gray-500 text-sm">{farmer.distance} away</Text>
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