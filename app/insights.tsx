import { useAuth } from '@/contexts/auth-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    CloudRain,
    Droplets,
    Leaf,
    Sun,
    Thermometer,
    TrendingUp
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import FarmerBottomNav from './components/FarmerBottomNav';

const { width } = Dimensions.get("window");

export default function Insights() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  // Mock data for insights
  const farmData = {
    id: 1,
    name: "Green Valley Farm",
    location: "Delhi, India",
    size: "12 acres",
    crops: ["Wheat", "Tomatoes", "Potatoes"],
    status: "Harvesting",
    image: "https://images.unsplash.com/photo-1597038185869-9ad1b4bc9e1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    yield: "2.4 tons",
    lastHarvest: "2 days ago",
  };

  const weeklyYieldData = [
    { day: "Mon", yield: 120 },
    { day: "Tue", yield: 180 },
    { day: "Wed", yield: 150 },
    { day: "Thu", yield: 200 },
    { day: "Fri", yield: 170 },
    { day: "Sat", yield: 220 },
    { day: "Sun", yield: 250 },
  ];

  const weatherData = [
    { day: "Mon", temp: 28, rain: 10, humidity: 65 },
    { day: "Tue", temp: 30, rain: 5, humidity: 60 },
    { day: "Wed", temp: 32, rain: 0, humidity: 55 },
    { day: "Thu", temp: 29, rain: 15, humidity: 70 },
    { day: "Fri", temp: 27, rain: 25, humidity: 75 },
    { day: "Sat", temp: 26, rain: 30, humidity: 80 },
    { day: "Sun", temp: 28, rain: 20, humidity: 72 },
  ];

  const soilHealth = [
    { nutrient: "Nitrogen", level: 75, status: "Optimal" },
    { nutrient: "Phosphorus", level: 60, status: "Good" },
    { nutrient: "Potassium", level: 45, status: "Low" },
    { nutrient: "pH Level", level: 6.8, status: "Balanced" },
  ];

  const recommendations = [
    { id: 1, title: "Irrigation Needed", description: "Based on soil moisture, irrigate field section A tomorrow morning", priority: "High" },
    { id: 2, title: "Fertilizer Alert", description: "Potassium levels low, apply K-fertilizer in section C", priority: "Medium" },
    { id: 3, title: "Pest Watch", description: "Increased aphid activity detected, monitor section B", priority: "Low" },
  ];

  // Stats for the overview section
  const farmStats = [
    { icon: <Leaf size={20} color="#7C8B3A" />, label: "Yield", value: "2.4 tons" },
    { icon: <Droplets size={20} color="#7C8B3A" />, label: "Moisture", value: "72%" },
    { icon: <Sun size={20} color="#7C8B3A" />, label: "Sunlight", value: "8h/day" },
    { icon: <Thermometer size={20} color="#7C8B3A" />, label: "Avg Temp", value: "28°C" },
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
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Farm Insights</Text>
            <Text className="text-sm text-white/80">{farmData.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-6">
        {/* Farm Overview Card */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Farm Overview</Text>
            <TouchableOpacity className="px-3 py-1 rounded-full" style={{ backgroundColor: '#F5F3F0' }}>
              <Text className="text-xs font-medium" style={{ color: '#7C8B3A' }}>Live</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {farmStats.map((stat, index) => (
              <View key={index} className="basis-[48%] flex-row items-center bg-gray-50 rounded-xl p-3 mb-3">
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
          
          {/* Farm Image */}
          <View className="h-40 rounded-xl overflow-hidden mt-2 relative">
            <Image
              source={{ uri: farmData.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-3 left-3 bg-emerald-500 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-white">{farmData.status}</Text>
            </View>
          </View>
        </View>

        {/* Yield Chart */}
        <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-900">Yield Progress</Text>
            <TouchableOpacity>
              <Text className="text-sm text-emerald-600 font-medium">View Details</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-end h-32 mt-4 justify-between px-2">
            {weeklyYieldData.map((data, index) => (
              <View key={index} className="flex-1 items-center">
                <View 
                  className="w-8 bg-emerald-500 rounded-t-lg"
                  style={{ height: `${data.yield / 3}%` }}
                />
                <Text className="text-xs text-gray-500 mt-2">{data.day}</Text>
              </View>
            ))}
          </View>
          
          <View className="flex-row justify-between mt-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">2.4</Text>
              <Text className="text-sm text-gray-500">tons this season</Text>
            </View>
            <View className="flex-row items-center bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp size={16} color="#10B981" />
              <Text className="text-sm font-medium text-emerald-700 ml-1">+12%</Text>
            </View>
          </View>
        </View>

        {/* Weather Forecast */}
        <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-900">Weather Forecast</Text>
            <TouchableOpacity>
              <Text className="text-sm text-emerald-600 font-medium">7 Days</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-40">
            <View className="flex-row gap-4">
              {weatherData.map((day, index) => (
                <View key={index} className="items-center bg-gray-50 rounded-xl p-3 w-24">
                  <Text className="font-medium text-gray-900">{day.day}</Text>
                  <Sun size={24} color="#F59E0B" className="my-2" />
                  <Text className="text-lg font-bold text-gray-900">{day.temp}°</Text>
                  <View className="flex-row items-center mt-1">
                    <CloudRain size={12} color="#3B82F6" />
                    <Text className="text-xs text-gray-500 ml-1">{day.rain}mm</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Soil Health */}
        <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Soil Health</Text>
          
          <View className="gap-4">
            {soilHealth.map((item, index) => (
              <View key={index}>
                <View className="flex-row justify-between mb-1">
                  <Text className="font-medium text-gray-900">{item.nutrient}</Text>
                  <Text className="text-gray-500">{item.level}{item.nutrient === "pH Level" ? "" : "%"}</Text>
                </View>
                <View className="h-2.5 bg-gray-200 rounded-full">
                  <View 
                    className={`h-2.5 rounded-full ${
                      item.level > 70 ? "bg-emerald-500" : 
                      item.level > 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${item.level}%` }}
                  />
                </View>
                <Text className={`text-xs mt-1 ${
                  item.level > 70 ? "text-emerald-600" : 
                  item.level > 50 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Recommendations</Text>
          
          <View className="gap-3">
            {recommendations.map((rec) => (
              <View key={rec.id} className="flex-row items-start border border-gray-100 rounded-xl p-3">
                <View className={`w-3 h-3 rounded-full mt-1.5 ${
                  rec.priority === "High" ? "bg-red-500" : 
                  rec.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                }`} />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-900">{rec.title}</Text>
                  <Text className="text-sm text-gray-600 mt-1">{rec.description}</Text>
                  <View className={`self-start mt-2 px-2 py-1 rounded-full ${
                    rec.priority === "High" ? "bg-red-50" : 
                    rec.priority === "Medium" ? "bg-yellow-50" : "bg-green-50"
                  }`}>
                    <Text className={`text-xs font-medium ${
                      rec.priority === "High" ? "text-red-700" : 
                      rec.priority === "Medium" ? "text-yellow-700" : "text-green-700"
                    }`}>
                      {rec.priority} Priority
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <FarmerBottomNav activeTab="home" />
    </View>
  );
}