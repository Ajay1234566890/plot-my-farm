import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/utils/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Paperclip, Phone, Send, Video } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  created_at: string;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Get user data from params
  const userId = params.userId as string;
  const userName = params.userName as string || t('chatScreen.user');
  const userAvatar = params.userAvatar as string || 'https://randomuser.me/api/portraits/men/32.jpg';
  const userRole = params.userRole as string || t('chatScreen.buyer');

  useEffect(() => {
    if (user?.id && userId) {
      fetchMessages();
      fetchPhoneNumber();
      subscribeToMessages();
    }
  }, [user?.id, userId]);

  const fetchPhoneNumber = async () => {
    try {
      let phone = '';
      if (userRole.toLowerCase() === 'farmer') {
        const { data } = await supabase
          .from('farmers')
          .select('phone')
          .eq('id', userId)
          .single();
        phone = data?.phone;
      } else {
        // Try to get from buyers table for buyer
        const { data } = await supabase
          .from('buyers')
          .select('phone')
          .eq('id', userId)
          .single();

        if (data) {
          phone = data.phone;
        }
      }

      if (phone) setPhoneNumber(phone);
    } catch (error) {
      console.log('Error fetching phone number:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender_id === user?.id ? 'me' : 'other',
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          created_at: msg.created_at
        }));
        setMessages(formattedMessages);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user?.id}`
      }, (payload) => {
        if (payload.new.sender_id === userId) {
          const newMessage = {
            id: payload.new.id,
            text: payload.new.content,
            sender: 'other' as const,
            time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            created_at: payload.new.created_at
          };
          setMessages(prev => [...prev, newMessage]);
          setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    const msgContent = message.trim();
    setMessage('');

    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      text: msgContent,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          content: msgContent
        });

      if (error) {
        console.error('Error sending message:', error);
        // Rollback optimistic update if needed
      }
    } catch (error) {
      console.error('Exception sending message:', error);
    }
  };

  const handleCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert(
        t('common.error'),
        t('chatScreen.phoneNotAvailable'),
        [{ text: 'OK' }]
      );
    }
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
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
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
