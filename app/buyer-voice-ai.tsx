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
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function BuyerVoiceAI() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [recentQueries] = useState([
    'Find fresh tomatoes near me',
    'Show market prices for onions',
    'Check my order status',
    'Find organic vegetables',
    'Contact farmer for carrots'
  ]);

  const quickActions = [
    {
      icon: <Search size={24} color="#B27E4C" />,
      title: "Find Crops",
      description: "Search for specific crops near you",
      command: "Find me fresh tomatoes"
    },
    {
      icon: <TrendingUp size={24} color="#B27E4C" />,
      title: "Market Prices",
      description: "Get current market prices",
      command: "Show market prices for rice"
    },
    {
      icon: <ShoppingCart size={24} color="#B27E4C" />,
      title: "My Orders",
      description: "Check your order status",
      command: "Check my order status"
    },
    {
      icon: <MessageSquare size={24} color="#B27E4C" />,
      title: "Contact Farmers",
      description: "Connect with farmers directly",
      command: "Contact farmer for organic vegetables"
    }
  ];

  const handleVoiceCommand = () => {
    setIsRecording(true);
    // Simulate voice processing
    setTimeout(() => {
      setIsRecording(false);
      setSearchResult('Found 5 farmers near you selling fresh tomatoes. Prices range from ₹35-45 per kg.');
    }, 2000);
  };

  const handleQuickAction = (command: string) => {
    setSearchResult(`Processing: "${command}"`);
    // Simulate processing
    setTimeout(() => {
      if (command.includes('tomatoes')) {
        setSearchResult('Found 5 farmers near you selling fresh tomatoes. Prices range from ₹35-45 per kg.');
      } else if (command.includes('prices')) {
        setSearchResult('Current market prices: Rice ₹28/kg, Wheat ₹25/kg, Onions ₹42/kg');
      } else if (command.includes('order')) {
        setSearchResult('Your recent order of 5kg carrots is out for delivery. Expected arrival: 2-3 hours.');
      } else if (command.includes('contact')) {
        setSearchResult('Found 3 organic vegetable farmers in your area. Would you like to message them?');
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
          <Text className="text-white text-xl font-bold">Voice AI Assistant</Text>
        </View>
        <Text className="text-white/80">
          Ask me to find crops, check prices, or contact farmers
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-600 text-center mb-8">
          Tap the microphone and ask me to help you find crops, check market prices, or manage your orders.
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
            {isRecording ? 'Listening...' : 'Tap to speak'}
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
            <Text className="text-gray-900 font-semibold mb-2">AI Response:</Text>
            <Text className="text-gray-700">{searchResult}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
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
          <Text className="text-lg font-bold text-gray-900 mb-4">Recent Queries</Text>
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
          <Text className="font-semibold mb-2" style={{ color: '#B27E4C' }}>💡 Voice Commands You Can Try:</Text>
          <Text className="text-gray-700 text-sm leading-5">
            • "Find organic tomatoes near me"{'\n'}
            • "What's the price of rice today?"{'\n'}
            • "Show me my recent orders"{'\n'}
            • "Contact farmers selling carrots"{'\n'}
            • "Find the cheapest onions available"
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BuyerBottomNav activeTab="home" />
    </View>
  );
}
