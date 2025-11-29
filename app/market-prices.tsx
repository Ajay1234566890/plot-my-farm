import { locationService } from '@/services/location-service';
import { MarketPrice, marketPricesService } from '@/services/market-prices-service';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Filter,
  Home,
  MapPin,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  Store,
  TrendingDown,
  TrendingUp,
  User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function MarketPrices() {
  const { t } = useTranslation();
  const router = useRouter();

  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('India');

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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full"
              onPress={() => router.back()}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
            <View className="ml-2">
              <Text className="text-xl font-bold text-gray-900">{t('marketPrices.liveMarketPrices')}</Text>
              <View className="flex-row items-center">
                <MapPin size={12} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">{userLocation}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-gray-100 rounded-full"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#4B5563" />
            ) : (
              <RefreshCw size={20} color="#4B5563" />
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder={t('marketPrices.searchCrop')}
            className="flex-1 ml-3 text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity className="p-2">
            <Filter size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Market Prices List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-500 mt-4">{t('common.loadingPrices')}</Text>
        </View>
      ) : filteredCrops.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-lg text-center">
            {searchQuery ? t('buyer.noCropsFound') : t('buyer.noMarketPrices')}
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-3 rounded-full bg-green-600"
            onPress={handleRefresh}
          >
            <Text className="text-white font-semibold">{t('common.refresh')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="p-4">
            {filteredCrops.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
                accessibilityRole="button"
                accessibilityLabel={`${item.commodity} price information`}
              >
                <View className="flex-row items-center">
                  <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    className="w-16 h-16 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-bold text-gray-900">{item.commodity}</Text>
                    {item.variety && (
                      <Text className="text-xs text-gray-500">{item.variety}</Text>
                    )}
                    <View className="flex-row items-center mt-1">
                      <MapPin size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-500 ml-1">
                        {item.market}, {item.state}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-gray-900">₹{item.modalPrice}/{item.unit}</Text>
                    <Text className="text-xs text-gray-400">₹{item.minPrice}-₹{item.maxPrice}</Text>
                    {item.trend && (
                      <View className="flex-row items-center mt-1">
                        {item.trend === 'up' ? (
                          <TrendingUp size={14} color="#059669" />
                        ) : item.trend === 'down' ? (
                          <TrendingDown size={14} color="#DC2626" />
                        ) : null}
                        <Text
                          className={`text-sm ml-1 ${item.trend === 'up' ? 'text-emerald-600' :
                              item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}
                        >
                          {item.trend === 'up' ? 'Up' : item.trend === 'down' ? 'Down' : 'Stable'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Bottom Tabs */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
          {/* Home Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel={t('marketPrices.homeTab')}
            accessibilityRole="tab"
            onPress={() => router.push('/farmer-home')}
          >
            <Home size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('marketPrices.home')}</Text>
          </TouchableOpacity>

          {/* Store Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel={t('marketPrices.myStoreTab')}
            accessibilityRole="tab"
          >
            <Store size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('marketPrices.myStore')}</Text>
          </TouchableOpacity>

          {/* Add/Create Button */}
          <TouchableOpacity
            className="items-center justify-center -mt-5 bg-green-600 rounded-full w-14 h-14 shadow-lg"
            accessibilityLabel={t('marketPrices.createNewItem')}
            accessibilityRole="button"
            onPress={() => router.push('/add-crop')}
          >
            <Plus size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Monitor/Screen Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel={t('marketPrices.monitorTab')}
            accessibilityRole="tab"
          >
            <Monitor size={24} color="#16a34a" strokeWidth={2} />
            <Text className="text-xs text-green-600 mt-1">{t('marketPrices.monitor')}</Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel={t('marketPrices.profileTab')}
            accessibilityRole="tab"
            onPress={() => router.push('/profile')}
          >
            <User size={24} color="#6b7280" strokeWidth={2} />
            <Text className="text-xs text-gray-500 mt-1">{t('marketPrices.profile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Safe Area Spacing for iOS */}
        <View className="h-[12px] bg-white" />
      </View>
    </View>
  );
}