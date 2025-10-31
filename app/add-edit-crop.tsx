import { ArrowLeft, Calendar, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function AddEditCrop() {
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

  const units = ['kg', 'quintal', 'ton'];
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const handleSave = () => {
    const newErrors = {
      cropName: !formData.cropName.trim(),
      quantity: !formData.quantity.trim(),
      price: !formData.price.trim(),
      harvestDate: !formData.harvestDate.trim()
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a database
    Alert.alert('Success', 'Crop saved successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Navigation would happen here in a real app
          console.log('Navigate to My Farms');
        }
      }
    ]);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Your changes will not be saved.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            // Reset form
            setFormData({
              image: '',
              cropName: '',
              quantity: '',
              unit: 'kg',
              price: '',
              harvestDate: ''
            });
            setErrors({
              cropName: false,
              quantity: false,
              price: false,
              harvestDate: false
            });
            // Navigation would happen here in a real app
            console.log('Navigate back');
          }
        }
      ]
    );
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
            onPress={() => console.log('Navigate back')}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Add / Edit Crop</Text>
        </View>
        <Text className="text-white/80">
          Add or update your crop information
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
          {/* Upload Image Section */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-2">Upload Image</Text>
            <TouchableOpacity 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center"
              onPress={() => console.log('Upload image pressed')}
            >
              {formData.image ? (
                <Image 
                  source={{ uri: formData.image }} 
                  className="w-full h-48 rounded-lg" 
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Upload size={32} color="#6B7280" />
                  <Text className="text-gray-500 mt-2">Click to upload PNG/JPG</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Crop Name */}
          <View className="mb-4">
            <Text className="text-base font-medium text-gray-700 mb-2">Crop Name</Text>
            <TextInput
              className={`border rounded-xl p-4 text-base text-gray-900 ${errors.cropName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Tomato"
              placeholderTextColor="#9CA3AF"
              value={formData.cropName}
              onChangeText={(text) => setFormData({...formData, cropName: text})}
            />
            {errors.cropName && <Text className="text-red-500 text-sm mt-1">Crop name is required</Text>}
          </View>

          {/* Quantity and Unit */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-700 mb-2">Quantity</Text>
              <TextInput
                className={`border rounded-xl p-4 text-base text-gray-900 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., 100"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(text) => setFormData({...formData, quantity: text})}
              />
              {errors.quantity && <Text className="text-red-500 text-sm mt-1">Quantity is required</Text>}
            </View>

            <View className="flex-1">
              <Text className="text-base font-medium text-gray-700 mb-2">Unit</Text>
              <TouchableOpacity 
                className="border border-gray-300 rounded-xl p-4 flex-row items-center justify-between"
                onPress={() => setShowUnitDropdown(!showUnitDropdown)}
              >
                <Text className="text-base text-gray-700">{formData.unit}</Text>
                <View className="w-0 h-0 border-l-5 border-r-5 border-t-5 border-l-transparent border-r-transparent border-t-gray-500" />
              </TouchableOpacity>
              
              {showUnitDropdown && (
                <View className="absolute top-[76px] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {units.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      className="p-4 border-b border-gray-100 last:border-b-0"
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

          {/* Price per Unit */}
          <View className="mb-4">
            <Text className="text-base font-medium text-gray-700 mb-2">Price per unit</Text>
            <View className={`border rounded-xl ${errors.price ? 'border-red-500' : 'border-gray-300'}`}>
              <View className="flex-row items-center">
                <Text className="ml-4 text-gray-700 text-lg">₹</Text>
                <TextInput
                  className="flex-1 p-4 text-base text-gray-900"
                  placeholder="e.g., 40"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(text) => setFormData({...formData, price: text})}
                />
              </View>
            </View>
            {errors.price && <Text className="text-red-500 text-sm mt-1">Price is required</Text>}
          </View>

          {/* Harvest Date */}
          <View className="mb-8">
            <Text className="text-base font-medium text-gray-700 mb-2">Harvest Date</Text>
            <TouchableOpacity 
              className={`border rounded-xl p-4 flex-row items-center ${errors.harvestDate ? 'border-red-500' : 'border-gray-300'}`}
              onPress={() => console.log('Date picker pressed')}
            >
              <Calendar size={20} color="#6B7280" />
              <TextInput
                className="ml-3 flex-1 text-base text-gray-700"
                placeholder="mm/dd/yyyy"
                value={formData.harvestDate}
                onChangeText={(text) => setFormData({...formData, harvestDate: text})}
              />
            </TouchableOpacity>
            {errors.harvestDate && <Text className="text-red-500 text-sm mt-1">Harvest date is required</Text>}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-6">
          <TouchableOpacity 
            className="flex-1 border border-gray-300 rounded-xl p-4"
            onPress={handleCancel}
          >
            <Text className="text-center text-base font-medium text-gray-700">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 rounded-xl p-4"
            style={{ backgroundColor: '#7C8B3A' }}
            onPress={handleSave}
          >
            <Text className="text-white text-center text-base font-medium">Save</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}