import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MapPin, Clock, Leaf, Truck, DollarSign } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function TransportConfirmation() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Text className="text-xl font-semibold text-gray-800">Transport Summary</Text>
      </View>

      {/* Pickup Details Section */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Pickup Details</Text>
        
        <View className="flex-row items-start mb-3">
          <MapPin className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Pickup Address</Text>
            <Text className="text-gray-600">123 Farm Lane, Rural County, State, 54321</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-3">
          <Clock className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Pickup Time</Text>
            <Text className="text-gray-600">Available 9 AM - 5 PM</Text>
          </View>
        </View>
      </View>

      {/* Delivery Details Section */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Delivery Details</Text>
        
        <View className="flex-row items-start mb-3">
          <MapPin className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Delivery Address</Text>
            <Text className="text-gray-600">456 Market St, City, State, 67890</Text>
          </View>
        </View>

        <View className="flex-row items-start mb-3">
          <Clock className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Delivery Time</Text>
            <Text className="text-gray-600">Preferred 10 AM - 6 PM</Text>
          </View>
        </View>
      </View>

      {/* Crop Information */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Crop Information</Text>
        
        <View className="flex-row items-start mb-3">
          <Leaf className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Crop Type: Tomatoes</Text>
            <Text className="text-gray-600">1000 lbs</Text>
          </View>
        </View>
      </View>

      {/* Transport Preferences */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Transport Preferences</Text>
        
        <View className="flex-row items-start mb-3">
          <Truck className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Vehicle Type: Refrigerated Truck</Text>
          </View>
        </View>
      </View>

      {/* Cost */}
      <View className="p-4 border-t border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Cost</Text>
        
        <View className="flex-row items-start mb-3">
          <DollarSign className="text-gray-600" size={20} />
          <View className="ml-3">
            <Text className="text-gray-800 font-medium">Estimated Cost: $250</Text>
          </View>
        </View>
      </View>

      {/* Confirm Button */}
      <View className="p-4 mt-2">
        <TouchableOpacity 
          className="bg-blue-600 rounded-lg py-4 items-center"
          onPress={() => {
            // Handle booking confirmation
          }}
        >
          <Text className="text-white font-semibold text-lg">Confirm Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom padding for scrolling */}
      <View className="h-8" />
    </ScrollView>
  );
}