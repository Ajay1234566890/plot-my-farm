import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const cropTypes = [
  "Rice",
  "Wheat",
  "Corn",
  "Soybeans",
  "Potatoes",
  "Tomatoes",
  "Onions",
  "Cotton",
];

export default function AddOffer() {
  const router = useRouter();
  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [availabilityDates, setAvailabilityDates] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showCropTypes, setShowCropTypes] = useState(false);

  const handleSubmit = () => {
    // In a real app, this would submit to a backend
    console.log({
      cropType,
      quantity,
      pricePerUnit,
      minOrderQuantity,
      availabilityDates,
      additionalNotes,
    });
    router.push("/farmer-home");
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
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Create Offer</Text>
        </View>
        <Text className="text-white/80">
          Create a new crop offer for buyers
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pb-24" showsVerticalScrollIndicator={false}>
        {/* Crop Type */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Crop Type</Text>
          <TouchableOpacity
            onPress={() => setShowCropTypes(!showCropTypes)}
            className="border border-gray-300 rounded-lg p-4"
          >
            <Text className={cropType ? "text-gray-900" : "text-gray-400"}>
              {cropType || "Select Crop Type"}
            </Text>
          </TouchableOpacity>
          
          {showCropTypes && (
            <View className="border border-gray-300 rounded-lg mt-2">
              {cropTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setCropType(type);
                    setShowCropTypes(false);
                  }}
                  className="p-4 border-b border-gray-200"
                >
                  <Text className="text-gray-900">{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quantity Available */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Quantity Available</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="e.g., 1000 kg"
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Price per Unit */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Price per Unit</Text>
          <TextInput
            value={pricePerUnit}
            onChangeText={setPricePerUnit}
            placeholder="e.g., $2.50/kg"
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Minimum Order Quantity */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Minimum Order Quantity</Text>
          <TextInput
            value={minOrderQuantity}
            onChangeText={setMinOrderQuantity}
            placeholder="e.g., 50 kg"
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Availability Dates */}
        <View className="mt-6">
          <Text className="text-gray-600 mb-2">Availability Dates</Text>
          <TextInput
            value={availabilityDates}
            onChangeText={setAvailabilityDates}
            placeholder="e.g., 08/15/2024-08/22/2024"
            className="border border-gray-300 rounded-lg p-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Additional Notes */}
        <View className="mt-6 mb-8">
          <Text className="text-gray-600 mb-2">Additional Notes</Text>
          <TextInput
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="e.g., Certification details, specific harvest information"
            className="border border-gray-300 rounded-lg p-4 min-h-[120px] text-gray-900"
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-emerald-600 rounded-lg py-4 mb-8"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Post Offer
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}