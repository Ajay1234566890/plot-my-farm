import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package2 } from 'lucide-react-native';

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 p-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Order Confirmation</Text>
      </View>

      {/* Content */}
      <View className="flex-1 p-6 items-center">
        {/* Success Icon */}
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-6 mt-8">
          <Package2 size={40} color="#2563EB" />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-bold text-gray-800 mb-3">
          Order Placed Successfully!
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Your order has been received and is being processed. You will receive a notification when it's shipped.
        </Text>

        {/* Order Details */}
        <View className="w-full bg-gray-50 rounded-xl p-4 mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Order Number</Text>
            <Text className="text-gray-800 font-semibold">#123456789</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Estimated Delivery</Text>
            <Text className="text-gray-800 font-semibold">Tomorrow, 10 AM - 12 PM</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Order Status</Text>
            <Text className="text-blue-600 font-semibold">Processing</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          onPress={() => router.push('/my-orders')}
          className="w-full bg-blue-600 rounded-xl py-4 mb-3"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Track Order
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/farmer-home')}
          className="w-full bg-gray-100 rounded-xl py-4"
        >
          <Text className="text-gray-800 text-center font-semibold text-lg">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}