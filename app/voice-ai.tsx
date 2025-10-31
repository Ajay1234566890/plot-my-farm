import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    MessageSquare,
    Mic
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function VoiceAI() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [recentQueries] = useState([
    'Show market price for rice',
    'Read my messages',
    'Call Raju farmer',
    'Find me tomatoes'
  ]);

  const handleVoiceCommand = () => {
    setIsRecording(true);
    // Simulate voice processing
    setTimeout(() => {
      setIsRecording(false);
      setSearchResult('Searching for farmers near you growing onions...');
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
          <Text className="text-white text-xl font-bold">Voice AI</Text>
        </View>
        <Text className="text-white/80">
          Ask me anything about crops and farming
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-600 text-center mb-8">
          Ask me anything about crops, farmers, or the market.
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
          <Text className="text-lg font-semibold text-gray-800 mb-4">Recent Queries</Text>
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