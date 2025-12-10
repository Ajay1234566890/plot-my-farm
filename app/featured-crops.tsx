import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { Crop, cropService } from '@/services/crop-service';
import { locationService } from '@/services/location-service';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Search, Star } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FeaturedCropsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeaturedCrops = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🌾 [FEATURED] Loading featured crops...');

      let fetchedCrops: Crop[] = [];

      try {
        // Try to get location for nearby crops
        const location = await locationService.getCurrentLocation(true);
        if (location) {
          fetchedCrops = await cropService.getNearbyCrops(location.coordinates);
        }
      } catch (locError) {
        console.warn('⚠️ [FEATURED] Could not get location, fetching all crops instead:', locError);
        // Fallback to all crops
        fetchedCrops = await cropService.getAllCrops();
      }

      // If no crops found via nearby (or location failed/denied), ensure we have something
      if (fetchedCrops.length === 0) {
        fetchedCrops = await cropService.getAllCrops();
      }

      setCrops(fetchedCrops);
    } catch (error) {
      console.error('❌ [FEATURED] Error loading crops:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFeaturedCrops();
    }, [loadFeaturedCrops])
  );

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.farmer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCropCard = ({ item }: { item: Crop }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4"
      style={{
        shadowColor: '#B27E4C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#B27E4C20'
      }}
      onPress={() => router.push({
        pathname: "/buyer-crop-details",
        params: {
          cropId: item.id,
          id: item.id
        }
      })}
    >
      <View className="relative">
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-48 rounded-xl mb-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 rounded-xl mb-3 bg-gray-200 items-center justify-center">
            <Image
              source={require('@/assets/images/icon.png')} // Fallback if available, or just icon
              style={{ width: 64, height: 64, opacity: 0.3 }}
            />
          </View>
        )}

        <TouchableOpacity
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
          onPress={(e) => {
            e.stopPropagation();
            // Handle favorite action
          }}
        >
          <Heart size={20} color="#B27E4C" fill="white" />
        </TouchableOpacity>
        {item.certification && (
          <View className="absolute bottom-5 left-2 bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">{item.certification}</Text>
          </View>
        )}
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-1">{item.name}</Text>
      <Text className="text-gray-600 text-sm mb-2">
        {item.farmer?.full_name || 'Unknown Farmer'} • {item.location || 'Unknown Location'}
      </Text>

      <View className="flex-row items-center mb-2">
        <View className="flex-row items-center mr-3">
          <Star size={16} color="#FFA500" fill="#FFA500" />
          <Text className="text-gray-700 ml-1 font-semibold">4.8</Text>
          <Text className="text-gray-500 text-xs ml-1">(12)</Text>
        </View>
        <Text className="text-gray-500 text-sm">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold" style={{ color: '#B27E4C' }}>
            ₹{item.price_per_unit}/{item.unit}
          </Text>
          <Text className="text-gray-500 text-sm">
            {item.quantity} {item.unit} available
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header */}
      <View
        className="px-6 pt-12 pb-6"
        style={{
          backgroundColor: '#B27E4C',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            {t('featured.title') || 'Featured Crops'}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/90 rounded-full px-4 py-3">
          <Search size={20} color="#B27E4C" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder={t('common.searchPlaceholder') || "Search crops, farmers, location..."}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Crops List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B27E4C" />
        </View>
      ) : (
        <FlatList
          data={filteredCrops}
          renderItem={renderCropCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-gray-600 text-center text-lg">
                {t('featured.noCrops') || 'No crops found'}
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                {t('featured.tryAdjusting') || 'Try adjusting your search'}
              </Text>
            </View>
          }
        />
      )}

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
