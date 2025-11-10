import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import { ArrowLeft, Filter, Search } from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function NearbyCrops() {
  const router = useRouter();
  const { t } = useTranslation();

  const mockCrops = [
    {
      id: 1,
      name: t('buyer.organicTomatoes'),
      farm: t('buyer.alexFarms'),
      price: "$2.99/kg",
      quantity: t('buyer.kgAvailable', { count: 50 }),
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: t('buyer.sweetCarrots'),
      farm: t('buyer.greenValley'),
      price: "$1.99/kg",
      quantity: t('buyer.kgAvailable', { count: 80 }),
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: t('buyer.freshLettuce'),
      farm: t('buyer.greenValley'),
      price: "$2.50/kg",
      quantity: t('buyer.kgAvailable', { count: 30 }),
      image:
        "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      name: t('buyer.galaApples'),
      farm: t('buyer.orchardGrove'),
      price: "$3.50/kg",
      quantity: t('buyer.kgAvailable', { count: 120 }),
      image:
        "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800&auto=format&fit=crop&q=60",
    },
  ];

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
          />
        </View>
      </View>

      {/* Crop Listings */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {mockCrops.map((crop) => (
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
              <Image
                source={{ uri: crop.image }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <View className="p-4">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      {crop.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {t('buyer.by')} {crop.farm}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold" style={{ color: '#B27E4C' }}>
                    {crop.price}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 mt-1">
                  {crop.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: "/crop-details",
                    params: { cropId: crop.id.toString() }
                  })}
                  className="mt-3 rounded-full py-3"
                  style={{ backgroundColor: '#B27E4C' }}
                >
                  <Text className="text-white text-center font-semibold">
                    {t('buyer.viewDetails')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View className="h-6" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="crops" />
    </View>
  );
}