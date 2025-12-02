import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, MessageCircle, Phone, Plus, Search, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Image, Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BuyerOffersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-requests'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [farmerOffers, setFarmerOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch offers from Supabase
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farmer_offers')
        .select(`
          *,
          farmers (
            full_name,
            phone,
            profile_image,
            state,
            city
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching offers:', error);
        return;
      }

      if (data) {
        // Transform data to match UI requirements
        const formattedOffers = data.map(offer => ({
          id: offer.id,
          farmerId: offer.farmer_id,
          title: offer.title,
          farmer: offer.farmers?.full_name || 'Unknown Farmer',
          farmerPhone: offer.farmers?.phone,
          farmerAvatar: offer.farmers?.profile_image || 'https://via.placeholder.com/150',
          location: `${offer.farmers?.city || ''}, ${offer.farmers?.state || ''}`,
          cropType: offer.crop_type,
          price: `₹${offer.price}/${offer.unit}`,
          quantity: `${offer.quantity} ${offer.unit} available`,
          image: offer.image_url,
          quality: 'Standard', // You might want to add this field to DB
          harvestDate: new Date(offer.created_at).toLocaleDateString(),
          rating: 4.5 // Placeholder
        }));
        setFarmerOffers(formattedOffers);
      }
    } catch (error) {
      console.error('Exception fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions for Call and Message
  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert(t('common.error'), 'Phone number not available');
    }
  };

  const handleMessage = (farmerId: string, farmerName: string, farmerAvatar: string, cropName: string) => {
    // Navigate to in-app chat screen
    router.push({
      pathname: '/buyer-chat-screen',
      params: {
        userId: farmerId,
        userName: farmerName,
        userAvatar: farmerAvatar || 'https://via.placeholder.com/150',
        userRole: 'Farmer',
        cropName: cropName,
      }
    });
  };

  // Mock data for buyer's own requests (what they want to buy)
  const myRequests = [
    {
      id: 1,
      title: t('buyerOffers.lookingForOrganicPotatoes'),
      cropType: t('crops.potatoes'),
      quantity: t('buyerOffers.kgNeeded', { count: 20 }),
      maxPrice: "₹35/kg",
      location: t('buyerOffers.delhiNCR'),
      status: "active",
      responses: 3,
      createdDate: t('common.daysAgo', { count: 1 })
    },
    {
      id: 2,
      title: t('buyerOffers.needFreshOnions'),
      cropType: t('crops.onions'),
      quantity: t('buyerOffers.kgNeeded', { count: 15 }),
      maxPrice: "₹40/kg",
      location: t('buyerOffers.delhiNCR'),
      status: "active",
      responses: 5,
      createdDate: t('common.daysAgo', { count: 3 })
    },
  ];

  const filteredOffers = farmerOffers.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.farmer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFarmerOffer = ({ item }: { item: any }) => (
    <View
      className="bg-white rounded-xl p-4 mb-4"
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
      <View className="flex-row">
        <Image
          source={{ uri: item.image }}
          className="w-20 h-20 rounded-xl mr-4"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">{item.title}</Text>
          <Text className="text-sm text-gray-600 mb-1">{t('buyerOffers.by')} {item.farmer}</Text>
          <Text className="text-sm text-gray-500 mb-2">{item.location}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold" style={{ color: '#B27E4C' }}>{item.price}</Text>
            <Text className="text-sm text-gray-600">{item.quantity}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row mt-4 gap-2">
        <TouchableOpacity
          onPress={() => handleCall(item.farmerPhone)}
          className="flex-1 flex-row items-center justify-center rounded-full py-3 bg-green-600"
        >
          <Phone size={18} color="white" />
          <Text className="text-white font-semibold ml-2">
            {t('common.call')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleMessage(item.farmerId, item.farmer, item.farmerAvatar, item.title)}
          className="flex-1 flex-row items-center justify-center rounded-full py-3"
          style={{ backgroundColor: '#B27E4C' }}
        >
          <MessageCircle size={18} color="white" />
          <Text className="text-white font-semibold ml-2">
            {t('common.message')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMyRequest = ({ item }: { item: typeof myRequests[0] }) => (
    <View
      className="bg-white rounded-xl p-4 mb-4"
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
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold text-gray-900 flex-1">{item.title}</Text>
        <View className="bg-green-100 px-2 py-1 rounded-full">
          <Text className="text-green-700 text-xs font-semibold capitalize">{item.status}</Text>
        </View>
      </View>

      <Text className="text-gray-600 mb-1">{item.quantity}</Text>
      <Text className="text-gray-600 mb-1">{t('buyerOffers.maxPrice')}: {item.maxPrice}</Text>
      <Text className="text-gray-500 text-sm mb-3">{item.location} • {item.createdDate}</Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-sm" style={{ color: '#B27E4C' }}>
          {t('buyerOffers.farmerResponses', { count: item.responses })}
        </Text>
        <TouchableOpacity
          className="px-4 py-2 rounded-lg"
          style={{ backgroundColor: '#B27E4C' }}
          onPress={() => router.push({
            pathname: "/request-responses",
            params: { requestId: item.id.toString() }
          })}
        >
          <Text className="text-white font-semibold">{t('buyerOffers.viewResponses')}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">{t('buyerOffers.offers')}</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
            >
              <Bell color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/buyer-profile")}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <User color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-3">
          <Search size={20} color="white" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder={t('buyerOffers.searchPlaceholder')}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row mx-4 mt-4 mb-2">
        <TouchableOpacity
          onPress={() => setActiveTab('browse')}
          className={`flex-1 py-3 rounded-l-lg items-center ${activeTab === 'browse' ? 'bg-white' : 'bg-gray-200'
            }`}
          style={activeTab === 'browse' ? {
            shadowColor: '#B27E4C',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          } : {}}
        >
          <Text className={`font-semibold ${activeTab === 'browse' ? 'text-gray-900' : 'text-gray-600'
            }`}>
            {t('buyerOffers.browseOffers')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('my-requests')}
          className={`flex-1 py-3 rounded-r-lg items-center ${activeTab === 'my-requests' ? 'bg-white' : 'bg-gray-200'
            }`}
          style={activeTab === 'my-requests' ? {
            shadowColor: '#B27E4C',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          } : {}}
        >
          <Text className={`font-semibold ${activeTab === 'my-requests' ? 'text-gray-900' : 'text-gray-600'
            }`}>
            {t('buyerOffers.myRequests')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'browse' ? (
          <FlatList
            data={filteredOffers}
            renderItem={renderFarmerOffer}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <Text className="text-gray-500">{loading ? 'Loading offers...' : 'No offers found'}</Text>
              </View>
            }
          />
        ) : (
          <ScrollView className="flex-1 px-4 pb-24">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">{t('buyerOffers.myPurchaseRequests')}</Text>
              <TouchableOpacity
                className="flex-row items-center px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#B27E4C' }}
                onPress={() => router.push('/create-request' as any)}
              >
                <Plus size={16} color="white" />
                <Text className="text-white font-semibold ml-2">{t('buyerOffers.createRequest')}</Text>
              </TouchableOpacity>
            </View>

            {myRequests.map((request) => (
              <View key={request.id}>
                {renderMyRequest({ item: request })}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
