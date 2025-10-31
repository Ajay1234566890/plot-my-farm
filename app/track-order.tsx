import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, Home, Package, Phone, Truck } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function TrackOrder() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section - Buyer Design System */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#B27E4C', // Buyer primary color (brown/copper)
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Track Order</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Map View */}
        <View className="w-full h-[250px] bg-gray-100">
          <Image 
            source={{ uri: "https://placehold.co/800x400/e5e7eb/a3a3a3.png?text=Map+View" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Current Location Card */}
        <View className="m-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#B27E4C20' }}>
              <Truck color="#B27E4C" size={20} />
            </View>
            <View className="ml-3">
              <Text className="text-gray-500 text-sm">Current Location</Text>
              <Text className="text-gray-900 font-semibold text-base">Green Valley, Orchard Ave</Text>
              <Text className="text-gray-500 text-sm">Near the Community Park</Text>
            </View>
          </View>
        </View>

        {/* Estimated Time */}
        <View className="mx-4 mb-4">
          <Text className="text-gray-500 text-sm">Estimated Arrival</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-2xl font-bold" style={{ color: '#B27E4C' }}>15-20 min</Text>
            <View className="ml-auto">
              <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#B27E4C20' }}>
                <Home color="#B27E4C" size={24} />
              </View>
            </View>
          </View>
        </View>

        {/* Driver Info */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://placehold.co/100x100/e5e7eb/a3a3a3.png?text=Driver" }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">Ethan Carter</Text>
              <Text className="text-gray-500">Your Driver</Text>
            </View>
          </View>
        </View>

        {/* Order Info */}
        <View className="mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#B27E4C20' }}>
              <Package color="#B27E4C" size={20} />
            </View>
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold">2 items</Text>
              <Text className="text-gray-500">Your Order</Text>
            </View>
          </View>
        </View>

        {/* Contact Driver Button */}
        <TouchableOpacity className="mx-4 mb-6">
          <View className="rounded-xl p-4 flex-row items-center justify-between" style={{ backgroundColor: '#B27E4C10' }}>
            <View className="flex-row items-center">
              <Phone color="#B27E4C" size={20} />
              <Text className="font-semibold ml-3" style={{ color: '#B27E4C' }}>Contact Driver</Text>
            </View>
            <ArrowLeft color="#B27E4C" size={20} className="transform rotate-180" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="orders" />
      </View>
    </View>
  );
}