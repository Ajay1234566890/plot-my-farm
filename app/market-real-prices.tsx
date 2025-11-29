import { useAuth } from '@/contexts/auth-context';
import { locationService } from '@/services/location-service';
import { MarketPrice, marketPricesService } from '@/services/market-prices-service';
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin, RefreshCw, Search, TrendingDown, TrendingUp } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BuyerBottomNav from './components/BuyerBottomNav';
import FarmerBottomNav from './components/FarmerBottomNav';

// Crop image mapping function with fuzzy matching
const getCropImage = (commodityName: string) => {
  // Normalize the commodity name
  const normalized = commodityName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove spaces, symbols, etc.
    .trim();

  // Mapping object with normalized keys
  const cropImageMap: { [key: string]: any } = {
    // Exact matches
    'tomato': require('@/assets/images/market/tomato.jpg'),
    'tomatoes': require('@/assets/images/market/tomato.jpg'),
    'tomatolocal': require('@/assets/images/market/tomato.jpg'),
    'tomatohybrid': require('@/assets/images/market/tomato.jpg'),

    'onion': require('@/assets/images/market/onion.jpg'),
    'onions': require('@/assets/images/market/onion.jpg'),
    'onionlocal': require('@/assets/images/market/onion.jpg'),
    'onionred': require('@/assets/images/market/onion.jpg'),

    'beetroot': require('@/assets/images/market/beetroot.jpg'),
    'beet': require('@/assets/images/market/beetroot.jpg'),

    'bengalgram': require('@/assets/images/market/bengal_gram.jpg'),
    'gram': require('@/assets/images/market/bengal_gram.jpg'),
    'chana': require('@/assets/images/market/bengal_gram.jpg'),

    'betelnut': require('@/assets/images/market/betelnut.jpg'),
    'arecanut': require('@/assets/images/market/betelnut.jpg'),
    'supari': require('@/assets/images/market/betelnut.jpg'),

    'bottlegourd': require('@/assets/images/market/bottle_gourd.jpg'),
    'lauki': require('@/assets/images/market/bottle_gourd.jpg'),
    'doodhi': require('@/assets/images/market/bottle_gourd.jpg'),

    'brinjal': require('@/assets/images/market/brinjal.jpg'),
    'eggplant': require('@/assets/images/market/brinjal.jpg'),
    'baingan': require('@/assets/images/market/brinjal.jpg'),
    'aubergine': require('@/assets/images/market/brinjal.jpg'),

    'cauliflower': require('@/assets/images/market/cauliflower.jpg'),
    'gobi': require('@/assets/images/market/cauliflower.jpg'),

    'coconut': require('@/assets/images/market/coconut.jpg'),
    'nariyal': require('@/assets/images/market/coconut.jpg'),

    'tendercoconut': require('@/assets/images/market/tender_coconut.jpg'),
    'youngcoconut': require('@/assets/images/market/tender_coconut.jpg'),

    'cotton': require('@/assets/images/market/cotton.jpg'),
    'kapas': require('@/assets/images/market/cotton.jpg'),

    'cucumber': require('@/assets/images/market/cucumber.jpg'),
    'kheera': require('@/assets/images/market/cucumber.jpg'),

    'drychillies': require('@/assets/images/market/dry_chillies.jpg'),
    'drychilli': require('@/assets/images/market/dry_chillies.jpg'),
    'redchilli': require('@/assets/images/market/dry_chillies.jpg'),
    'chilli': require('@/assets/images/market/dry_chillies.jpg'),
    'chili': require('@/assets/images/market/dry_chillies.jpg'),

    'elephantyam': require('@/assets/images/market/elephant_yam.jpg'),
    'suran': require('@/assets/images/market/elephant_yam.jpg'),
    'yam': require('@/assets/images/market/elephant_yam.jpg'),

    'ginger': require('@/assets/images/market/ginger.jpg'),
    'adrak': require('@/assets/images/market/ginger.jpg'),

    'ladiesfinger': require('@/assets/images/market/ladies_finger.jpg'),
    'okra': require('@/assets/images/market/ladies_finger.jpg'),
    'bhindi': require('@/assets/images/market/ladies_finger.jpg'),

    'littlegourd': require('@/assets/images/market/little_gourd_kundru.jpg'),
    'kundru': require('@/assets/images/market/little_gourd_kundru.jpg'),
    'tindora': require('@/assets/images/market/little_gourd_kundru.jpg'),

    'pomegranate': require('@/assets/images/market/pomogranate.jpg'),
    'pomogranate': require('@/assets/images/market/pomogranate.jpg'),
    'anar': require('@/assets/images/market/pomogranate.jpg'),

    'radish': require('@/assets/images/market/radish.jpg'),
    'mooli': require('@/assets/images/market/radish.jpg'),

    'ridgegourd': require('@/assets/images/market/ridge_gourd.jpg'),
    'turai': require('@/assets/images/market/ridge_gourd.jpg'),
    'tori': require('@/assets/images/market/ridge_gourd.jpg'),

    'turmeric': require('@/assets/images/market/turmeric.jpg'),
    'haldi': require('@/assets/images/market/turmeric.jpg'),
  };

  // Try exact match first
  if (cropImageMap[normalized]) {
    return cropImageMap[normalized];
  }

  // Try substring matching for partial matches
  for (const [key, image] of Object.entries(cropImageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return image;
    }
  }

  // Default fallback image
  return require('@/assets/images/market/tomato.jpg');
};

