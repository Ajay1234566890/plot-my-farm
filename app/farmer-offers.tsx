import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { useOffers } from '@/contexts/offers-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Edit3, Plus, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function FarmerOffersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { offers, deleteOffer } = useOffers();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'sold' | 'expired'>('all');
  const [activeTab, setActiveTab] = useState<'my-offers' | 'create'>('my-offers');

  // Filter offers based on selected status
  const filteredOffers = selectedStatus === 'all'
    ? offers
    : offers.filter(offer => offer.status === selectedStatus);

  const handleDeleteOffer = (id: number, title: string) => {
    Alert.alert(
      t('offers.deleteOffer'),
      t('offers.deleteOfferConfirm', { title }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteOffer(id),
        },
      ]
    );
  };

  const renderOfferItem = ({ item }: { item: typeof offers[0] }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-emerald-100"
      onPress={() => {
        router.push({
          pathname: '/crop-details',
          params: {
            cropId: item.id.toString(),
            from: 'farmer-offers'
          }
        });
      }}
      activeOpacity={0.7}
    >
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-40 rounded-xl mb-3"
          resizeMode="cover"
        />
        <View className="absolute top-2 left-2 bg-emerald-500 rounded-lg px-2 py-1">
          <Text className="text-white font-bold text-xs capitalize">{t(`offers.${item.status}`)}</Text>
        </View>
        <View className="absolute top-2 right-2 flex-row gap-2">
          <TouchableOpacity
            className="bg-white rounded-full p-2"
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: '/add-offer',
                params: {
                  editMode: 'true',
                  offerId: item.id.toString(),
                  title: item.title,
                  cropType: item.cropType,
                  price: item.price,
                  quantity: item.quantity
                }
              });
            }}
          >
            <Edit3 color="#059669" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-full p-2"
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteOffer(item.id, item.title);
            }}
          >
            <Trash2 color="#ef4444" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-lg font-bold text-gray-800">
        {item.title === "Fresh Organic Tomatoes" ? t('offers.freshOrganicTomatoes') :
         item.title === "Farm Fresh Carrots" ? t('offers.farmFreshCarrots') :
         item.title === "Premium Wheat" ? t('offers.premiumWheat') :
         item.title}
      </Text>
      <Text className="text-sm text-gray-500 mt-1">
        {item.cropType === "Tomatoes" ? t('offers.tomatoes') :
         item.cropType === "Carrots" ? t('offers.carrots') :
         item.cropType === "Wheat" ? t('offers.wheat') :
         item.cropType}
      </Text>

      <View className="flex-row justify-between items-center mt-3">
        <View>
          <Text className="font-bold text-lg" style={{ color: '#7C8B3A' }}>{item.price}</Text>
          <Text className="text-gray-500 text-sm">{item.quantity}</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-600 text-sm">
            {item.daysAgo === 0
              ? t('common.today')
              : item.daysAgo === 7
              ? t('common.oneWeekAgo')
              : t('common.daysAgo', { count: item.daysAgo })}
          </Text>
          <Text className="font-semibold text-sm mt-1" style={{ color: '#7C8B3A' }}>{item.buyers} {t('offers.buyers')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
              accessibilityLabel={t('common.goBack')}
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">{t('offers.myOffers')}</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
            >
              <Bell color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <User color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Two Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab('my-offers')}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
              activeTab === 'my-offers'
                ? 'bg-white'
                : 'bg-white/20 border border-white/30'
            }`}
          >
            <Text className={`font-semibold ${
              activeTab === 'my-offers'
                ? 'text-emerald-600'
                : 'text-white'
            }`}>
              {t('offers.myOffers')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/add-offer")}
            className="flex-1 py-3 rounded-xl flex-row items-center justify-center bg-white/20 border border-white/30"
          >
            <Plus color="white" size={20} />
            <Text className="text-white font-semibold ml-2">{t('offers.createOffer')}</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 mt-2">
          {t('offers.manageCropListings')}
        </Text>
      </View>
      
      {/* Status Filter */}
      <View className="py-4 px-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-16"
        >
          {(['all', 'active', 'sold', 'expired'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              className={`rounded-full px-6 py-2 mr-3 ${
                selectedStatus === status
                  ? 'bg-emerald-500'
                  : 'bg-white border border-emerald-100'
              }`}
            >
              <Text className={`font-medium capitalize ${
                selectedStatus === status
                  ? 'text-white'
                  : 'text-gray-700'
              }`}>
                {status === 'all' ? t('offers.allOffers') : t(`offers.${status}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Offers List */}
      <View className="flex-1 px-4">
        <FlatList
          data={filteredOffers}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 text-lg">{t('offers.noOffersFound')}</Text>
            </View>
          }
        />
      </View>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}