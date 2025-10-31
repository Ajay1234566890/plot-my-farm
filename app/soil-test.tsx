import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Camera,
    CheckCircle,
    Droplets,
    FlaskConical,
    Leaf,
    MapPin,
    Sun,
    Upload
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function SoilTest() {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const soilTests = [
    {
      id: "basic",
      title: "Basic Soil Analysis",
      description: "pH, Nutrients, Moisture",
      price: "₹499",
      time: "2-3 days",
      icon: "🧪",
    },
    {
      id: "comprehensive",
      title: "Comprehensive Test",
      description: "pH, NPK, Organic Matter, Micro-nutrients",
      price: "₹899",
      time: "4-5 days",
      icon: "🔬",
    },
    {
      id: "advanced",
      title: "Advanced Analysis",
      description: "Complete soil health report",
      price: "₹1499",
      time: "1 week",
      icon: "🧬",
    },
  ];

  const handleSubmit = () => {
    if (!selectedTest || !location) {
      Alert.alert("Missing Information", "Please select a test and enter location");
      return;
    }
    
    setIsSubmitted(true);
    // In a real app, this would send data to a backend
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedTest(null);
      setLocation("");
      setNotes("");
      Alert.alert("Success", "Your soil test request has been submitted successfully!");
    }, 2000);
  };

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
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">Soil Testing</Text>
              <Text className="text-white/90 mt-1">Get your soil analyzed by experts</Text>
            </View>
          </View>
          <FlaskConical size={32} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

        {/* Test Selection */}
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
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Select Test Type
          </Text>

          {soilTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              className={`bg-gray-50 rounded-2xl p-4 mb-4 border-2 ${
                selectedTest === test.id
                  ? "border-[#7C8B3A]"
                  : "border-transparent"
              }`}
              onPress={() => setSelectedTest(test.id)}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">{test.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800">
                    {test.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {test.description}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold" style={{ color: '#7C8B3A' }}>
                    {test.price}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {test.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location Input */}
        <View className="px-4 mt-2">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Farm Location
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow shadow-gray-200">
            <View className="flex-row items-center">
              <MapPin size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder="Enter farm address or GPS coordinates"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </View>

        {/* Notes */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Additional Notes
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow shadow-gray-200">
            <TextInput
              className="text-base text-gray-800 h-24"
              placeholder="Any specific concerns or information about your soil..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* Soil Image Upload */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Soil Sample Photos
          </Text>
          <View className="bg-white rounded-2xl p-6 shadow shadow-gray-200 items-center">
            <Upload size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">
              Upload photos of your soil sample
            </Text>
            <TouchableOpacity className="mt-4 flex-row items-center bg-amber-100 rounded-full px-4 py-2">
              <Camera size={16} color="#EA580C" />
              <Text className="text-amber-700 font-medium ml-2">Take Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Why Soil Testing?
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow shadow-gray-200">
            <View className="flex-row mb-4">
              <Leaf size={24} color="#10B981" />
              <View className="ml-3">
                <Text className="font-bold text-gray-800">
                  Improve Crop Yield
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Understand your soil's potential for better harvests
                </Text>
              </View>
            </View>
            
            <View className="flex-row mb-4">
              <Droplets size={24} color="#3B82F6" />
              <View className="ml-3">
                <Text className="font-bold text-gray-800">
                  Optimize Water Usage
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Know your soil's water retention capacity
                </Text>
              </View>
            </View>
            
            <View className="flex-row">
              <Sun size={24} color="#F59E0B" />
              <View className="ml-3">
                <Text className="font-bold text-gray-800">
                  Nutrient Management
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Apply the right fertilizers in correct quantities
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            className={`py-4 rounded-2xl items-center ${
              isSubmitted 
                ? "bg-green-500" 
                : "bg-gradient-to-r from-amber-500 to-orange-600"
            } shadow shadow-amber-300`}
            onPress={handleSubmit}
            disabled={isSubmitted}
          >
            {isSubmitted ? (
              <View className="flex-row items-center">
                <CheckCircle size={24} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Request Submitted!</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                Submit Soil Test Request
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}