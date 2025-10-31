import { useRouter } from 'expo-router';
import { MoreVertical, Search } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function MessagesScreen() {
  const router = useRouter();

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Buyer',
      lastMessage: 'Yes, I can pick up tomorrow morning',
      time: '10:30 AM',
      unread: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: '2',
      name: 'Green Valley Agro',
      role: 'Distributor',
      lastMessage: 'We have a new offer for your tomatoes',
      time: 'Yesterday',
      unread: false,
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      role: 'Buyer',
      lastMessage: 'How much for your organic carrots?',
      time: 'Wed',
      unread: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '4',
      name: 'Farmers Co-op',
      role: 'Cooperative',
      lastMessage: 'Meeting scheduled for next Monday',
      time: 'Tue',
      unread: false,
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ];



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
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-white">Messages</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
            <MoreVertical size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white/80 mb-4">
          Chat with buyers and partners
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-md">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Search messages..."
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
              pathname: '/chat-screen',
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
                  <View className="ml-2 w-2 h-2 bg-green-600 rounded-full" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FarmerBottomNav activeTab="messages" />
    </View>
  );
}