import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { Crop, cropService } from '@/services/crop-service';
import { useRouter } from 'expo-router';
import { ArrowLeft, Filter, MessageCircle, Phone, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch crops on mount
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      console.log('🌾 [NEARBY-CROPS] Fetching crops...');

      // Fetch all crops (no status filter to show all available crops)
      const fetchedCrops = await cropService.getAllCrops();

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
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('buyer.nearbyCrops')}</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
            <Filter color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-3">
          <Search size={20} color="white" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder={t('buyer.searchForCrops')}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
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
          </View>
        ) : (
          <View className="space-y-4">
            {filteredCrops.map((crop) => (
            <View
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
                      onPress={() => handleCall(crop.farmer!.phone)}
                      className="flex-1 flex-row items-center justify-center rounded-full py-3 bg-green-600"
                    >
                      <Phone size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        {t('common.call')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleMessage(
                        crop.farmer!.id,
                        crop.farmer!.full_name,
                        crop.farmer!.profile_image_url,
                        crop.name
                      )}
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
            </View>
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