import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    MessageSquare,
    Mic
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function VoiceAI() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [recentQueries] = useState([
    t('voiceAI.showMarketPriceRice'),
    t('voiceAI.readMyMessages'),
    t('voiceAI.callRajuFarmer'),
    t('voiceAI.findMeTomatoes')
  ]);

  const handleVoiceCommand = () => {
    setIsRecording(true);
    // Simulate voice processing
    setTimeout(() => {
      setIsRecording(false);
      setSearchResult(t('voiceAI.searchingFarmersOnions'));
    }, 2000);
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
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('voiceAI.voiceAI')}</Text>
        </View>
        <Text className="text-white/80">
          {t('voiceAI.askMeAnythingCropsFarming')}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-600 text-center mb-8">
          {t('voiceAI.askMeAnythingCropsFarmersMarket')}
        </Text>

        {/* Voice Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleVoiceCommand}
            className="w-24 h-24 rounded-full items-center justify-center"
            style={{ backgroundColor: isRecording ? '#EF4444' : '#7C8B3A' }}
          >
            <Mic color="white" size={32} />
          </TouchableOpacity>
        </View>

        {/* Search Result */}
        {searchResult && (
          <View className="p-4 rounded-lg mb-8" style={{ backgroundColor: '#F5F3F0' }}>
            <Text style={{ color: '#7C8B3A' }}>{searchResult}</Text>
          </View>
        )}

        {/* Recent Queries */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">{t('voiceAI.recentQueries')}</Text>
          {recentQueries.map((query, index) => (
            <TouchableOpacity
              key={index}
              className="bg-blue-100 p-4 rounded-lg mb-2 flex-row items-center"
              onPress={() => setSearchResult(query)}
            >
              <MessageSquare className="text-blue-600" size={20} />
              <Text className="text-blue-800 ml-3">{query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FarmerBottomNav activeTab="home" />
    </View>
  );
}