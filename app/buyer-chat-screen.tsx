import { CallButton } from '@/components/CallButton';
import { useAuth } from '@/contexts/auth-context';
import {
  getMessages,
  Message,
  sendMessage,
  subscribeMessages,
  unsubscribe,
} from '@/services/chat-service';
import { supabase } from '@/utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Paperclip, Phone, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BuyerChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get params
  const chatId = params.chatId as string;
  const userId = params.userId as string;
  const userName = (params.userName as string) || t('chatScreen.user');
  const userAvatar =
    (params.userAvatar as string) || 'https://randomuser.me/api/portraits/men/32.jpg';
  const userRole = (params.userRole as string) || t('chatScreen.farmer');

  useEffect(() => {
    if (chatId && user?.id) {
      loadMessages();
      setupRealtimeSubscription();
      fetchPhoneNumber();
    }

    return () => {
      if (subscription) {
        unsubscribe(subscription);
      }
    };
  }, [chatId, user?.id]);

  const loadMessages = async () => {
    try {
      const { data, error } = await getMessages(chatId);
      if (error) {
        console.error('Error loading messages:', error);
      } else if (data) {
        setMessages(data);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
      }
    } catch (error) {
      console.error('Exception loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = subscribeMessages(chatId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });

    setSubscription(channel);
  };

  const fetchPhoneNumber = async () => {
    try {
      const { data } = await supabase.from('users').select('phone').eq('id', userId).single();

      if (data?.phone) {
        setPhoneNumber(data.phone);
      }
    } catch (error) {
      console.log('Error fetching phone number:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || sending) return;

    const msgContent = message.trim();
    setMessage('');
    setSending(true);

    try {
      const { error } = await sendMessage(chatId, user.id, msgContent);

      if (error) {
        console.error('Error sending message:', error);
        Alert.alert(t('common.error'), t('chatScreen.sendError'));
        setMessage(msgContent); // Restore message on error
      }
    } catch (error) {
      console.error('Exception sending message:', error);
      Alert.alert(t('common.error'), t('chatScreen.sendError'));
      setMessage(msgContent);
    } finally {
      setSending(false);
    }
  };

  const handleCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert(t('common.error'), t('chatScreen.phoneNotAvailable'), [{ text: 'OK' }]);
    }
  };

  const handleVideoCall = () => {
    Alert.alert('Video Call', 'Video calling is not available yet.', [{ text: 'OK' }]);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          backgroundColor: '#2563EB',
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
            <Image source={{ uri: userAvatar }} className="w-10 h-10 rounded-full mr-3" />
            <View>
              <Text className="text-lg font-bold text-white">{userName}</Text>
              <Text className="text-white/80 text-sm capitalize">
                {userRole} • {t('chatScreen.online')}
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-2"
              onPress={handleCall}
            >
              <Phone size={20} color="white" />
            </TouchableOpacity>
            <View className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
              <CallButton
                userId={userId}
                userName={userName}
                userAvatar={userAvatar}
                size="small"
                variant="primary"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500 text-center">{t('chatScreen.noMessages')}</Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <View
                  key={msg.id}
                  className={`flex-row mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <View
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'
                      }`}
                    style={{
                      backgroundColor: isMe ? '#2563EB' : '#FFFFFF',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text className={`text-base ${isMe ? 'text-white' : 'text-gray-900'}`}>
                      {msg.text}
                    </Text>
                    <Text className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatMessageTime(msg.created_at)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

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
            editable={!sending}
          />
          <TouchableOpacity
            className="rounded-full p-3 ml-2"
            style={{ backgroundColor: sending ? '#9CA3AF' : '#2563EB' }}
            onPress={handleSendMessage}
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
