import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Paperclip, Phone, Send, Video } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');

  // Get user data from params
  const userId = params.userId as string;
  const userName = params.userName as string || t('chatScreen.user');
  const userAvatar = params.userAvatar as string || 'https://randomuser.me/api/portraits/men/32.jpg';
  const userRole = params.userRole as string || t('chatScreen.buyer');

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

  const handleCall = () => {
    Alert.alert(
      'Call',
      `Call ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:+1234567890`) }
      ]
    );
  };

  const handleVideoCall = () => {
    Alert.alert(
      'Video Call',
      'Video calling is not available yet.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: '#F5F3F0' }}
    >
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-6"
        style={{
          backgroundColor: '#7C8B3A', // Olive/army green matching farmer design
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
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
              onPress={handleCall}
            >
              <Phone size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
              onPress={handleVideoCall}
            >
              <Video size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <View
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'me'
                  ? 'rounded-tr-none'
                  : 'rounded-tl-none'
                }`}
              style={{
                backgroundColor: msg.sender === 'me' ? '#7C8B3A' : '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text
                className={`text-base ${msg.sender === 'me' ? 'text-white' : 'text-gray-900'}`}
              >
                {msg.text}
              </Text>
              <Text
                className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-500'
                  }`}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="px-6 pb-6">
        <View
          className="bg-white rounded-2xl p-4 flex-row items-center shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <TouchableOpacity className="p-2 mr-2">
            <Paperclip size={24} color="#6B7280" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 text-base text-gray-900 max-h-20"
            placeholder={t('chatScreen.typeMessage')}
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="center"
          />
          <TouchableOpacity
            className="rounded-full p-3 ml-2"
            style={{ backgroundColor: '#7C8B3A' }}
            onPress={handleSendMessage}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
