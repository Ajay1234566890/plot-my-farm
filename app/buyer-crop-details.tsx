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
import { useState } from "react";
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

export default function BuyerCropDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Parse params
  const cropData = {
    id: params.id,
    name: params.name as string || "Crop Name",
    description: params.description as string || "No description available.",
    origin: params.origin as string || params.location as string || "Unknown Origin",
    image: params.image ? (typeof params.image === 'string' ? { uri: params.image } : params.image) : { uri: "https://via.placeholder.com/400" },
    price: params.price as string || "₹0/kg",
    quantity: params.quantity as string || "Available",
    quality: params.quality as string || "Standard",
    rating: params.rating ? parseFloat(params.rating as string) : 4.5,
    reviewCount: params.reviewCount ? parseInt(params.reviewCount as string) : 0,
    farmer: {
      id: params.farmerId as string,
      name: params.farmerName as string || "Unknown Farmer",
      location: params.farmerLocation as string || params.location as string || "Unknown Location",
      image: params.farmerImage ? { uri: params.farmerImage as string } : { uri: "https://via.placeholder.com/150" },
      phone: params.farmerPhone as string,
    }
  };

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
    const phoneNumber = cropData.farmer.phone;
    if (phoneNumber) {
      Alert.alert(
        t('common.call'),
        `${t('common.calling')} ${cropData.farmer.name}?`,
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.call'), onPress: () => Linking.openURL(`tel:${phoneNumber}`) }
        ]
      );
    } else {
      Alert.alert(t('common.error'), t('errors.phoneNotAvailable'));
    }
  };

  const handleMessageFarmer = () => {
    router.push({
      pathname: "/buyer-chat-screen",
      params: {
        userId: cropData.farmer.id,
        userName: cropData.farmer.name,
        userAvatar: typeof cropData.farmer.image === 'object' && 'uri' in cropData.farmer.image ? cropData.farmer.image.uri : '',
        cropName: cropData.name
      }
    });
  };

  const handleAddToCart = () => {
    Alert.alert(
      t('common.success'),
      t('buyer.addedToCart'),
      [{ text: t('common.ok') }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      t('common.share'),
      t('buyer.shareCrop'),
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
          <Text className="text-xl font-bold text-white" numberOfLines={1} style={{ maxWidth: '60%' }}>
            {cropData.name}
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
              source={cropData.image}
              className="w-full h-64 rounded-3xl"
              resizeMode="cover"
            />
            {/* Quality Badge */}
            <View className="absolute top-4 left-4 bg-green-500 px-4 py-2 rounded-full">
              <Text className="text-white font-bold">{cropData.quality}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Title and Price */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {cropData.name}
              </Text>
              <View className="flex-row items-center">
                {renderStars(cropData.rating)}
                <Text className="ml-2 text-gray-600">
                  {cropData.rating} ({cropData.reviewCount} {t('common.reviews')})
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-3xl font-bold" style={{ color: '#B27E4C' }}>
                {cropData.price}
              </Text>
              <Text className="text-gray-500">{cropData.quantity}</Text>
            </View>
          </View>

          {/* Farmer Info */}
          <TouchableOpacity
            className="flex-row items-center bg-gray-50 rounded-2xl p-4 mb-6"
            onPress={() => router.push({
              pathname: "/nearby-farmers", // Or farmer details if available
              params: { selectedFarmerId: cropData.farmer.id }
            })}
          >
            <Image
              source={cropData.farmer.image}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {cropData.farmer.name}
              </Text>
              <Text className="text-gray-600">{cropData.farmer.location}</Text>
            </View>
            <ArrowLeft size={20} color="#B27E4C" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              {t('common.description')}
            </Text>
            <Text className="text-gray-700 leading-6">
              {cropData.description}
            </Text>
          </View>

          {/* Origin */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              {t('common.origin')}
            </Text>
            <Text className="text-gray-700 leading-6">
              {cropData.origin}
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
              {t('buyer.addToCart')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
