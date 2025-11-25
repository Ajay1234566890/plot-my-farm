import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Phone,
    Share2,
    ShoppingCart,
    Star
} from "lucide-react-native";
import React, { useState } from "react";
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
    "Grown in the fertile valleys of Punjab, India, these tomatoes benefit from the region's ideal climate and sustainable farming practices.",
  farmer: {
    name: "Rajesh Kumar",
    location: "Punjab, India",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60",
  },
  availability: {
    quantity: "50 kg",
    price: "₹45/kg",
  },
  rating: 4.8,
  reviewCount: 125,
  quality: "Grade A",
  harvestDate: "2 days ago",
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

export default function BuyerCropDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? "#B27E4C" : "#e5e7eb"}
        fill={index < rating ? "#B27E4C" : "none"}
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
      pathname: "/buyer-messages",
      params: { farmerId: mockCropDetails.farmer.name }
    });
  };

  const handleAddToCart = () => {
    Alert.alert(
      t('common.success'),
      'Added to cart successfully!',
      [{ text: t('common.ok') }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      t('common.share'),
      'Share this crop with others',
      [{ text: t('common.cancel'), style: 'cancel' }]
    );
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-6"
        style={{
          backgroundColor: '#B27E4C',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">
            Crop Details
          </Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={handleToggleFavorite}
          >
            <Heart size={24} color="white" fill={isFavorite ? "white" : "none"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Crop Image */}
        <View className="px-6 pt-6">
          <View className="relative">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1518972559376-f5f715166441?w=800",
              }}
              className="w-full h-64 rounded-3xl"
            />
            {/* Quality Badge */}
            <View className="absolute top-4 left-4 bg-green-500 px-4 py-2 rounded-full">
              <Text className="text-white font-bold">{mockCropDetails.quality}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Title and Price */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {mockCropDetails.name}
              </Text>
              <View className="flex-row items-center">
                {renderStars(mockCropDetails.rating)}
                <Text className="ml-2 text-gray-600">
                  {mockCropDetails.rating} ({mockCropDetails.reviewCount} {t('common.reviews')})
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-3xl font-bold" style={{ color: '#B27E4C' }}>
                {mockCropDetails.availability.price}
              </Text>
              <Text className="text-gray-500">{mockCropDetails.availability.quantity} available</Text>
            </View>
          </View>

          {/* Farmer Info */}
          <TouchableOpacity
            className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-6"
            onPress={() => router.push({
              pathname: "/farmer-details",
              params: { farmerId: "1" }
            })}
          >
            <Image
              source={{ uri: mockCropDetails.farmer.image }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {mockCropDetails.farmer.name}
              </Text>
              <Text className="text-gray-600">{mockCropDetails.farmer.location}</Text>
              <Text className="text-gray-500 text-sm mt-1">Harvested {mockCropDetails.harvestDate}</Text>
            </View>
            <ArrowLeft size={20} color="#B27E4C" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              {t('common.description')}
            </Text>
            <Text className="text-gray-700 leading-6">
              {mockCropDetails.description}
            </Text>
          </View>

          {/* Origin */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              {t('common.origin')}
            </Text>
            <Text className="text-gray-700 leading-6">
              {mockCropDetails.origin}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mb-6">
            <TouchableOpacity
              onPress={handleCall}
              className="flex-1 rounded-full py-4 items-center flex-row justify-center"
              style={{ backgroundColor: '#B27E4C' }}
            >
              <Phone size={18} color="white" />
              <Text className="text-white font-semibold ml-2">{t('common.call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleMessageFarmer}
              className="flex-1 rounded-full py-4 items-center flex-row justify-center border-2"
              style={{ borderColor: '#B27E4C' }}
            >
              <MessageCircle size={18} color="#B27E4C" />
              <Text className="font-semibold ml-2" style={{ color: '#B27E4C' }}>{t('common.message')}</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              {t('common.reviews')}
            </Text>

            {/* Rating Distribution */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              {mockCropDetails.ratingDistribution.map((item) => (
                <View key={item.stars} className="flex-row items-center mb-2">
                  <Text className="text-gray-700 w-12">{item.stars} ★</Text>
                  <View className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                    <View
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: '#B27E4C',
                      }}
                    />
                  </View>
                  <Text className="text-gray-600 w-12 text-right">{item.percentage}%</Text>
                </View>
              ))}
            </View>

            {/* Individual Reviews */}
            {mockCropDetails.reviews.map((review) => (
              <View
                key={review.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 mb-4"
              >
                <View className="flex-row items-start mb-3">
                  <Image
                    source={{ uri: review.user.image }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900">{review.user.name}</Text>
                    <Text className="text-gray-500 text-sm">{review.user.date}</Text>
                  </View>
                  <View className="flex-row">{renderStars(review.rating)}</View>
                </View>
                <Text className="text-gray-700 leading-5">{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="px-6 py-4 bg-white border-t border-gray-200"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <View className="flex-row gap-3 mb-20">
          <TouchableOpacity
            onPress={handleShare}
            className="w-14 h-14 items-center justify-center rounded-full border-2"
            style={{ borderColor: '#B27E4C' }}
          >
            <Share2 size={24} color="#B27E4C" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 rounded-full py-4 items-center flex-row justify-center"
            style={{ backgroundColor: '#B27E4C' }}
          >
            <ShoppingCart size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}

