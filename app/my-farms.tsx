import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import { useAuth } from "@/contexts/auth-context";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { supabase } from "@/utils/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Droplets,
  Leaf,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Sun
} from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

interface Crop {
  id: string;
  name: string;
  crop_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  expected_harvest_date: string;
  image_url?: string;
  status: string;
  created_at: string;
}

export default function MyFarms() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Voice input for search
  const { isRecording, toggleRecording } = useVoiceInput({
    onTranscript: (text) => setSearchText(text),
    language: user?.language || 'en'
  });

  // Scroll animation for glass card fade effect
  const scrollY = useRef(new Animated.Value(0)).current;

  // Load crops from Supabase
  const loadCrops = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('📊 [MY-FARMS] Loading crops for user:', user.id);

      const { data, error } = await supabase
        .from('farmer_crops')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [MY-FARMS] Error loading crops:', error);
        throw error;
      }

      console.log('✅ [MY-FARMS] Loaded crops:', data?.length || 0);
      setCrops(data || []);
    } catch (error) {
      console.error('❌ [MY-FARMS] Exception loading crops:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Reload crops when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCrops();
    }, [loadCrops])
  );

  // Filter crops based on search
  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchText.toLowerCase()) ||
    crop.crop_type.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate farm stats from real data
  const farmStats = [
    { icon: <Leaf size={20} color="#10B981" />, label: t('farms.activeCrops'), value: crops.length.toString() },
    { icon: <Droplets size={20} color="#3B82F6" />, label: t('farms.irrigation'), value: "85%" },
    { icon: <Sun size={20} color="#F59E0B" />, label: t('farms.sunlight'), value: "7h/day" },
    { icon: <Calendar size={20} color="#8B5CF6" />, label: t('farms.season'), value: t('farms.kharif') },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('common.today');
    if (diffDays === 1) return t('common.yesterday');
    if (diffDays < 7) return t('common.daysAgo', { count: diffDays });
    if (diffDays < 30) return t('common.weeksAgo', { count: Math.floor(diffDays / 7) });
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#7C8B3A',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('farms.myFarms')}</Text>
        </View>

        {/* Enhanced Search Bar with Voice */}
        <View className="mt-2">
          <View
            className="flex-row items-center bg-white/90 rounded-2xl px-4 py-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Search size={20} color="#4B5563" />
            <TextInput
              placeholder={t('farms.searchFarmsCrops')}
              className="flex-1 ml-3 text-base text-gray-800"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
            <View className="flex-row">
              <TouchableOpacity
                className="p-1 mr-2"
                onPress={toggleRecording}
              >
                <Mic
                  size={20}
                  color={isRecording ? '#EF4444' : '#4B5563'}
                  fill={isRecording ? '#EF4444' : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <SlidersHorizontal size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Farms List with ScrollView */}
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Stats Overview - Glass Card with Fade Effect */}
        <Animated.View
          className="mx-6 mb-6 rounded-3xl p-6 shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
            opacity: scrollY.interpolate({
              inputRange: [0, 150],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 150],
                outputRange: [0, -30],
                extrapolate: 'clamp',
              }),
            }],
          }}
        >
          <Text className="text-xl font-bold text-gray-800 mb-4">{t('farms.farmOverview')}</Text>
          <View className="flex-row flex-wrap justify-between">
            {farmStats.map((stat, index) => (
              <View key={index} className="basis-[48%] flex-row items-center rounded-xl p-3 mb-3" style={{ backgroundColor: '#F5F3F0' }}>
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                  {stat.icon}
                </View>
                <View className="ml-3">
                  <Text className="text-lg font-bold text-gray-900">{stat.value}</Text>
                  <Text className="text-xs text-gray-500">{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* My Crops Section Header */}
        <View className="px-6 mb-4 flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">
            {t('farms.myCrops')} ({filteredCrops.length})
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/edit-crop')}
            className="flex-row items-center bg-emerald-600 px-4 py-2 rounded-full"
          >
            <Plus size={16} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-1">{t('common.add')}</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading ? (
          <View className="px-6 py-12 items-center">
            <ActivityIndicator size="large" color="#7C8B3A" />
            <Text className="text-gray-500 mt-4">{t('common.loading')}</Text>
          </View>
        ) : filteredCrops.length === 0 ? (
          /* Empty State */
          <View className="px-6 py-12 items-center">
            <Leaf size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              {searchText ? t('farms.noCropsFound') : t('farms.noCropsYet')}
            </Text>
            {!searchText && (
              <TouchableOpacity
                onPress={() => router.push('/edit-crop')}
                className="mt-4 bg-emerald-600 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold">{t('farms.addFirstCrop')}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Crops Cards */
          <View className="px-6">
            {filteredCrops.map((crop) => (
              <View
                key={crop.id}
                className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {/* Crop Image */}
                {crop.image_url ? (
                  <View className="h-40 relative">
                    <Image
                      source={{ uri: crop.image_url }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute top-3 right-3 px-3 py-1 rounded-full" style={{ backgroundColor: '#7C8B3A' }}>
                      <Text className="text-xs font-bold text-white">{crop.status}</Text>
                    </View>
                  </View>
                ) : (
                  <View className="h-40 bg-emerald-100 items-center justify-center">
                    <Leaf size={48} color="#059669" />
                  </View>
                )}

                {/* Crop Details */}
                <View className="p-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900">{crop.name}</Text>
                      <Text className="text-sm text-gray-500 mt-1">{crop.crop_type}</Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="text-sm font-semibold text-emerald-600">
                          {crop.quantity} {crop.unit}
                        </Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          ₹{crop.price_per_unit}/{crop.unit}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity className="p-2">
                      <MoreHorizontal size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Harvest Date */}
                  <View className="mt-3 flex-row items-center">
                    <Calendar size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-500 ml-2">
                      {t('farms.harvestDate')}: {new Date(crop.expected_harvest_date).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row mt-4 gap-3">
                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: "/edit-crop",
                        params: { cropId: crop.id }
                      })}
                      className="flex-1 flex-row items-center justify-center bg-emerald-600 rounded-xl py-3.5 shadow-sm"
                    >
                      <Leaf size={18} color="#FFFFFF" />
                      <Text className="text-white font-semibold ml-2">{t('common.edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center bg-emerald-50 rounded-xl py-3.5 shadow-sm"
                    >
                      <MessageSquare size={18} color="#059669" />
                      <Text className="text-emerald-700 font-semibold ml-2">
                        {t('farms.details')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>

      {/* Bottom Navigation - Absolute Positioning */}
      <View className="absolute bottom-0 left-0 right-0">
        <FarmerBottomNav activeTab="farms" />
      </View>
    </View>
  );
}