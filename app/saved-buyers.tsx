import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, MapPin, MessageSquare, Phone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

interface SavedBuyer {
  id: string;
  buyer_id: string;
  buyer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone_number: string | null;
    city: string | null;
    state: string | null;
  };
  created_at: string;
}

export default function SavedBuyers() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [savedBuyers, setSavedBuyers] = useState<SavedBuyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved buyers from Supabase
  useEffect(() => {
    if (user?.id) {
      loadSavedBuyers();
    }
  }, [user?.id]);

  const loadSavedBuyers = async () => {
    try {
      setLoading(true);
      console.log('📋 [SAVED-BUYERS] Loading saved buyers for farmer:', user?.id);

      const { data, error } = await supabase
        .from('saved_buyers')
        .select(`
          id,
          buyer_id,
          created_at,
          buyer:buyers!saved_buyers_buyer_id_fkey (
            id,
            full_name,
            avatar_url,
            phone_number,
            city,
            state
          )
        `)
        .eq('farmer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [SAVED-BUYERS] Error loading:', error);
        throw error;
      }

      console.log('✅ [SAVED-BUYERS] Loaded:', data?.length || 0, 'buyers');
      setSavedBuyers(data || []);
    } catch (error) {
      console.error('❌ [SAVED-BUYERS] Exception:', error);
      Alert.alert(t('common.error'), 'Failed to load saved buyers');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSaved = async (savedBuyerId: string, buyerName: string) => {
    Alert.alert(
      t('common.confirm'),
      `Remove ${buyerName} from saved buyers?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('saved_buyers')
                .delete()
                .eq('id', savedBuyerId);

              if (error) throw error;

              // Update local state
              setSavedBuyers(prev => prev.filter(sb => sb.id !== savedBuyerId));
              Alert.alert(t('common.success'), 'Buyer removed from saved list');
            } catch (error) {
              console.error('Error removing saved buyer:', error);
              Alert.alert(t('common.error'), 'Failed to remove buyer');
            }
          }
        }
      ]
    );
  };

  const handleMessage = (buyerId: string, buyerName: string, buyerAvatar: string | null) => {
    console.log('📨 [SAVED-BUYERS] Opening chat with buyer:', buyerId);
    router.push({
      pathname: '/chat-screen',
      params: {
        userId: buyerId,
        userName: buyerName,
        userAvatar: buyerAvatar || '',
        userRole: 'buyer'
      }
    });
  };

  const handleCall = (buyerPhone: string | null, buyerName: string) => {
    if (!buyerPhone) {
      Alert.alert(t('common.error'), 'Phone number not available for this buyer');
      return;
    }

    console.log('📞 [SAVED-BUYERS] Calling buyer:', buyerName);
    Alert.alert(
      t('common.call'),
      `Call ${buyerName}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.call'),
          onPress: () => Linking.openURL(`tel:${buyerPhone}`)
        }
      ]
    );
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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('profile.savedBuyers')}</Text>
        </View>
        <Text className="text-white/80">
          {t('profile.savedBuyersDescription')}
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C8B3A" />
          <Text className="text-gray-500 mt-4">{t('common.loading')}</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {savedBuyers.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Heart size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4">{t('profile.noSavedBuyers')}</Text>
              <Text className="text-gray-400 text-center mt-2">
                {t('profile.saveBuyersHint')}
              </Text>
            </View>
          ) : (
            savedBuyers.map((savedBuyer) => {
              const buyer = savedBuyer.buyer;
              if (!buyer) return null;

              return (
                <View
                  key={savedBuyer.id}
                  className="bg-white rounded-3xl p-6 mb-4 shadow-lg"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <View className="flex-row items-start">
                    <Image
                      source={{
                        uri: buyer.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                      }}
                      className="w-16 h-16 rounded-full"
                    />
                    <View className="flex-1 ml-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-gray-900">{buyer.full_name}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveFromSaved(savedBuyer.id, buyer.full_name)}
                          className="p-2"
                        >
                          <Heart size={20} color="#7C8B3A" fill="#7C8B3A" />
                        </TouchableOpacity>
                      </View>

                      {(buyer.city || buyer.state) && (
                        <View className="flex-row items-center mt-1">
                          <MapPin size={14} color="#6B7280" />
                          <Text className="text-gray-600 ml-1">
                            {[buyer.city, buyer.state].filter(Boolean).join(', ')}
                          </Text>
                        </View>
                      )}

                      <View className="flex-row items-center justify-between mt-4">
                        <View className="flex-row space-x-2">
                          <TouchableOpacity
                            onPress={() => handleMessage(buyer.id, buyer.full_name, buyer.avatar_url)}
                            className="flex-row items-center px-4 py-2 rounded-full"
                            style={{ backgroundColor: '#7C8B3A' }}
                          >
                            <MessageSquare size={16} color="white" />
                            <Text className="text-white ml-2 font-medium">{t('common.message')}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleCall(buyer.phone_number, buyer.full_name)}
                            className="p-2 rounded-full border border-gray-300"
                          >
                            <Phone size={16} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          <View className="h-20" />
        </ScrollView>
      )}

      <FarmerBottomNav activeTab="profile" />
    </View>
  );
}
