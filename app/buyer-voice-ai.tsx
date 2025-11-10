import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    MessageSquare,
    Mic,
    Search,
    ShoppingCart,
    TrendingUp
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function BuyerVoiceAI() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [recentQueries] = useState([
    t('buyerVoiceAI.recentQuery1'),
    t('buyerVoiceAI.recentQuery2'),
    t('buyerVoiceAI.recentQuery3'),
    t('buyerVoiceAI.recentQuery4'),
    t('buyerVoiceAI.recentQuery5')
  ]);

  const quickActions = [
    {
      icon: <Search size={24} color="#B27E4C" />,
      title: t('buyerVoiceAI.findCrops'),
      description: t('buyerVoiceAI.findCropsDesc'),
      command: t('buyerVoiceAI.findCropsCommand')
    },
    {
      icon: <TrendingUp size={24} color="#B27E4C" />,
      title: t('buyerVoiceAI.marketPrices'),
      description: t('buyerVoiceAI.marketPricesDesc'),
      command: t('buyerVoiceAI.marketPricesCommand')
    },
    {
      icon: <ShoppingCart size={24} color="#B27E4C" />,
      title: t('buyerVoiceAI.myOrders'),
      description: t('buyerVoiceAI.myOrdersDesc'),
      command: t('buyerVoiceAI.myOrdersCommand')
    },
    {
      icon: <MessageSquare size={24} color="#B27E4C" />,
      title: t('buyerVoiceAI.contactFarmers'),
      description: t('buyerVoiceAI.contactFarmersDesc'),
      command: t('buyerVoiceAI.contactFarmersCommand')
    }
  ];

  const handleVoiceCommand = () => {
    setIsRecording(true);
    // Simulate voice processing
    setTimeout(() => {
      setIsRecording(false);
      setSearchResult(t('buyerVoiceAI.response1'));
    }, 2000);
  };

  const handleQuickAction = (command: string) => {
    setSearchResult(t('buyerVoiceAI.processing', { command }));
    // Simulate processing
    setTimeout(() => {
      if (command.includes('tomatoes') || command.includes(t('crops.tomatoes'))) {
        setSearchResult(t('buyerVoiceAI.response1'));
      } else if (command.includes('prices') || command.includes(t('buyerVoiceAI.marketPrices'))) {
        setSearchResult(t('buyerVoiceAI.response2'));
      } else if (command.includes('order') || command.includes(t('buyerVoiceAI.myOrders'))) {
        setSearchResult(t('buyerVoiceAI.response3'));
      } else if (command.includes('contact') || command.includes(t('buyerVoiceAI.contactFarmers'))) {
        setSearchResult(t('buyerVoiceAI.response4'));
      }
    }, 1500);
  };

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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{t('buyerVoiceAI.title')}</Text>
        </View>
        <Text className="text-white/80">
          {t('buyerVoiceAI.subtitle')}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-600 text-center mb-8">
          {t('buyerVoiceAI.instructions')}
        </Text>

        {/* Voice Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleVoiceCommand}
            className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
            style={{
              backgroundColor: isRecording ? '#EF4444' : '#B27E4C',
              shadowColor: '#B27E4C',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Mic color="white" size={32} />
          </TouchableOpacity>
          <Text className="text-gray-600 mt-3 text-center">
            {isRecording ? t('buyerVoiceAI.listening') : t('buyerVoiceAI.tapToSpeak')}
          </Text>
        </View>

        {/* Search Result */}
        {searchResult && (
          <View
            className="p-4 rounded-xl mb-8"
            style={{
              backgroundColor: 'white',
              shadowColor: '#B27E4C',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#B27E4C20'
            }}
          >
            <Text className="text-gray-900 font-semibold mb-2">{t('buyerVoiceAI.aiResponse')}</Text>
            <Text className="text-gray-700">{searchResult}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">{t('buyerVoiceAI.quickActions')}</Text>
          <View className="space-y-3">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuickAction(action.command)}
                className="bg-white p-4 rounded-xl flex-row items-center"
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
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: '#B27E4C20' }}
                >
                  {action.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">{action.title}</Text>
                  <Text className="text-gray-600 text-sm">{action.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Queries */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">{t('buyerVoiceAI.recentQueries')}</Text>
          <View className="space-y-2">
            {recentQueries.map((query, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuickAction(query)}
                className="bg-white p-3 rounded-lg flex-row items-center"
                style={{
                  shadowColor: '#B27E4C',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#B27E4C10'
                }}
              >
                <MessageSquare size={16} color="#B27E4C" />
                <Text className="text-gray-700 ml-3 flex-1">{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View
          className="p-4 rounded-xl mb-4"
          style={{ backgroundColor: '#B27E4C10' }}
        >
          <Text className="font-semibold mb-2" style={{ color: '#B27E4C' }}>{t('buyerVoiceAI.tipsTitle')}</Text>
          <Text className="text-gray-700 text-sm leading-5">
            {t('buyerVoiceAI.tip1')}{'\n'}
            {t('buyerVoiceAI.tip2')}{'\n'}
            {t('buyerVoiceAI.tip3')}{'\n'}
            {t('buyerVoiceAI.tip4')}{'\n'}
            {t('buyerVoiceAI.tip5')}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
