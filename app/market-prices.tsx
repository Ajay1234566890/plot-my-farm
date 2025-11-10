import {
    ArrowLeft,
    Filter,
    Home,
    MapPin,
    Monitor,
    Plus,
    Search,
    Store,
    TrendingUp,
    User,
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MarketPrices() {
  const { t } = useTranslation();

  // Mock data for market prices
  const marketPrices = [
    {
      name: t('marketPrices.tomatoes'),
      price: "₹42/kg",
      location: t('marketPrices.nashikMaharashtra'),
      change: "+2.5%",
      image: "https://images.unsplash.com/photo-1524593166156-312f362cada0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "up"
    },
    {
      name: t('marketPrices.basmatiRice'),
      price: "₹98/kg",
      location: t('marketPrices.dehradunUttarakhand'),
      change: "+1.2%",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "up"
    },
    {
      name: t('marketPrices.potatoes'),
      price: "₹35/kg",
      location: t('marketPrices.agraUttarPradesh'),
      change: "+0.8%",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "up"
    },
    {
      name: t('marketPrices.onions'),
      price: "₹30/kg",
      location: t('marketPrices.lasalgaonMaharashtra'),
      change: "+1.5%",
      image: "https://images.unsplash.com/photo-1618512496248-a01f4a1a4b1a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "up"
    },
    {
      name: t('marketPrices.wheat'),
      price: "₹22/kg",
      location: t('marketPrices.ludhianaPunjab'),
      change: "+0.5%",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "up"
    },
    {
      name: t('marketPrices.mangoesAlphonso'),
      price: "₹150/kg",
      location: t('marketPrices.ratnagiMaharashtra'),
      change: "+5.0%",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "up"
    },
    {
      name: t('marketPrices.sugarcane'),
      price: "₹3/kg",
      location: t('marketPrices.kolhapurMaharashtra'),
      change: "-0.6%",
      image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      trend: "down"
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            className="w-10 h-10 items-center justify-center rounded-full"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 ml-2">{t('marketPrices.liveMarketPrices')}</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder={t('marketPrices.searchCrop')}
            className="flex-1 ml-3 text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity className="p-2">
            <Filter size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Market Prices List */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          {marketPrices.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
              accessibilityRole="button"
              accessibilityLabel={`${item.name} price information`}
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-xl"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-500 ml-1">{item.location}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-gray-900">{item.price}</Text>
                  <View className="flex-row items-center mt-1">
                    <TrendingUp 
                      size={14} 
                      color={item.trend === 'up' ? '#059669' : '#DC2626'}
                    />
                    <Text 
                      className={`text-sm ml-1 ${
                        item.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {item.change}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tabs */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
          {/* Home Tab */}
          <TouchableOpacity
            className="items-center justify-center"
            accessibilityLabel={t('marketPrices.homeTab')}
            accessibilityRole="tab"
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