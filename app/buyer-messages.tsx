import { useRouter } from 'expo-router';
import { MoreVertical, Search } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BuyerBottomNav from './components/BuyerBottomNav';

export default function BuyerMessagesScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Mock data for conversations - Buyer perspective
  const conversations = [
    {
      id: '1',
      name: t('messages.johnSmith'),
      role: t('messages.farmer'),
      lastMessage: t('messages.pickupTomorrowMorning'),
      time: '10:30 AM',
      unread: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: '2',
      name: t('messages.greenValleyAgro'),
      role: t('messages.farmer'),
      lastMessage: t('messages.newOfferTomatoes'),
      time: t('messages.yesterday'),
      unread: false,
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
      id: '3',
      name: t('messages.sarahJohnson'),
      role: t('messages.farmer'),
      lastMessage: t('messages.howMuchOrganicCarrots'),
      time: t('messages.wed'),
      unread: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '4',
      name: t('messages.farmersCoop'),
      role: t('messages.cooperative'),
      lastMessage: t('messages.meetingScheduledMonday'),
      time: t('messages.tue'),
      unread: false,
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section - Buyer Blue Theme */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#2563EB', // Buyer blue color
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-white">{t('messages.messages')}</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
            <MoreVertical size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 mb-4">
          {t('messages.chatWithFarmersPartners')}
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder={t('messages.searchMessages')}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView className="flex-1 px-4">
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            className="flex-row items-center py-4 border-b border-gray-100"
            onPress={() => router.push({
              pathname: '/buyer-chat-screen',
              params: {
                userId: conversation.id,
                userName: conversation.name,
                userAvatar: conversation.avatar,
                userRole: conversation.role
              }
            })}
          >
            <Image
              source={{ uri: conversation.avatar }}
              className="w-14 h-14 rounded-full"
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold text-gray-900">{conversation.name}</Text>
                <Text className="text-xs text-gray-500">{conversation.time}</Text>
              </View>
              <Text className="text-sm text-gray-500">{conversation.role}</Text>
              <View className="flex-row items-center mt-1">
                <Text 
                  className={`text-sm ${conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                  numberOfLines={1}
                >
                  {conversation.lastMessage}
                </Text>
                {conversation.unread && (
                  <View className="ml-2 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BuyerBottomNav activeTab="chat" />
    </View>
  );
}

