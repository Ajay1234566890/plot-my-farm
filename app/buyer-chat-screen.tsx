import { useAuth } from '@/contexts/auth-context';
import {
  createOrGetChat,
  getMessages,
  Message,
  sendMessage,
  subscribeMessages,
  unsubscribe,
  upsertUser,
} from '@/services/chat-service';
import { imageUploadService } from '@/services/image-upload-service';
import { supabase } from '@/utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
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

  const [currentChatId, setCurrentChatId] = useState<string | null>(params.chatId as string);

  const initializeChat = async () => {
    try {
      if (user) {
        await upsertUser({
          id: user.id,
          name: (user as any).user_metadata?.full_name || 'Buyer',
          role: 'buyer',
          phone: user.phone || undefined,
          avatar: (user as any).user_metadata?.avatar_url || undefined,
        });
      }

      await upsertUser({
        id: userId,
        name: userName,
        role: 'farmer',
        avatar: userAvatar,
      });

      const { data, error } = await createOrGetChat(userId, user!.id);

      if (error) {
        console.error('Error initializing chat:', error);
        Alert.alert(t('common.error'), t('chatScreen.initError'));
      }

      if (data) {
        setCurrentChatId(data.id);
      }
    } catch (error) {
      console.error('Exception initializing chat:', error);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const { data, error } = await getMessages(id);
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

  const setupRealtimeSubscription = (id: string) => {
    const channel = subscribeMessages(id, (newMessage) => {
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

  useEffect(() => {
    if (user?.id) {
      if (currentChatId) {
        loadMessages(currentChatId);
        setupRealtimeSubscription(currentChatId);
      } else if (userId) {
        initializeChat();
      }
      fetchPhoneNumber();
    }

    return () => {
      if (subscription) {
        unsubscribe(subscription);
      }
    };
  }, [currentChatId, user?.id, userId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || sending || !currentChatId) return;

    const msgContent = message.trim();
    setMessage('');
    setSending(true);

    try {
      const { error } = await sendMessage(currentChatId, user.id, msgContent);

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

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAttachment = () => {
    Alert.alert(
      t('chatScreen.attachImage'),
      t('chatScreen.chooseSource'),
      [
        {
          text: t('chatScreen.camera'),
          onPress: takePhoto,
        },
        {
          text: t('chatScreen.gallery'),
          onPress: pickImage,
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        await sendImageMessage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), t('errors.imagePickerError'));
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(t('common.error'), t('errors.cameraPermission'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        await sendImageMessage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t('common.error'), t('errors.cameraError'));
    }
  };

  const sendImageMessage = async (uri: string) => {
    if (!user?.id || !currentChatId) return;

    setSending(true);
    try {
      // 1. Upload Image
      const imageUrl = await imageUploadService.uploadChatImage(uri);

      if (!imageUrl) {
        throw new Error('Image upload failed');
      }

      // 2. Send Message with Image URL
      const { error } = await sendMessage(currentChatId, user.id, '', imageUrl);

      if (error) {
        console.error('Error sending message:', error);
        Alert.alert(t('common.error'), t('chatScreen.sendError'));
      }
    } catch (error) {
      console.error('Exception sending image message:', error);
      Alert.alert(t('common.error'), t('chatScreen.sendError'));
    } finally {
      setSending(false);
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
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
              onPress={handleCall}
            >
              <Phone size={20} color="white" />
            </TouchableOpacity>
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
                    {msg.image_url && (
                      <Image
                        source={{ uri: msg.image_url }}
                        style={{ width: 200, height: 150, borderRadius: 8, marginBottom: msg.text ? 8 : 0 }}
                        resizeMode="cover"
                      />
                    )}
                    {msg.text ? (
                      <Text className={`text-base ${isMe ? 'text-white' : 'text-gray-900'}`}>
                        {msg.text}
                      </Text>
                    ) : null}
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
          <TouchableOpacity className="p-2 mr-2" onPress={handleAttachment}>
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
