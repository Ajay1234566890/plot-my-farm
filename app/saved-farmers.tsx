import { useAuth } from '@/contexts/auth-context';
import { savedUsersService } from '@/services/saved-users-service';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Phone, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BuyerBottomNav from './components/BuyerBottomNav';

interface SavedFarmer {
  id: string;
  farmer_id: string;
  farmer: {
    id: string;
    name: string;
    phone: string;
    avatar_url?: string;
    location?: string;
    rating?: number;
  };
}

export default function SavedFarmers() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [savedFarmers, setSavedFarmers] = useState<SavedFarmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedFarmers();
  }, []);

  const loadSavedFarmers = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const farmers = await savedUsersService.getSavedFarmers(user.id);
      setSavedFarmers(farmers as any);
    } catch (error) {
      console.error('Error loading saved farmers:', error);
      Alert.alert(t('common.error'), 'Failed to load saved farmers');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveFarmer = async (farmerId: string) => {
    if (!user?.id) return;

    Alert.alert(
      t('profile.unsaveFarmer'),
      t('profile.unsaveFarmerConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            const result = await savedUsersService.unsaveFarmer(user.id, farmerId);
            if (result.success) {
              setSavedFarmers(prev => prev.filter(f => f.farmer_id !== farmerId));
              Alert.alert(t('common.success'), t('profile.farmerUnsaved'));
            } else {
              Alert.alert(t('common.error'), result.error || 'Failed to unsave farmer');
            }
          }
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
          backgroundColor: '#B27E4C',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('profile.savedFarmers')}</Text>
        </View>
        <Text className="text-white/80">
          {t('profile.yourFavoriteFarmers')}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#B27E4C" />
            <Text className="text-gray-500 mt-4">{t('common.loading')}</Text>
          </View>
        ) : savedFarmers.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-center text-base">
              {t('profile.noSavedFarmers')}
            </Text>
            <TouchableOpacity
              className="mt-6 px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#B27E4C' }}
              onPress={() => router.push('/nearby-farmers')}
            >
              <Text className="text-white font-semibold">{t('profile.exploreFarmers')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          savedFarmers.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-3xl p-4 mb-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.farmer.avatar_url || 'https://via.placeholder.com/80' }}
                  className="w-16 h-16 rounded-full"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-gray-900">{item.farmer.name}</Text>
                  {item.farmer.location && (
                    <View className="flex-row items-center mt-1">
                      <MapPin size={14} color="#666" />
                      <Text className="text-sm text-gray-600 ml-1">{item.farmer.location}</Text>
                    </View>
                  )}
                  {item.farmer.rating && (
                    <View className="flex-row items-center mt-1">
                      <Star size={14} color="#FFA500" fill="#FFA500" />
                      <Text className="text-sm text-gray-600 ml-1">{item.farmer.rating.toFixed(1)}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row mt-4 space-x-2">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl mr-2"
                  style={{ backgroundColor: '#B27E4C' }}
                  onPress={() => router.push(`/farmer-details?id=${item.farmer_id}`)}
                >
                  <Text className="text-white font-semibold text-center">{t('common.viewProfile')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl bg-red-50"
                  onPress={() => handleUnsaveFarmer(item.farmer_id)}
                >
                  <Text className="text-red-600 font-semibold text-center">{t('common.remove')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BuyerBottomNav />
    </View>
  );
}

