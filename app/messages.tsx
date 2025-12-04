import { useAuth } from '@/contexts/auth-context';
import {
  Chat,
  formatChatTime,
  getChats,
  subscribeChatList,
  unsubscribe,
} from '@/services/chat-service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function MessagesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadChats();
      setupRealtimeSubscription();
    }

    return () => {
      if (subscription) {
        unsubscribe(subscription);
      }
    };
  }, [user?.id]);

  const loadChats = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await getChats(user.id);
      if (error) {
        console.error('Error loading chats:', error);
      } else if (data) {
        setChats(data);
      }
    } catch (error) {
      console.error('Exception loading chats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user?.id) return;

    const channel = subscribeChatList(user.id, (updatedChat) => {
      setChats((prevChats) => {
        const existingIndex = prevChats.findIndex((c) => c.id === updatedChat.id);
        if (existingIndex >= 0) {
          // Update existing chat
          const updated = [...prevChats];
          updated[existingIndex] = updatedChat;
          // Sort by updated_at
          return updated.sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        } else {
          // Add new chat
          return [updatedChat, ...prevChats];
        }
      });
    });

    setSubscription(channel);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadChats();
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      chat.other_user?.name.toLowerCase().includes(query) ||
      chat.last_message?.toLowerCase().includes(query)
    );
  });

  const handleChatPress = (chat: Chat) => {
    if (!chat.other_user) return;

    router.push({
      pathname: '/chat-screen',
      params: {
        chatId: chat.id,
        userId: chat.other_user.id,
        userName: chat.other_user.name,
        userAvatar: chat.other_user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
        userRole: chat.other_user.role,
      },
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#7C8B3A',
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
          <Text className="text-xl font-bold text-white">{t('messages.messages')}</Text>
        </View>
        <Text className="text-white/80 mb-4">{t('messages.chatWithBuyersPartners')}</Text>

        {/* Search Bar */}
        {/* Search Bar */}
        <View
          style={{
            backgroundColor: 'transparent',
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          <Search size={18} color="#FFFFFF" />
          <TextInput
            placeholder={t('messages.searchMessages')}
            placeholderTextColor="rgba(255, 255, 255, 0.9)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              color: 'white',
              backgroundColor: 'transparent'
            }}
          />
        </View>
      </View>

      {/* Conversations List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C8B3A" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {filteredChats.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500 text-center">
                {searchQuery ? t('messages.noResults') : t('messages.noChats')}
              </Text>
            </View>
          ) : (
            filteredChats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => handleChatPress(chat)}
              >
                <Image
                  source={{
                    uri:
                      chat.other_user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
                  }}
                  className="w-14 h-14 rounded-full"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-gray-900">
                      {chat.other_user?.name || 'Unknown'}
                    </Text>
                    <Text className="text-xs text-gray-500">{formatChatTime(chat.updated_at)}</Text>
                  </View>
                  <Text className="text-sm text-gray-500 capitalize">
                    {chat.other_user?.role || 'User'}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                      {chat.last_message || t('messages.noMessages')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <FarmerBottomNav activeTab="messages" />
    </View>
  );
}
