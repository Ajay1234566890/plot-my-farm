import MapLibreView from "@/components/MapLibreView";
import { RADIUS_PRESETS } from "@/utils/haversine";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Home,
    MessageCircle,
    Mic,
    Phone,
    Search,
    SlidersHorizontal,
    Sprout,
    Star,
    User
} from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import {
    Alert,
    Dimensions,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// Enable className support for LinearGradient
cssInterop(LinearGradient, {
  className: "style",
});

const { width } = Dimensions.get("window");

export default function NearbyFarmers() {
  const router = useRouter();

  // Handler functions
  const handleCall = (farmerName: string, phone?: string) => {
    const phoneNumber = phone || '+1234567890';
    Alert.alert(
      'Call',
      `Calling ${farmerName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${phoneNumber}`) }
      ]
    );
  };

  const handleMessage = (farmerName: string, farmerId: number) => {
    router.push({
      pathname: '/chat-screen',
      params: { userId: farmerId, userName: farmerName, userType: 'farmer' }
    });
  };

  // Mock data for nearby farmers
  const farmers = [
    {
      id: 1,
      name: "Alex Farms",
      speciality: "Organic vegetables",
      distance: "2.5 km",
      rating: 4.8,
      reviews: 124,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
    {
      id: 2,
      name: "Green Valley",
      speciality: "Fresh fruits & poultry",
      distance: "3.1 km",
      rating: 4.9,
      reviews: 210,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
    {
      id: 3,
      name: "Sunrise Acres",
      speciality: "Dairy products",
      distance: "5.0 km",
      rating: 4.7,
      reviews: 98,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
    {
      id: 4,
      name: "Orchard Grove",
      speciality: "Seasonal fruits",
      distance: "6.2 km",
      rating: 4.9,
      reviews: 155,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with gradient */}
      <LinearGradient
        colors={["#1e40af", "#3b82f6"]}
        className="px-4 pt-4 pb-4"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="p-2" onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Nearby Farmers</Text>
          <TouchableOpacity className="p-2">
            <SlidersHorizontal color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-white rounded-full px-4 py-3 shadow-sm">
          <Search size={20} color="#64748b" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search for farmers"
            placeholderTextColor="#64748b"
          />
        </View>
      </LinearGradient>

      {/* Real MapLibre Map */}
      <View className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-lg" style={{ height: 250 }}>
        <MapLibreView
          showFarmers={true}
          showBuyers={false}
          radiusInMeters={RADIUS_PRESETS.DEFAULT}
          onUserPress={(farmer) => {
            console.log('Selected farmer:', farmer.full_name);
            // Can navigate to farmer details here
          }}
        />
      </View>

      {/* Farmers List */}
      <ScrollView className="flex-1 px-4 mt-6" showsVerticalScrollIndicator={false}>
        {farmers.map((farmer) => (
          <TouchableOpacity
            key={farmer.id}
            className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
          >
            <View className="flex-row items-center p-4">
              <Image
                source={{ uri: farmer.avatar }}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
              <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">{farmer.name}</Text>
                  <Text className="text-blue-600 font-medium">{farmer.distance}</Text>
                </View>
                <Text className="text-gray-600 mt-1">{farmer.speciality}</Text>
                <View className="flex-row items-center mt-2">
                  <Star size={16} color="#FBBF24" fill="#FBBF24" />
                  <Text className="ml-1 text-gray-700 font-semibold">
                    {farmer.rating}
                  </Text>
                  <Text className="text-gray-500 ml-1">({farmer.reviews})</Text>
                </View>
              </View>
            </View>
            <View className="px-4 pb-4 flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-full py-3 flex-row items-center justify-center"
                onPress={() => handleCall(farmer.name)}
              >
                <Phone size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-full py-3 flex-row items-center justify-center"
                onPress={() => handleMessage(farmer.name, farmer.id)}
              >
                <MessageCircle size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Message</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
          {/* Home Tab */}
          <TouchableOpacity 
            className="items-center justify-center"
            accessibilityLabel="Home tab"
            accessibilityRole="tab"
          >
            <Home size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Home</Text>
          </TouchableOpacity>

          {/* My Farms Tab */}
          <TouchableOpacity 
            className="items-center justify-center"
            accessibilityLabel="My Farms tab"
            accessibilityRole="tab"
          >
            <Sprout size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Crops</Text>
          </TouchableOpacity>

          {/* Mic Button */}
          <TouchableOpacity 
            className="items-center justify-center -mt-5 bg-blue-500 rounded-full w-14 h-14 shadow-lg"
            accessibilityLabel="Voice command"
            accessibilityRole="button"
          >
            <Mic size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Messages Tab */}
          <TouchableOpacity 
            className="items-center justify-center"
            accessibilityLabel="Messages tab"
            accessibilityRole="tab"
          >
            <MessageCircle size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Orders</Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity 
            className="items-center justify-center"
            accessibilityLabel="Profile tab"
            accessibilityRole="tab"
          >
            <User size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Safe Area Spacing for iOS */}
        <View className="h-[12px] bg-white" />
      </View>
    </SafeAreaView>
  );
}