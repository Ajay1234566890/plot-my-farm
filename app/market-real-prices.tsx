import { locationService } from '@/services/location-service';
import { MarketPrice, marketPricesService } from '@/services/market-prices-service';
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin, RefreshCw, Search, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import FarmerBottomNav from './components/FarmerBottomNav';

export default function MarketRealPrices() {
  const router = useRouter();
  const { t } = useTranslation();
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
      setMarketPrices(prices);
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
                source={typeof crop.image === 'string' ? { uri: crop.image } : crop.image}
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

      <FarmerBottomNav activeTab="home" />
    </View>
  );
}