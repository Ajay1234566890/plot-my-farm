import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import {
    ArrowLeft,
    Clock,
    Home,
    MapPin,
    MessageCircle,
    MessageSquare,
    Mic,
    Phone,
    Sprout,
    Star,
    User,
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

export default function FarmerDetails() {
  // Mock data for the farmer
  const farmer = {
    id: 1,
    name: "Green Valley",
    description: "Fresh fruits & poultry",
    rating: 4.9,
    reviews: 210,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    products: [
      {
        id: 1,
        name: "Apples",
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Chicken",
        image:
          "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&auto=format&fit=crop",
      },
      {
        id: 3,
        name: "Eggs",
        image:
          "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop",
      },
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah L.",
        comment: "The best organic apples I've ever had! So fresh and juicy.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Mike T.",
        comment:
          "Green Valley's chicken is top-notch. Highly recommend their farm.",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop",
      },
    ],
    contact: {
      phone: "+1 (234) 567-890",
      address: "123 Green Valley Rd, Farmville, CA",
      distance: "3.1 km away",
    },
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
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mb-4"
          onPress={() => {
            /* Add navigation logic */
          }}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold text-center">
          Farmer Details
        </Text>
        <Text className="text-white/80 text-center mt-2">
          View farmer profile and products
        </Text>
      </View>

      {/* Profile Section */}
      <View className="px-6 -mt-4">
        <View
          className="bg-white rounded-3xl p-6 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="items-center">
            <Image
              source={{ uri: farmer.avatar }}
              className="w-24 h-24 rounded-full -mt-16"
              style={{ borderWidth: 4, borderColor: '#7C8B3A' }}
              resizeMode="cover"
            />
            <Text className="text-2xl font-bold text-gray-900 mt-4">
              {farmer.name}
            </Text>
            <Text className="text-gray-600 text-base">
              {farmer.description}
            </Text>
            <View className="flex-row items-center mt-3">
              <Star size={20} color="#FBBF24" fill="#FBBF24" />
              <Text className="text-lg font-semibold ml-1" style={{ color: '#7C8B3A' }}>
                {farmer.rating}
              </Text>
              <Text className="text-gray-500 ml-1">
                ({farmer.reviews} reviews)
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Products Section */}
        <View className="mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Products</Text>
          <View className="flex-row gap-4">
            {farmer.products.map((product) => (
              <View
                key={product.id}
                className="flex-1 bg-white rounded-2xl overflow-hidden shadow-md"
              >
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-24"
                  resizeMode="cover"
                />
                <Text className="text-center py-3 font-medium text-gray-800">
                  {product.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Reviews</Text>
          {farmer.reviews.map((review) => (
            <View
              key={review.id}
              className="bg-white p-4 rounded-2xl mb-4 shadow-md"
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: review.avatar }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
                <View className="ml-3">
                  <Text className="font-semibold text-gray-900">
                    {review.name}
                  </Text>
                  <Text className="text-gray-600 mt-1">{review.comment}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View className="mt-8 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Contact Information
          </Text>
          <View className="bg-white p-4 rounded-2xl shadow-md">
            <View className="flex-row items-center mb-4">
              <Phone size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">{farmer.contact.phone}</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <MapPin size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">
                {farmer.contact.address}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">
                {farmer.contact.distance}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-4 py-4 bg-white border-t border-gray-100">
        <View className="flex-row gap-4">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-green-600 rounded-xl py-4">
            <Phone size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-xl py-4">
            <MessageSquare size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
          {/* Home Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="Home tab"
            accessibilityRole="tab"
          >
            <Home size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Home</Text>
          </TouchableOpacity>

          {/* My Farms Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="My Farms tab"
            accessibilityRole="tab"
          >
            <Sprout size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Crops</Text>
          </TouchableOpacity>

          {/* Mic Button */}
          <TouchableOpacity
            className="items-center justify-center -mt-5 bg-blue-500 rounded-full w-14 h-14 shadow-lg"
            accessibilityLabel="Voice command"
            accessibilityRole="button"
          >
            <Mic size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Messages Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="Messages tab"
            accessibilityRole="tab"
          >
            <MessageCircle size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Orders</Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel="Profile tab"
            accessibilityRole="tab"
          >
            <User size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Safe Area Spacing for iOS */}
        <View className="h-[12px] bg-white" />
      </View>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="profile" />
    </View>
  );
}
