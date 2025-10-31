import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Phone, MessageSquare } from 'lucide-react-native';

export default function ContactDriver() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2"
        >
          <X size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold mr-8">
          Contact Driver
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="items-center pt-8 px-4">
          {/* Driver Profile Image */}
          <View className="w-32 h-32 rounded-full overflow-hidden bg-blue-50 mb-4">
            <Image
              source={{ uri: 'https://placekitten.com/200/200' }} // Using a placeholder image
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Driver Info */}
          <Text className="text-2xl font-bold mb-1">Ethan Carter</Text>
          <Text className="text-gray-600 mb-4">Driver</Text>
          <Text className="text-lg text-gray-800 mb-8">(555) 123-4567</Text>

          {/* Action Buttons */}
          <TouchableOpacity 
            className="w-full bg-[#22C55E] rounded-xl py-4 px-6 mb-3 flex-row justify-center items-center"
            onPress={() => {/* Handle call */}}
          >
            <Phone size={20} color="white" className="mr-2" />
            <Text className="text-white text-lg font-semibold">Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full bg-blue-50 rounded-xl py-4 px-6 mb-3 flex-row justify-center items-center"
            onPress={() => {/* Handle message */}}
          >
            <MessageSquare size={20} color="#3b82f6" className="mr-2" />
            <Text className="text-blue-500 text-lg font-semibold">Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full bg-gray-50 rounded-xl py-4 px-6 mb-3"
            onPress={() => {/* Handle support contact */}}
          >
            <Text className="text-gray-700 text-lg font-semibold text-center">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center p-4 border-t border-gray-100">
        <TouchableOpacity 
          className="items-center"
          onPress={() => router.push('/track-order')}
        >
          <View className="w-6 h-6 mb-1">
            {/* You can replace this with your tracking icon */}
            <View className="w-full h-full bg-blue-500 rounded-sm" />
          </View>
          <Text className="text-blue-500 text-sm">Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="items-center"
          onPress={() => router.push('/past-orders')}
        >
          <View className="w-6 h-6 mb-1">
            {/* You can replace this with your orders icon */}
            <View className="w-full h-full bg-gray-400 rounded-sm" />
          </View>
          <Text className="text-gray-600 text-sm">Past Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="items-center"
          onPress={() => router.push('/profile')}
        >
          <View className="w-6 h-6 mb-1">
            {/* You can replace this with your profile icon */}
            <View className="w-full h-full bg-gray-400 rounded-sm" />
          </View>
          <Text className="text-gray-600 text-sm">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}