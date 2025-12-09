import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { Crop, cropService } from '@/services/crop-service';
import { useRouter } from 'expo-router';
import { MessageCircle, Phone, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function NearbyCrops() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch crops on mount and when user changes
  useEffect(() => {
    fetchCrops();
  }, [user]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      console.log('🌾 [NEARBY-CROPS] Fetching location-based crops...');

      // Get user location from user metadata
      const userLocation = user?.user_metadata?.latitude && user?.user_metadata?.longitude
        ? {
          latitude: user.user_metadata.latitude,
          longitude: user.user_metadata.longitude
        }
        : null;

      let fetchedCrops: Crop[];

      if (userLocation) {
        // Fetch nearby crops based on user location (50km radius)
        console.log('📍 [NEARBY-CROPS] Using user location:', userLocation);
        fetchedCrops = await cropService.getNearbyCrops(userLocation, 50000);
      } else {
        // Fallback to all crops if no location available
        console.log('⚠️ [NEARBY-CROPS] No user location, fetching all crops');
        fetchedCrops = await cropService.getAllCrops();
      }

      console.log(`✅ [NEARBY-CROPS] Fetched ${fetchedCrops.length} crops`);
      setCrops(fetchedCrops);
    } catch (error) {
      console.error('❌ [NEARBY-CROPS] Error fetching crops:', error);
      Alert.alert(t('common.error'), 'Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert(t('common.error'), 'Phone number not available');
    }
  };

  const handleMessage = (farmerId: string, farmerName: string, farmerAvatar: string | null, cropName: string) => {
    // Navigate to in-app chat screen
    router.push({
      pathname: '/buyer-chat-screen',
      params: {
        userId: farmerId,
        userName: farmerName,
        userAvatar: farmerAvatar || 'https://via.placeholder.com/150',
        userRole: 'Farmer',
        cropName: cropName, // Pass crop name for context
      }
    });
  };

  // Filter crops based on search query
  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.crop_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <View className="flex-row items-center mb-4">
          <Text className="text-xl font-bold text-white">{t('buyer.nearbyCrops')}</Text>
        </View>

        {/* Search Bar - Matching buyer-home.tsx styling */}
        <View
          style={{
            backgroundColor: 'transparent',
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <Search size={18} color="#FFFFFF" />
          <TextInput
            placeholder={t('buyer.searchForCrops')}
            placeholderTextColor="rgba(255, 255, 255, 0.9)"
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: 'white',
              backgroundColor: 'transparent'
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Crop Listings */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#B27E4C" />
            <Text className="text-gray-500 mt-4">{t('common.loading')}</Text>
          </View>
        ) : filteredCrops.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">{t('buyer.noCropsFound')}</Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-6">
              {userLocation ? t('buyer.noCropsNearby') : t('buyer.enableLocationForNearbyCrops')}
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {filteredCrops.map((crop) => (
              <TouchableOpacity
                key={crop.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{
                  shadowColor: '#B27E4C',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: '#B27E4C10'
                }}
                onPress={() => router.push({
                  pathname: "/buyer-crop-details",
                  params: {
                    id: crop.id,
                    name: crop.name,
                    price: `₹${crop.price_per_unit}/${crop.unit}`,
                    quantity: `${crop.quantity} ${crop.unit}`,
                    farmerName: crop.farmer?.full_name,
                    farmerId: crop.farmer?.id,
                    farmerImage: crop.farmer?.profile_image_url,
                    farmerPhone: crop.farmer?.phone,
                    farmerLocation: crop.location,
                    image: crop.image_url,
                    description: crop.description || "No description available.",
                    quality: "Standard", // Assuming standard if not provided
                    rating: 4.5, // Mock rating if not in API
                    reviewCount: 10,
                    location: crop.location
                  }
                })}
              >
                {crop.image_url && (
                  <Image
                    source={{ uri: crop.image_url }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">
                        {crop.name}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {t('buyer.by')} {crop.farmer?.full_name || 'Unknown Farmer'}
                      </Text>
                      {crop.location && (
                        <Text className="text-xs text-gray-400 mt-1">
                          📍 {crop.location}
                        </Text>
                      )}
                      {(crop as any).distanceFormatted && (
                        <Text className="text-xs font-medium mt-1" style={{ color: '#B27E4C' }}>
                          📏 {(crop as any).distanceFormatted} away
                        </Text>
                      )}
                    </View>
                    <Text className="text-lg font-bold" style={{ color: '#B27E4C' }}>
                      ₹{crop.price_per_unit}/{crop.unit}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 mt-1">
                    {crop.quantity} {crop.unit} available
                  </Text>

                  {/* Contact Buttons */}
                  {crop.farmer && (
                    <View className="flex-row gap-2 mt-3">
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCall(crop.farmer!.phone);
                        }}
                        className="flex-1 flex-row items-center justify-center rounded-full py-3 bg-green-600"
                      >
                        <Phone size={18} color="white" />
                        <Text className="text-white font-semibold ml-2">
                          {t('common.call')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleMessage(
                            crop.farmer!.id,
                            crop.farmer!.full_name,
                            crop.farmer!.profile_image_url,
                            crop.name
                          );
                        }}
                        className="flex-1 flex-row items-center justify-center rounded-full py-3"
                        style={{ backgroundColor: '#B27E4C' }}
                      >
                        <MessageCircle size={18} color="white" />
                        <Text className="text-white font-semibold ml-2">
                          {t('common.message')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View className="h-6" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="crops" />
    </View>
  );
}