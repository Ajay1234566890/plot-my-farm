import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronDown, Mic, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditCrop() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    image: '',
    cropName: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: ''
  });

  const [errors, setErrors] = useState({
    cropName: false,
    quantity: false,
    price: false,
    harvestDate: false
  });

  const units = ['kg', 'quintal', 'ton', 'bag', 'bunch'];
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const handleSave = () => {
    const newErrors = {
      cropName: !formData.cropName,
      quantity: !formData.quantity,
      price: !formData.price,
      harvestDate: !formData.harvestDate
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    Alert.alert('Success', 'Crop details saved successfully');
  };

  const handleCancel = () => {
    setFormData({
      image: '',
      cropName: '',
      quantity: '',
      unit: 'kg',
      price: '',
      harvestDate: ''
    });
    // Navigation would go here in a real app
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
          <Text className="text-xl font-bold text-white">Edit Crop</Text>
        </View>
        <Text className="text-white/80">
          Update your crop information
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

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
        {/* Upload Image */}
        <Text className="text-base text-gray-700 mb-2">Upload Image</Text>
        <TouchableOpacity 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center mb-6"
          onPress={() => {/* Image picker logic would go here */}}
        >
          <Upload size={24} className="text-gray-400 mb-2" />
          <Text className="text-gray-500 text-center">Click to upload</Text>
          <Text className="text-gray-400 text-sm">PNG, JPG or GIF</Text>
        </TouchableOpacity>

        {/* Crop Name */}
        <View className="mb-4">
          <Text className="text-base text-gray-700 mb-2">Crop Name</Text>
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.cropName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Tomato"
              placeholderTextColor="#9CA3AF"
              value={formData.cropName}
              onChangeText={(text) => setFormData({...formData, cropName: text})}
            />
            <TouchableOpacity className="absolute right-3 top-3">
              <Mic size={24} className="text-gray-400" />
            </TouchableOpacity>
          </View>
          {errors.cropName && <Text className="text-red-500 text-sm mt-1">Crop name is required</Text>}
        </View>

        {/* Quantity and Unit */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-base text-gray-700 mb-2">Quantity</Text>
            <View className="relative">
              <TextInput
                className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., 100"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(text) => setFormData({...formData, quantity: text})}
              />
              <TouchableOpacity className="absolute right-3 top-3">
                <Mic size={24} className="text-gray-400" />
              </TouchableOpacity>
            </View>
            {errors.quantity && <Text className="text-red-500 text-sm mt-1">Quantity is required</Text>}
          </View>

          <View className="w-32">
            <Text className="text-base text-gray-700 mb-2">Unit</Text>
            <TouchableOpacity 
              className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between"
              onPress={() => setShowUnitDropdown(!showUnitDropdown)}
            >
              <Text className="text-base text-gray-700">{formData.unit}</Text>
              <ChevronDown size={20} className="text-gray-400" />
            </TouchableOpacity>
            {showUnitDropdown && (
              <View className="absolute top-[74px] left-0 right-0 bg-white border border-gray-200 rounded-lg z-10 mt-1">
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    className="p-3 border-b border-gray-100"
                    onPress={() => {
                      setFormData({...formData, unit});
                      setShowUnitDropdown(false);
                    }}
                  >
                    <Text className="text-base text-gray-700">{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="text-base text-gray-700 mb-2">Price (per unit)</Text>
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., 40"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
            />
            <TouchableOpacity className="absolute right-3 top-3">
              <Mic size={24} className="text-gray-400" />
            </TouchableOpacity>
          </View>
          {errors.price && <Text className="text-red-500 text-sm mt-1">Price is required</Text>}
        </View>

        {/* Harvest Date */}
        <View className="mb-8">
          <Text className="text-base text-gray-700 mb-2">Harvest Date</Text>
          <View className="relative">
            <TextInput
              className={`border rounded-lg p-3 pr-12 text-base text-gray-900 ${errors.harvestDate ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#9CA3AF"
              value={formData.harvestDate}
              onChangeText={(text) => setFormData({...formData, harvestDate: text})}
            />
            <TouchableOpacity className="absolute right-3 top-3">
              <Calendar size={24} className="text-gray-400" />
            </TouchableOpacity>
          </View>
          {errors.harvestDate && <Text className="text-red-500 text-sm mt-1">Harvest date is required</Text>}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity 
            className="flex-1 p-3 border border-green-500 rounded-lg"
            onPress={handleCancel}
          >
            <Text className="text-green-500 text-center text-base font-medium">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 p-3 rounded-lg"
            style={{ backgroundColor: '#7C8B3A' }}
            onPress={handleSave}
          >
            <Text className="text-white text-center text-base font-medium">Save</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}