export default function MarketRealPrices() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('India');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch market prices on mount
  useEffect(() => {
    loadMarketPrices();
  }, []);

  const loadMarketPrices = async () => {
    try {
      setLoading(true);

      // Get user location
      try {
        const location = await locationService.getCurrentLocation(true);
        setUserLocation(`${location.address.city || location.address.region || 'India'}`);
      } catch (error) {
        console.log('Could not get location, using all India');
      }

      // Fetch prices with location
      const prices = await marketPricesService.getMarketPricesWithLocation(100);

      // Map images to crops
      const pricesWithImages = prices.map(price => ({
        ...price,
        image: getCropImage(price.commodity)
      }));

      setMarketPrices(pricesWithImages);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading market prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMarketPrices();
    setRefreshing(false);
  };

  const filteredCrops = marketPrices.filter(crop =>
    crop.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (crop.variety && crop.variety.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTimeAgo = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return t('common.secondsAgo', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('common.minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    return t('common.hoursAgo', { count: hours });
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
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">
              {t('buyer.marketRealPrices')}
            </Text>
            <View className="flex-row items-center mt-1">
              <MapPin size={14} color="white" />
              <Text className="text-white/80 text-sm ml-1">
                {userLocation}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <RefreshCw color="white" size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#64748b" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder={t('buyer.searchForCrops')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Last Updated */}
      <View className="px-4 py-2 flex-row justify-between items-center">
        <Text className="text-gray-500 text-sm">
          {t('buyer.updated')} {getTimeAgo()}
        </Text>
        <Text className="text-gray-500 text-sm">
          {t('buyer.items', { count: filteredCrops.length })}
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C8B3A" />
          <Text className="text-gray-500 mt-4">{t('buyer.loadingMarketPrices')}</Text>
        </View>
      ) : filteredCrops.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-lg text-center">
            {searchQuery ? t('buyer.noCropsFound') : t('buyer.noMarketPrices')}
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-full"
            style={{ backgroundColor: '#7C8B3A' }}
            onPress={handleRefresh}
          >
            <Text className="text-white font-semibold">{t('common.refresh')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {filteredCrops.map((crop) => (
            <View
              key={crop.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
            >
              <Image
                source={crop.image}
                className="w-16 h-16 rounded-lg"
              />
              <View className="flex-1 ml-4">
                <Text className="text-gray-800 text-lg font-medium">
                  {crop.commodity}
                </Text>
                {crop.variety && (
                  <Text className="text-gray-400 text-xs">
                    {crop.variety}
                  </Text>
                )}
                <View className="flex-row items-center mt-1">
                  <MapPin size={12} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-1">
                    {crop.market}, {crop.state}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-gray-800 text-lg font-semibold">
                  ₹{crop.modalPrice}/{crop.unit}
                </Text>
                <Text className="text-gray-400 text-xs">
                  ₹{crop.minPrice}-₹{crop.maxPrice}
                </Text>
                {crop.trend && (
                  <View className="flex-row items-center mt-1">
                    {crop.trend === 'up' ? (
                      <>
                        <TrendingUp size={14} color="#22c55e" />
                        <Text className="text-green-500 text-xs ml-1">
                          {crop.priceChange ? `+${crop.priceChange.toFixed(1)}%` : t('buyer.up')}
                        </Text>
                      </>
                    ) : crop.trend === 'down' ? (
                      <>
                        <TrendingDown size={14} color="#ef4444" />
                        <Text className="text-red-500 text-xs ml-1">
                          {crop.priceChange ? `${crop.priceChange.toFixed(1)}%` : t('buyer.down')}
                        </Text>
                      </>
                    ) : null}
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {user?.role === 'buyer' ? (
        <BuyerBottomNav activeTab="home" />
      ) : (
        <FarmerBottomNav activeTab="home" />
      )}
    </View>
  );
}