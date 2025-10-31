import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    CheckCircle,
    CreditCard,
    MapPin,
    Truck,
    Wallet
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "John Doe",
    address: "123 Main Street",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "560001",
    phone: "9876543210",
  });

  const [orderSummary] = useState({
    items: 3,
    subtotal: 1165,
    deliveryFee: 50,
    discount: 100,
    total: 1115,
  });

  const handleInputChange = (field: string, value: string) => {
    setDeliveryInfo({ ...deliveryInfo, [field]: value });
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      "Order Placed!",
      "Your order has been successfully placed. You will receive a confirmation shortly.",
      [
        {
          text: "OK",
          onPress: () => router.push("/my-orders"),
        },
      ]
    );
  };

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
          <Text className="text-white text-xl font-bold">Checkout</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Information */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MapPin size={20} color="#3b82f6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Delivery Information
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-1">Full Name</Text>
            <TextInput
              value={deliveryInfo.name}
              onChangeText={(text) => handleInputChange("name", text)}
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
            />
          </View>

          <View className="mb-3">
            <Text className="text-gray-600 text-sm mb-1">Address</Text>
            <TextInput
              value={deliveryInfo.address}
              onChangeText={(text) => handleInputChange("address", text)}
              className="border border-gray-300 rounded-lg p-3 bg-gray-50"
            />
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">City</Text>
              <TextInput
                value={deliveryInfo.city}
                onChangeText={(text) => handleInputChange("city", text)}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">State</Text>
              <TextInput
                value={deliveryInfo.state}
                onChangeText={(text) => handleInputChange("state", text)}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">ZIP Code</Text>
              <TextInput
                value={deliveryInfo.zipCode}
                onChangeText={(text) => handleInputChange("zipCode", text)}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">Phone</Text>
              <TextInput
                value={deliveryInfo.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <CreditCard size={20} color="#3b82f6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Payment Method
            </Text>
          </View>

          <View className="flex-row items-center mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <View className="w-10 h-10 rounded-full bg-green-600 items-center justify-center mr-3">
              <Wallet size={20} color="white" />
            </View>
            <View>
              <Text className="text-gray-800 font-medium">
                Cash on Delivery
              </Text>
              <Text className="text-gray-600 text-sm">
                Pay with cash when your order is delivered
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Truck size={20} color="#3b82f6" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Order Summary
            </Text>
          </View>

          <View className="border-b border-gray-200 pb-2 mb-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">
                Items ({orderSummary.items})
              </Text>
              <Text className="text-gray-800">₹{orderSummary.subtotal}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className="text-gray-800">₹{orderSummary.deliveryFee}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Discount</Text>
              <Text className="text-green-600">-₹{orderSummary.discount}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-lg font-semibold text-gray-800">Total</Text>
            <Text className="text-xl font-bold" style={{ color: '#B27E4C' }}>
              ₹{orderSummary.total}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="p-4 bg-white border-t border-gray-200 pb-24">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className="py-4 rounded-lg items-center flex-row justify-center"
          style={{ backgroundColor: '#B27E4C' }}
        >
          <CheckCircle size={20} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            Place Order
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <BuyerBottomNav activeTab="home" />
      </View>
    </View>
  );
}
