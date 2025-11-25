import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Paperclip, Phone, Send, Video } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

export default function BuyerChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get user data from params
  const userId = params.userId as string;
  const userName = params.userName as string || t('chatScreen.user');
  const userAvatar = params.userAvatar as string || 'https://randomuser.me/api/portraits/men/32.jpg';
  const userRole = params.userRole as string || t('chatScreen.farmer');
  const cropName = params.cropName as string; // Crop name if coming from crop listing

  // Pre-fill message if coming from crop listing
  const initialMessage = cropName ? `Hi, I'm interested in your ${cropName}` : '';
  const [message, setMessage] = useState(initialMessage);

  // Mock chat messages - in a real app, this would be fetched based on userId
  const messages: Message[] = [
    {
      id: '1',
      text: t('chatScreen.message1'),
      time: '10:15 AM',
      sender: 'other',
    },
    {
      id: '2',
      text: t('chatScreen.message2'),
      time: '10:17 AM',
      sender: 'me',
    },
    {
      id: '3',
      text: t('chatScreen.message3'),
      time: '10:20 AM',
      sender: 'other',
    },
    {
      id: '4',
      text: t('chatScreen.message4'),
      time: '10:22 AM',
      sender: 'me',
    },
    {
      id: '5',
      text: t('chatScreen.message5'),
      time: '10:30 AM',
      sender: 'other',
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: '#F5F3F0' }}
    >
      {/* Curved Header Section - Buyer Blue Theme */}
      <View
        className="px-6 pt-12 pb-6"
        style={{
          backgroundColor: '#2563EB', // Buyer blue color
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: userAvatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="text-lg font-bold text-white">{userName}</Text>
              <Text className="text-white/80 text-sm">{userRole} • {t('chatScreen.online')}</Text>
            </View>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2">
              <Phone size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
              <Video size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-4 py-4">
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-3 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.sender === 'me'
                  ? 'rounded-br-none'
                  : 'rounded-bl-none'
              }`}
              style={{
                backgroundColor: msg.sender === 'me' ? '#2563EB' : '#FFFFFF',
              }}
            >
              <Text className={msg.sender === 'me' ? 'text-white' : 'text-gray-900'}>
                {msg.text}
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="px-4 pb-4 pt-2 bg-white border-t border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-2">
            <Paperclip size={20} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
            <TextInput
              className="flex-1 text-gray-900"
              placeholder={t('chatScreen.typeMessage')}
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full ml-2"
            style={{ backgroundColor: '#2563EB' }}
            onPress={handleSendMessage}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

