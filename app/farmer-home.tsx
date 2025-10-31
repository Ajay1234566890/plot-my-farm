import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { useWeather } from "@/contexts/weather-context";
import { formatLocation, getIconColor, getTextColorClass, getWeatherBackground } from "@/utils/weather-utils";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    Bell,
    Cloud,
    CloudSun,
    DollarSign,
    Droplets,
    MapPin,
    Plus,
    Search,
    Sunrise,
    Sunset,
    Thermometer,
    TrendingUp,
    Wind
} from "lucide-react-native";
import React from "react";
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function FarmerHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { weatherData, locationData } = useWeather();

  // Get formatted location and weather background
  const location = formatLocation(locationData, weatherData);
  const weatherBackground = getWeatherBackground(weatherData);

  // Scroll animation for weather card fade effect
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Mock data for market prices (restored from original)
  const marketPrices = [
    { name: "Tomatoes", price: "₹45/kg", icon: "🍅", change: "+2%" },
    { name: "Rice", price: "₹52/kg", icon: "🌾", change: "-1%" },
    { name: "Potatoes", price: "₹35/kg", icon: "🥔", change: "+5%" },
  ];

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
      label: "Weather",
      route: "/farmer-weather" as const,
    },
    {
      icon: <TrendingUp size={24} color="#4B5563" />,
      label: "Market",
      route: "/market-real-prices" as const,
    },
    {
      icon: <DollarSign size={24} color="#4B5563" />,
      label: "My Offers",
      route: "/farmer-offers" as const,
    },
    {
      icon: <MapPin size={24} color="#4B5563" />,
      label: "Nearby",
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
                  Hello, {user?.name || "Farmers"}
                </Text>
              </View>
              {/* Date */}
              <Text className="text-white/80 text-sm ml-13">Sunday, 01 Dec 2024</Text>
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
                placeholder="Search here..."
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

      {/* Glass Weather Card - Positioned to overlap INTO header section */}
      <Animated.View
        className="absolute rounded-3xl z-10"
        style={{
          top: -50, // Position to overlap into header
          alignSelf: 'center', // Perfect horizontal centering
          width: '85%', // Maintain 85% width
          opacity: scrollY.interpolate({
            inputRange: [0, 120, 180],
            outputRange: [1, 0.2, 0],
            extrapolate: 'clamp',
          }),
          transform: [{
            scale: scrollY.interpolate({
              inputRange: [0, 120, 180],
              outputRange: [1, 0.95, 0.9],
              extrapolate: 'clamp',
            })
          }]
        }}
      >
        <LinearGradient
          colors={weatherBackground.gradient as [string, string, ...string[]]}
          className="rounded-3xl p-5 shadow-lg"
          style={{
            shadowColor: weatherBackground.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Location and Temperature */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPin size={16} color={getIconColor(weatherBackground)} />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm ml-1 opacity-90`}>
                {location.display}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Cloud size={24} color={getIconColor(weatherBackground)} />
              <Text className={`${getTextColorClass(weatherBackground)} text-2xl font-bold ml-2`}>
                {weatherData?.current.temperature ? `${weatherData.current.temperature}°` : '--°'}
              </Text>
            </View>
          </View>

          {/* Weather Details */}
          <View className="flex-row justify-between">
            <View className="items-center">
              <Thermometer size={20} color={getIconColor(weatherBackground)} />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm font-semibold mt-1`}>
                {weatherData?.current.feelsLike ? `${weatherData.current.feelsLike}°` : '--°'}
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} text-xs opacity-75`}>Feels like</Text>
            </View>
            <View className="items-center">
              <Droplets size={20} color={getIconColor(weatherBackground)} />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm font-semibold mt-1`}>
                {weatherData?.current.humidity ? `${weatherData.current.humidity}%` : '--'}
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} text-xs opacity-75`}>Humidity</Text>
            </View>
            <View className="items-center">
              <Wind size={20} color={getIconColor(weatherBackground)} />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm font-semibold mt-1`}>
                {weatherData?.current.windSpeed ? `${weatherData.current.windSpeed} km/h` : '--'}
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} text-xs opacity-75`}>Wind</Text>
            </View>
            <View className="items-center">
              <Cloud size={20} color={getIconColor(weatherBackground)} />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm font-semibold mt-1`}>
                {weatherData?.current.pressure ? `${weatherData.current.pressure} hPa` : '--'}
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} text-xs opacity-75`}>Pressure</Text>
            </View>
          </View>

          {/* Sunrise and Sunset */}
          <View className={`flex-row justify-between mt-4 pt-4 border-t ${getTextColorClass(weatherBackground) === 'text-white' ? 'border-white/20' : 'border-gray-200'}`}>
            <View className="flex-row items-center">
              <Sunrise size={16} color="#F59E0B" />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm ml-2`}>
                {weatherData?.current.sunrise
                  ? new Date(weatherData.current.sunrise * 1000).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  : '--:--'
                }
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} text-sm ml-1 opacity-75`}>Sunrise</Text>
            </View>
            <View className="flex-row items-center">
              <Sunset size={16} color="#F59E0B" />
              <Text className={`${getTextColorClass(weatherBackground)} text-sm ml-2`}>
                {weatherData?.current.sunset
                  ? new Date(weatherData.current.sunset * 1000).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  : '--:--'
                }
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} text-sm ml-1 opacity-75`}>Sunset</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        className="flex-1 pb-24"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: scrollY.interpolate({
            inputRange: [0, 120, 180],
            outputRange: [180, 60, 0], // Weather card height → smooth transition → no space
            extrapolate: 'clamp',
          }),
        }}
      >



        {/* Market Prices - Redesigned with olive green accent */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Market Prices
            </Text>
            <TouchableOpacity
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#7C8B3A' }}
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
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                  style={{ backgroundColor: '#7C8B3A15' }}
                >
                  <Text className="text-3xl">{item.icon}</Text>
                </View>
                <Text className="text-sm font-bold text-gray-800 text-center">
                  {item.name}
                </Text>
                <Text className="text-lg font-bold mt-2" style={{ color: '#7C8B3A' }}>
                  {item.price}
                </Text>
                <View
                  className={`px-2 py-1 rounded-full mt-2 ${item.change.startsWith("+") ? "bg-emerald-50" : "bg-rose-50"}`}
                >
                  <Text
                    className={`text-xs font-semibold ${item.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {item.change}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>



        {/* Quick Actions - Redesigned with sophisticated olive green theme */}
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
          <View className="flex-row items-center bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-4 shadow shadow-emerald-300">
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Plus size={24} color="#FFFFFF" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-white">
                Add New Crop
              </Text>
              <Text className="text-sm text-white/90">
                Get instant market quotes
              </Text>
            </View>
            <Text className="text-sm font-bold text-white">Add</Text>
          </View>
        </TouchableOpacity>

        {/* Recommended Buyers - Restored from original */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Recommended Buyers
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
          <Text className="text-gray-800 text-lg font-bold mb-4">My Fields</Text>
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
                    Organic Vegetable Farm
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    2.5 acres • Active crops: Tomatoes, Potatoes
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
