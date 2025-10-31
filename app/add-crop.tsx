import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    Mic,
    Upload
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Mock data for units
const units = ["Kg", "Ton", "Quintal", "Pieces"];

export default function AddCrop() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState("");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [harvestDate, setHarvestDate] = useState("");

  const handleSaveCrop = () => {
    if (!cropName || !quantity || !selectedUnit || !price) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    Alert.alert("Success", "Crop added successfully!");
    router.push("/my-farms");
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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Add New Crop</Text>
        </View>
        <Text className="text-white/80">
          Add your crop details to start selling
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Form Card */}
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
        {/* Form Fields */}
        <View className="space-y-6">
          {/* Crop Name Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Crop Name
            </Text>
            <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4">
              <TextInput
                placeholder="e.g., Paddy"
                value={cropName}
                onChangeText={setCropName}
                className="flex-1 py-3.5 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity className="p-2">
                <Mic size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantity and Unit Fields */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Quantity
              </Text>
              <View className="bg-white rounded-xl border border-gray-200 px-4">
                <TextInput
                  placeholder="e.g., 100"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="py-3.5 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">Unit</Text>
              <TouchableOpacity
                className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex-row items-center justify-between"
                onPress={() => setShowUnitDropdown(!showUnitDropdown)}
              >
                <Text className={selectedUnit ? "text-gray-800" : "text-gray-400"}>
                  {selectedUnit || "Select Unit"}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>

              {/* Unit Dropdown */}
              {showUnitDropdown && (
                <View className="absolute top-[76px] left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl z-10">
                  {units.map((unit, index) => (
                    <TouchableOpacity
                      key={index}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => {
                        setSelectedUnit(unit);
                        setShowUnitDropdown(false);
                      }}
                    >
                      <Text className="text-gray-800">{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Price Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Price (per unit)
            </Text>
            <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4">
              <Text className="text-gray-400 mr-2">₹</Text>
              <TextInput
                placeholder="e.g., 2000"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="flex-1 py-3.5 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Harvest Date Field */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Harvest Date
            </Text>
            <TouchableOpacity className="flex-row items-center bg-white rounded-xl border border-gray-200 px-4 py-3.5">
              <Calendar size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-400">Select Date</Text>
            </TouchableOpacity>
          </View>

          {/* Crop Image Upload */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Crop Image
            </Text>
            <TouchableOpacity className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 items-center">
              {cropImage ? (
                <Image
                  source={{ uri: cropImage }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <View className="w-16 h-16 rounded-full bg-emerald-50 items-center justify-center mb-4">
                    <Upload size={24} color="#059669" />
                  </View>
                  <Text className="text-sm font-medium text-gray-800">
                    Tap to upload an image of your crop
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    High-quality images attract more buyers
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveCrop}
          className="rounded-xl py-4 mt-8"
          style={{ backgroundColor: '#7C8B3A' }}
        >
          <Text className="text-white text-center font-bold text-lg">
            Save Crop
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}