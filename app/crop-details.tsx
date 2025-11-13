import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Home,
    MessageCircle,
    Share2,
    ShoppingCart,
    Star,
    User
} from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const mockCropDetails = {
  id: 1,
  name: "Organic Heirloom Tomatoes",
  description:
    "These heirloom tomatoes are grown organically on a small family farm, known for their rich flavor and vibrant colors. They are perfect for salads, sauces, or enjoying fresh.",
  origin:
    "Grown in the fertile valleys of Sonoma County, California, these tomatoes benefit from the region's ideal climate and sustainable farming practices.",
  farmer: {
    name: "Ethan Carter",
    location: "Sonoma County, CA",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60",
  },
  availability: {
    quantity: "50 lbs",
    price: "$2.50/lb",
  },
  rating: 4.8,
  reviewCount: 125,
  ratingDistribution: [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Sophia Bennett",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
        date: "2 weeks ago",
      },
      rating: 5,
      comment:
        "These tomatoes are absolutely delicious! The flavor is so much richer than store-bought tomatoes. I highly recommend them.",
    },
    {
      id: 2,
      user: {
        name: "Liam Harper",
        image:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=60",
        date: "1 month ago",
      },
      rating: 4,
      comment:
        "Great quality tomatoes, though a bit pricey. They were perfect for my caprese salad.",
    },
  ],
};

export default function CropDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? "#7C8B3A" : "#e5e7eb"}
        fill={index < rating ? "#7C8B3A" : "none"}
      />
    ));
  };

  const handleCall = () => {
    const phoneNumber = '+1234567890'; // Replace with actual farmer phone
    Alert.alert(
      t('common.call'),
      t('common.calling') + ' farmer',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.call'), onPress: () => Linking.openURL(`tel:${phoneNumber}`) }
      ]
    );
  };

  const handleMessageFarmer = () => {
    router.push({
      pathname: '/chat-screen',
      params: { userId: 1, userName: 'Farmer Name', userType: 'farmer' }
    });
  };

  const handleAddToCart = () => {
    Alert.alert(t('common.success'), t('crops.cropAddedToCart'));
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
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            accessibilityLabel={t('common.goBack')}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('crops.cropDetails')}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert(t('common.share'), t('crops.sharingCropDetails'))}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <Share2 color="white" size={24} />
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 text-center">
          {t('crops.viewDetailedInfo')}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Crop Information */}
        <View className="p-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900">
            {mockCropDetails.name}
          </Text>
          <Text className="mt-2 text-gray-600 leading-6">
            {mockCropDetails.description}
          </Text>
        </View>

        {/* Origin */}
        <View className="mt-2 p-4 bg-white">
          <Text className="text-lg font-semibold text-gray-900">{t('crops.origin')}</Text>
          <Text className="mt-2 text-gray-600 leading-6">
            {mockCropDetails.origin}
          </Text>
        </View>

        {/* Farmer */}
        <View className="mt-2 p-4 bg-white">
          <Text className="text-lg font-semibold text-gray-900">{t('common.farmer')}</Text>
          <View className="flex-row items-center mt-3">
            <Image
              source={{ uri: mockCropDetails.farmer.image }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-gray-900 font-medium">
                {mockCropDetails.farmer.name}
              </Text>
              <Text className="text-gray-500">
                {mockCropDetails.farmer.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Availability */}
        <View className="mt-2 p-4 bg-white">
          <Text className="text-lg font-semibold text-gray-900">
            {t('crops.availability')}
          </Text>
          <View className="mt-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">{t('crops.quantity')}</Text>
              <Text className="text-gray-900 font-medium">
                {mockCropDetails.availability.quantity}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-600">{t('crops.price')}</Text>
              <Text className="text-blue-600 font-semibold text-lg">
                {mockCropDetails.availability.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View className="mt-2 p-4 bg-white">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-900">
              {t('crops.reviews')} ({mockCropDetails.reviewCount})
            </Text>
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-gray-900 mr-2">
                {mockCropDetails.rating}
              </Text>
              <View className="flex-row">
                {renderStars(Math.floor(mockCropDetails.rating))}
              </View>
            </View>
          </View>

          {/* Rating Distribution */}
          <View className="mt-4">
            {mockCropDetails.ratingDistribution.map((item) => (
              <View key={item.stars} className="flex-row items-center mt-2">
                <Text className="w-8 text-gray-600">{item.stars}★</Text>
                <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                  <View
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </View>
                <Text className="w-8 text-gray-600">{item.percentage}%</Text>
              </View>
            ))}
          </View>

          {/* Review List */}
          <View className="mt-6">
            {mockCropDetails.reviews.map((review) => (
              <View
                key={review.id}
                className="mt-4 border-t border-gray-100 pt-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: review.user.image }}
                      className="w-10 h-10 rounded-full"
                    />
                    <View className="ml-3">
                      <Text className="text-gray-900 font-medium">
                        {review.user.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {review.user.date}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row">{renderStars(review.rating)}</View>
                </View>
                <Text className="mt-2 text-gray-600">{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={handleCall}
            className="flex-1 bg-green-600 rounded-full py-3 items-center flex-row justify-center"
          >
            <Phone size={18} color="white" />
            <Text className="text-white font-semibold ml-2">{t('common.call')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleMessageFarmer}
            className="flex-1 bg-blue-600 rounded-full py-3 items-center flex-row justify-center"
          >
            <MessageCircle size={18} color="white" />
            <Text className="text-white font-semibold ml-2">{t('common.message')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 bg-blue-600 rounded-full py-3 items-center flex-row justify-center"
          >
            <ShoppingCart size={18} color="white" />
            <Text className="text-white font-semibold ml-2">{t('crops.addCart')}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View className="flex-row items-center justify-around py-2 border-t border-gray-100">
          <TouchableOpacity
            onPress={() => router.push("/farmer-home")}
            className="items-center"
          >
            <Home size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 mt-1">{t('common.home')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/my-farms")}
            className="items-center"
          >
            <ShoppingCart size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 mt-1">{t('farms.myFarms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/messages")}
            className="items-center"
          >
            <MessageCircle size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 mt-1">{t('common.messages')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="items-center"
          >
            <User size={24} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 mt-1">{t('common.profile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Safe Area Spacing for iOS */}
        <View className="h-3" />
      </View>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}
